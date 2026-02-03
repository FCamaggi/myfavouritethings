import { LobbyModel } from '../models/Lobby';
import {
  GamePhase,
  GameState,
  Player,
  Lobby,
  Card,
  PlayedCard,
} from '../../../shared/types';
import {
  generateLobbyCode,
  createInitialGameState,
  createPlayer,
  getAvailableColor,
  getLobbyExpirationTime,
  createPlayerHand,
} from '../utils/gameUtils';
import { determineTrickWinner } from '../utils/gameLogic';

const MAX_TRICKS = 5;
const TOTAL_ROUNDS = 2;

export class LobbyService {
  async createLobby(
    hostId: string,
    hostSocketId: string,
    hostName: string,
  ): Promise<Lobby> {
    const code = generateLobbyCode();
    const gameState = createInitialGameState(code, hostId);

    // Add host as first player
    const hostColor = getAvailableColor([])!;
    const hostPlayer = createPlayer(
      hostId,
      hostSocketId,
      hostName,
      hostColor,
      true,
    );
    gameState.players.push(hostPlayer);

    const lobby: Lobby = {
      code,
      hostId,
      gameState,
      maxPlayers: 4,
      createdAt: new Date(),
      expiresAt: getLobbyExpirationTime(),
    };

    await LobbyModel.create(lobby);
    return lobby;
  }

  async getLobby(code: string): Promise<Lobby | null> {
    const lobby = await LobbyModel.findOne({ code });
    return lobby as Lobby | null;
  }

  async joinLobby(
    code: string,
    playerId: string,
    socketId: string,
    playerName: string,
  ): Promise<{ lobby: Lobby; player: Player } | null> {
    const lobby = await this.getLobby(code);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    if (lobby.gameState.phase !== GamePhase.LOBBY) {
      throw new Error('Game already started');
    }

    if (lobby.gameState.players.length >= lobby.maxPlayers) {
      throw new Error('Lobby is full');
    }

    // Check if player already exists (reconnection)
    const existingPlayer = lobby.gameState.players.find(
      (p) => p.id === playerId,
    );
    if (existingPlayer) {
      existingPlayer.socketId = socketId;
      existingPlayer.isConnected = true;
      await this.updateLobby(lobby);
      return { lobby, player: existingPlayer };
    }

    // Add new player
    const availableColor = getAvailableColor(lobby.gameState.players);
    if (!availableColor) {
      throw new Error('No colors available');
    }

    const newPlayer = createPlayer(
      playerId,
      socketId,
      playerName,
      availableColor,
      false,
    );
    lobby.gameState.players.push(newPlayer);

    await this.updateLobby(lobby);
    return { lobby, player: newPlayer };
  }

  async startGame(code: string, playerId: string): Promise<GameState> {
    const lobby = await this.getLobby(code);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    if (lobby.hostId !== playerId) {
      throw new Error('Only host can start the game');
    }

    if (lobby.gameState.players.length < 3) {
      throw new Error('Need at least 3 players');
    }

    // Initialize game
    lobby.gameState.phase = GamePhase.CATEGORY_SELECTION;
    lobby.gameState.startPlayerIndex = 0;
    lobby.gameState.activePlayerIndex = 0;
    lobby.gameState.round = 1;

    console.log('🎯 Starting game with players:', lobby.gameState.players.map(p => `${p.name}(${p.id})`).join(', '));

    // Assign categories (Round 1: pass left)
    this.assignCategories(lobby.gameState, 1);

    console.log('📋 Category assignments:');
    lobby.gameState.players.forEach(p => {
      console.log(`  ${p.name} assigned category by: ${p.assignedCategoryBy}`);
    });

    // Create hands for all players
    lobby.gameState.players.forEach((player) => {
      player.hand = createPlayerHand(player.id);
      player.score = 0;
      console.log(`🃏 Created hand for ${player.name}:`, player.hand.map(c => `${c.id}(rank:${c.rank})`).join(', '));
    });

    await this.updateLobby(lobby);
    return lobby.gameState;
  }

