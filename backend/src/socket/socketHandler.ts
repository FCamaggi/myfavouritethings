import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { SocketEvent } from '../../../shared/types';
import { lobbyService } from '../services/lobbyService';
import { validateLobbyCode } from '../utils/gameUtils';

interface SocketData {
  playerId?: string;
  lobbyCode?: string;
  playerName?: string;
}

export const socketHandler = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`✅ Client connected: ${socket.id}`);

    const socketData: SocketData = {};

    // CREATE LOBBY
    socket.on(
      SocketEvent.CREATE_LOBBY,
      async (data: { playerName: string }) => {
        try {
          const playerId = uuidv4();
          const lobby = await lobbyService.createLobby(
            playerId,
            socket.id,
            data.playerName,
          );

          socketData.playerId = playerId;
          socketData.lobbyCode = lobby.code;
          socketData.playerName = data.playerName;

          // Join socket room
          socket.join(lobby.code);

          socket.emit(SocketEvent.LOBBY_CREATED, {
            lobbyCode: lobby.code,
            playerId,
            gameState: lobby.gameState,
          });

          console.log(`🎮 Lobby created: ${lobby.code} by ${data.playerName}`);
        } catch (error: any) {
          socket.emit(SocketEvent.ERROR, { message: error.message });
        }
      },
    );

    // JOIN LOBBY
    socket.on(
      SocketEvent.JOIN_LOBBY,
      async (data: { lobbyCode: string; playerName: string }) => {
        try {
          const { lobbyCode, playerName } = data;

          if (!validateLobbyCode(lobbyCode.toUpperCase())) {
            throw new Error('Invalid lobby code format');
          }

          const playerId = uuidv4();
          const result = await lobbyService.joinLobby(
            lobbyCode.toUpperCase(),
            playerId,
            socket.id,
            playerName,
          );

          if (!result) {
            throw new Error('Failed to join lobby');
          }

          socketData.playerId = playerId;
          socketData.lobbyCode = result.lobby.code;
          socketData.playerName = playerName;

          // Join socket room
          socket.join(result.lobby.code);

          // Notify the joining player
          socket.emit(SocketEvent.LOBBY_JOINED, {
            playerId,
            gameState: result.lobby.gameState,
          });

          // Notify all players in the lobby
          io.to(result.lobby.code).emit(SocketEvent.PLAYER_JOINED, {
            player: result.player,
            gameState: result.lobby.gameState,
          });

          console.log(`👋 ${playerName} joined lobby: ${result.lobby.code}`);
        } catch (error: any) {
          socket.emit(SocketEvent.ERROR, { message: error.message });
        }
      },
    );

    // START GAME
    socket.on(SocketEvent.START_GAME, async () => {
      try {
        if (!socketData.lobbyCode || !socketData.playerId) {
          throw new Error('Not in a lobby');
        }

        const gameState = await lobbyService.startGame(
          socketData.lobbyCode,
          socketData.playerId,
        );

        io.to(socketData.lobbyCode).emit(SocketEvent.GAME_STARTED, {
          gameState,
        });

        console.log(`🎯 Game started in lobby: ${socketData.lobbyCode}`);
      } catch (error: any) {
        socket.emit(SocketEvent.ERROR, { message: error.message });
      }
    });

    // SUBMIT CATEGORY
    socket.on(
      SocketEvent.SUBMIT_CATEGORY,
      async (data: { category: string }) => {
        try {
          if (!socketData.lobbyCode || !socketData.playerId) {
            throw new Error('Not in a lobby');
          }

          const gameState = await lobbyService.submitCategory(
            socketData.lobbyCode,
            socketData.playerId,
            data.category,
          );

          io.to(socketData.lobbyCode).emit(SocketEvent.GAME_STATE_CHANGED, {
            gameState,
          });

          console.log(`📝 Category submitted in ${socketData.lobbyCode}`);
        } catch (error: any) {
          socket.emit(SocketEvent.ERROR, { message: error.message });
        }
      },
    );

    // SUBMIT ANSWERS
    socket.on(
      SocketEvent.SUBMIT_ANSWERS,
      async (data: { answers: { [rank: number]: string } }) => {
        try {
          if (!socketData.lobbyCode || !socketData.playerId) {
            throw new Error('Not in a lobby');
          }

          const gameState = await lobbyService.submitAnswers(
            socketData.lobbyCode,
            socketData.playerId,
            data.answers,
          );

          io.to(socketData.lobbyCode).emit(SocketEvent.GAME_STATE_CHANGED, {
            gameState,
          });

          console.log(`✍️  Answers submitted in ${socketData.lobbyCode}`);
        } catch (error: any) {
          socket.emit(SocketEvent.ERROR, { message: error.message });
        }
      },
    );

    // START TRICKS (after reading phase)
    socket.on(SocketEvent.START_TRICKS, async () => {
      try {
        if (!socketData.lobbyCode || !socketData.playerId) {
          throw new Error('Not in a lobby');
        }

        const gameState = await lobbyService.startTricks(
          socketData.lobbyCode,
        );

        io.to(socketData.lobbyCode).emit(SocketEvent.GAME_STATE_CHANGED, {
          gameState,
        });

        console.log(`🎲 Tricks started in ${socketData.lobbyCode}`);
      } catch (error: any) {
        socket.emit(SocketEvent.ERROR, { message: error.message });
      }
    });

    // PLAY CARD
    socket.on(SocketEvent.PLAY_CARD, async (data: { cardId: string }) => {
      try {
        if (!socketData.lobbyCode || !socketData.playerId) {
          throw new Error('Not in a lobby');
        }

        const gameState = await lobbyService.playCard(
          socketData.lobbyCode,
          socketData.playerId,
          data.cardId,
        );

        io.to(socketData.lobbyCode).emit(SocketEvent.GAME_STATE_CHANGED, {
          gameState,
        });

        console.log(`🃏 Card played in ${socketData.lobbyCode}`);
      } catch (error: any) {
        socket.emit(SocketEvent.ERROR, { message: error.message });
      }
    });

    // CONTINUE TRICK
    socket.on(SocketEvent.CONTINUE_TRICK, async () => {
      try {
        if (!socketData.lobbyCode) {
          throw new Error('Not in a lobby');
        }

        const gameState = await lobbyService.continueTrick(
          socketData.lobbyCode,
        );

        io.to(socketData.lobbyCode).emit(SocketEvent.GAME_STATE_CHANGED, {
          gameState,
        });

        console.log(`▶️  Trick continued in ${socketData.lobbyCode}`);
      } catch (error: any) {
        socket.emit(SocketEvent.ERROR, { message: error.message });
      }
    });

    // NEXT ROUND
    socket.on(SocketEvent.NEXT_ROUND, async () => {
      try {
        if (!socketData.lobbyCode) {
          throw new Error('Not in a lobby');
        }

        const gameState = await lobbyService.nextRound(socketData.lobbyCode);

        io.to(socketData.lobbyCode).emit(SocketEvent.GAME_STATE_CHANGED, {
          gameState,
        });

        console.log(`🔄 Next round in ${socketData.lobbyCode}`);
      } catch (error: any) {
        socket.emit(SocketEvent.ERROR, { message: error.message });
      }
    });

    // LEAVE LOBBY
    socket.on(SocketEvent.LEAVE_LOBBY, async () => {
      try {
        if (socketData.lobbyCode && socketData.playerId) {
          await lobbyService.removePlayers(
            socketData.lobbyCode,
            socketData.playerId,
          );

          io.to(socketData.lobbyCode).emit(SocketEvent.PLAYER_LEFT, {
            playerId: socketData.playerId,
          });

          socket.leave(socketData.lobbyCode);

          console.log(
            `👋 ${socketData.playerName} left lobby: ${socketData.lobbyCode}`,
          );

          socketData.lobbyCode = undefined;
          socketData.playerId = undefined;
        }
      } catch (error: any) {
        console.error('Error leaving lobby:', error);
      }
    });

    // DISCONNECT
    socket.on('disconnect', async () => {
      if (socketData.lobbyCode && socketData.playerId) {
        try {
          await lobbyService.removePlayers(
            socketData.lobbyCode,
            socketData.playerId,
          );

          io.to(socketData.lobbyCode).emit(SocketEvent.PLAYER_LEFT, {
            playerId: socketData.playerId,
          });

          console.log(
            `🔌 ${socketData.playerName} disconnected from lobby: ${socketData.lobbyCode}`,
          );
        } catch (error) {
          console.error('Error on disconnect:', error);
        }
      }

      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
