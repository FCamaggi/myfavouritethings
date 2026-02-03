// Shared types between frontend and backend

export enum GamePhase {
  LOBBY = 'LOBBY',
  CATEGORY_SELECTION = 'CATEGORY_SELECTION',
  WRITING_ANSWERS = 'WRITING_ANSWERS',
  TRICK_START = 'TRICK_START',
  TRICK_PLAYING = 'TRICK_PLAYING',
  TRICK_RESOLUTION = 'TRICK_RESOLUTION',
  ROUND_END = 'ROUND_END',
  GAME_END = 'GAME_END',
}

export type PlayerColor =
  | 'pink'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'orange';

export interface Card {
  id: string;
  rank: number; // 1-5, and 100 for Broken Heart
  isBrokenHeart: boolean;
  text: string;
  ownerId: string; // Now UUID string instead of number
  isPlayed: boolean;
}

export interface Player {
  id: string; // UUID
  socketId: string;
  name: string;
  color: PlayerColor;
  score: number;
  hand: Card[];
  category: string;
  assignedCategoryBy: string; // Player ID who gave the category
  isConnected: boolean;
  isHost: boolean;
  hasSubmittedCategory?: boolean;
  hasSubmittedAnswers?: boolean;
}

export interface PlayedCard {
  card: Card;
  playerId: string;
  order: number;
}

export interface GameState {
  lobbyCode: string;
  phase: GamePhase;
  round: number;
  players: Player[];
  startPlayerIndex: number;
  activePlayerIndex: number;
  currentTrick: PlayedCard[];
  trickWinnerId: string | null;
  winnerReason: string | null;
  tricksPlayedInRound: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lobby {
  code: string;
  hostId: string;
  gameState: GameState;
  maxPlayers: number;
  createdAt: Date;
  expiresAt: Date;
}

// WebSocket Events
export enum SocketEvent {
  // Client → Server
  CREATE_LOBBY = 'create-lobby',
  JOIN_LOBBY = 'join-lobby',
  LEAVE_LOBBY = 'leave-lobby',
  START_GAME = 'start-game',
  SUBMIT_CATEGORY = 'submit-category',
  SUBMIT_ANSWERS = 'submit-answers',
  PLAY_CARD = 'play-card',
  CONTINUE_TRICK = 'continue-trick',
  NEXT_ROUND = 'next-round',

  // Server → Client
  LOBBY_CREATED = 'lobby-created',
  LOBBY_JOINED = 'lobby-joined',
  LOBBY_UPDATED = 'lobby-updated',
  PLAYER_JOINED = 'player-joined',
  PLAYER_LEFT = 'player-left',
  GAME_STARTED = 'game-started',
  GAME_STATE_CHANGED = 'game-state-changed',
  TRICK_RESOLVED = 'trick-resolved',
  ERROR = 'error',
  DISCONNECT = 'disconnect',
  RECONNECTED = 'reconnected',
}

// API Responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CreateLobbyResponse {
  lobbyCode: string;
  playerId: string;
}

export interface JoinLobbyResponse {
  playerId: string;
  gameState: GameState;
}
