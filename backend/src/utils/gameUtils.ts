import { customAlphabet } from 'nanoid';
import {
  GamePhase,
  GameState,
  Player,
  PlayerColor,
  Card,
} from '../../../shared/types';

// Generate 4-character lobby code (A-Z, 0-9, excluding similar chars)
const nanoid = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 4);

export const generateLobbyCode = (): string => {
  return nanoid();
};

export const PLAYER_COLORS: PlayerColor[] = [
  'pink',
  'yellow',
  'green',
  'blue',
  'purple',
  'orange',
];

export const createInitialGameState = (
  lobbyCode: string,
  hostId: string,
): GameState => {
  return {
    lobbyCode,
    phase: GamePhase.LOBBY,
    round: 1,
    players: [],
    startPlayerIndex: 0,
    activePlayerIndex: 0,
    currentTrick: [],
    trickWinnerId: null,
    winnerReason: null,
    tricksPlayedInRound: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

export const createPlayer = (
  playerId: string,
  socketId: string,
  name: string,
  color: PlayerColor,
  isHost: boolean,
): Player => {
  return {
    id: playerId,
    socketId,
    name,
    color,
    score: 0,
    hand: [],
    category: '',
    assignedCategoryBy: '',
    isConnected: true,
    isHost,
  };
};

export const createCard = (rank: number, ownerId: string): Card => {
  const isBrokenHeart = rank === 6;
  return {
    id: `${ownerId}-${rank}`,
    rank: isBrokenHeart ? 100 : rank, // Broken heart = 100 for comparison
    isBrokenHeart,
    text: '',
    ownerId,
    isPlayed: false,
  };
};

export const createPlayerHand = (playerId: string): Card[] => {
  return [1, 2, 3, 4, 5, 6].map((rank) => createCard(rank, playerId));
};

export const getAvailableColor = (players: Player[]): PlayerColor | null => {
  const usedColors = players.map((p) => p.color);
  const availableColor = PLAYER_COLORS.find(
    (color) => !usedColors.includes(color),
  );
  return availableColor || null;
};

export const validateLobbyCode = (code: string): boolean => {
  return /^[A-Z0-9]{4}$/.test(code);
};

export const getLobbyExpirationTime = (): Date => {
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 2); // 2 hours
  return expirationTime;
};
