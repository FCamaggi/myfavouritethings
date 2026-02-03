import mongoose, { Schema, Document } from 'mongoose';
import { Lobby as ILobby, GameState } from '../../../shared/types';

interface LobbyDocument extends Omit<ILobby, 'code'>, Document {
  code: string;
}

const GameStateSchema = new Schema({
  lobbyCode: { type: String, required: true },
  phase: { type: String, required: true },
  round: { type: Number, default: 1 },
  players: { type: Array, default: [] },
  startPlayerIndex: { type: Number, default: 0 },
  activePlayerIndex: { type: Number, default: 0 },
  currentTrick: { type: Array, default: [] },
  trickWinnerId: { type: String, default: null },
  winnerReason: { type: String, default: null },
  tricksPlayedInRound: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const LobbySchema: Schema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  hostId: {
    type: String,
    required: true,
  },
  gameState: {
    type: GameStateSchema,
    required: true,
  },
  maxPlayers: {
    type: Number,
    default: 4,
    min: 3,
    max: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index - MongoDB auto-deletes when expiresAt is reached
  },
});

// Index for quick lookups
LobbySchema.index({ code: 1, expiresAt: 1 });

// Update updatedAt before saving
LobbySchema.pre('save', function (next) {
  if (this.gameState) {
    (this.gameState as any).updatedAt = new Date();
  }
  next();
});

export const LobbyModel = mongoose.model<LobbyDocument>('Lobby', LobbySchema);