  async submitCategory(
    code: string,
    playerId: string,
    category: string,
  ): Promise<GameState> {
    const lobby = await this.getLobby(code);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    const player = lobby.gameState.players.find((p) => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Mark as submitted
    player.hasSubmittedCategory = true;

    // Find the target player (who will receive this category)
    const targetPlayer = lobby.gameState.players.find(
      (p) => p.assignedCategoryBy === playerId,
    );
    
    console.log(`📝 ${player.name} (${playerId}) submitting category "${category}" for ${targetPlayer?.name || 'unknown'}`);
    
    if (targetPlayer) {
      targetPlayer.category = category;
      console.log(`✅ Category assigned to ${targetPlayer.name}: "${targetPlayer.category}"`);
    } else {
      console.log(`❌ No target player found for ${player.name}`);
    }

    // Check if all categories are submitted (check by hasSubmittedCategory flag)
    const allCategoriesSubmitted = lobby.gameState.players.every(
      (p) => p.hasSubmittedCategory === true,
    );

    console.log(`📊 Categories status: ${lobby.gameState.players.map(p => `${p.name}(${p.hasSubmittedCategory ? '✓' : '✗'})`).join(', ')}`);

    if (allCategoriesSubmitted) {
      console.log('🎯 All categories submitted! Moving to WRITING_ANSWERS');
      lobby.gameState.phase = GamePhase.WRITING_ANSWERS;
      lobby.gameState.activePlayerIndex = 0;
      
      // Reset flags for next phase
      lobby.gameState.players.forEach(p => {
        p.hasSubmittedCategory = false;
        p.hasSubmittedAnswers = false;
      });
    }

    await this.updateLobby(lobby);
    return lobby.gameState;
  }

  async submitAnswers(
    code: string,
    playerId: string,
    answers: { [rank: number]: string },
  ): Promise<GameState> {
    const lobby = await this.getLobby(code);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    const player = lobby.gameState.players.find((p) => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    console.log(`✍️  ${player.name} submitting answers for category: "${player.category}"`);
    console.log(`  Player's assignedCategoryBy: ${player.assignedCategoryBy}`);
    console.log(`  Answers received:`, answers);

    // Mark as submitted
    player.hasSubmittedAnswers = true;

    // Find the owner of the cards (who assigned the category to this player)
    // If player.assignedCategoryBy = "B", then player writes ON player B's cards
    const cardOwner = lobby.gameState.players.find(
      (p) => p.id === player.assignedCategoryBy,
    );

    if (!cardOwner) {
      console.log(`❌ Card owner not found! Looking for ID: ${player.assignedCategoryBy}`);
      console.log(`  Available players:`, lobby.gameState.players.map(p => `${p.name}(${p.id})`).join(', '));
      throw new Error('Card owner not found');
    }

    console.log(`  Writing on ${cardOwner.name}'s cards`);
    console.log(`  ${cardOwner.name}'s hand before:`, cardOwner.hand.map(c => `${c.id}:${c.rank}="${c.text}"`).join(', '));

    // Update card texts on the OWNER's hand
    cardOwner.hand.forEach((card) => {
      const rankKey = card.isBrokenHeart ? 6 : card.rank;
      if (answers[rankKey]) {
        card.text = answers[rankKey];
        console.log(`  ✏️ Set card ${card.id} (rank ${rankKey}): "${card.text}"`);
      } else {
        console.log(`  ⚠️ No answer for card ${card.id} (rank ${rankKey})`);
      }
    });

    console.log(`  ${cardOwner.name}'s hand after:`, cardOwner.hand.map(c => `${c.id}:${c.rank}="${c.text}"`).join(', '));

    // Check if all players submitted answers (use flag instead of checking text)
    const allAnswersSubmitted = lobby.gameState.players.every(
      (p) => p.hasSubmittedAnswers === true,
    );

    console.log(`📊 Answers status: ${lobby.gameState.players.map(p => `${p.name}(${p.hasSubmittedAnswers ? '✓' : '✗'})`).join(', ')}`);

    if (allAnswersSubmitted) {
      console.log('🎯 All answers submitted! Moving to READING_PHASE');
      lobby.gameState.phase = GamePhase.READING_PHASE;
      // Note: We don't initialize trick state yet - that happens in startTricks()
    }

    await this.updateLobby(lobby);
    return lobby.gameState;
  }

  async startTricks(code: string): Promise<GameState> {
    const lobby = await this.getLobby(code);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    if (lobby.gameState.phase !== GamePhase.READING_PHASE) {
      throw new Error('Can only start tricks from READING_PHASE');
    }

    console.log('🎲 Starting tricks phase - all players have read their cards');
    
    // Initialize trick state
    lobby.gameState.phase = GamePhase.TRICK_START;
    lobby.gameState.activePlayerIndex = lobby.gameState.startPlayerIndex;
    lobby.gameState.currentTrick = [];
    lobby.gameState.tricksPlayedInRound = 0;

    await this.updateLobby(lobby);
    return lobby.gameState;
  }

  async playCard(
    code: string,
    playerId: string,
    cardId: string,
  ): Promise<GameState> {
    const lobby = await this.getLobby(code);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    const player = lobby.gameState.players.find((p) => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    if (
      lobby.gameState.players[lobby.gameState.activePlayerIndex].id !== playerId
    ) {
      throw new Error('Not your turn');
    }

    const card = player.hand.find((c) => c.id === cardId && !c.isPlayed);
    if (!card) {
      throw new Error('Card not found or already played');
    }

    // Mark card as played
    card.isPlayed = true;

    // Add to current trick
    lobby.gameState.currentTrick.push({
      card,
      playerId,
      order: lobby.gameState.currentTrick.length,
    });

    // Check if trick is complete
    if (
      lobby.gameState.currentTrick.length === lobby.gameState.players.length
    ) {
      lobby.gameState.phase = GamePhase.TRICK_RESOLUTION;

      // Determine winner
      const result = determineTrickWinner(lobby.gameState.currentTrick);
      lobby.gameState.trickWinnerId = result.winnerId;
      lobby.gameState.winnerReason = result.reason;

      // Award heart to winner
      const winner = lobby.gameState.players.find(
        (p) => p.id === result.winnerId,
      );
      if (winner) {
        winner.score++;
      }
    } else {
      // Move to next player
      lobby.gameState.phase = GamePhase.TRICK_PLAYING;
      lobby.gameState.activePlayerIndex =
        (lobby.gameState.activePlayerIndex + 1) %
        lobby.gameState.players.length;
    }

    await this.updateLobby(lobby);
    return lobby.gameState;
  }

  async continueTrick(code: string): Promise<GameState> {
    const lobby = await this.getLobby(code);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    lobby.gameState.tricksPlayedInRound++;
    lobby.gameState.currentTrick = [];
    lobby.gameState.trickWinnerId = null;
    lobby.gameState.winnerReason = null;

    // Check if round is complete
    if (lobby.gameState.tricksPlayedInRound >= MAX_TRICKS) {
      if (lobby.gameState.round >= TOTAL_ROUNDS) {
        lobby.gameState.phase = GamePhase.GAME_END;
      } else {
        lobby.gameState.phase = GamePhase.ROUND_END;
      }
    } else {
      // Start next trick
      lobby.gameState.phase = GamePhase.TRICK_START;
      // Winner starts next trick (según manual: "El ganador de cada baza inicia la siguiente")
      // Esto implementa correctamente la rotación del primer jugador
      if (lobby.gameState.trickWinnerId) {
        const winnerIndex = lobby.gameState.players.findIndex(
          (p) => p.id === lobby.gameState.trickWinnerId,
        );
        if (winnerIndex !== -1) {
          lobby.gameState.activePlayerIndex = winnerIndex;
        }
      }
    }

    await this.updateLobby(lobby);
    return lobby.gameState;
  }

  async nextRound(code: string): Promise<GameState> {
    const lobby = await this.getLobby(code);

    if (!lobby) {
      throw new Error('Lobby not found');
    }

    lobby.gameState.round++;
    lobby.gameState.phase = GamePhase.CATEGORY_SELECTION;
    lobby.gameState.tricksPlayedInRound = 0;
    lobby.gameState.currentTrick = [];

    // Reset cards
    lobby.gameState.players.forEach((player) => {
      player.hand = createPlayerHand(player.id);
      player.category = '';
    });

    // Assign categories (Round 2: pass right)
    this.assignCategories(lobby.gameState, lobby.gameState.round);

    // Rotate start player
    lobby.gameState.startPlayerIndex =
      (lobby.gameState.startPlayerIndex + 1) % lobby.gameState.players.length;
    lobby.gameState.activePlayerIndex = lobby.gameState.startPlayerIndex;

    await this.updateLobby(lobby);
    return lobby.gameState;
  }

  async removePlayers(code: string, playerId: string): Promise<void> {
    const lobby = await this.getLobby(code);

    if (!lobby) {
      return;
    }

    const playerIndex = lobby.gameState.players.findIndex(
      (p) => p.id === playerId,
    );
    if (playerIndex === -1) {
      return;
    }

    lobby.gameState.players.splice(playerIndex, 1);

    // If lobby is empty, delete it
    if (lobby.gameState.players.length === 0) {
      await LobbyModel.deleteOne({ code });
      return;
    }

    // If host left, assign new host
    if (lobby.hostId === playerId) {
      lobby.hostId = lobby.gameState.players[0].id;
      lobby.gameState.players[0].isHost = true;
    }

    await this.updateLobby(lobby);
  }

  private assignCategories(gameState: GameState, round: number): void {
    const playerCount = gameState.players.length;

    for (let i = 0; i < playerCount; i++) {
      if (round === 1) {
        // Round 1: Pass left (assign category to player on your left)
        const targetIndex = (i + 1) % playerCount;
        gameState.players[targetIndex].assignedCategoryBy =
          gameState.players[i].id;
      } else {
        // Round 2: Pass right (assign category to player on your right)
        const targetIndex = (i - 1 + playerCount) % playerCount;
        gameState.players[targetIndex].assignedCategoryBy =
          gameState.players[i].id;
      }
    }
  }

  private async updateLobby(lobby: Lobby): Promise<void> {
    lobby.gameState.updatedAt = new Date();
    await LobbyModel.findOneAndUpdate({ code: lobby.code }, lobby, {
      new: true,
    });
  }
}

export const lobbyService = new LobbyService();
