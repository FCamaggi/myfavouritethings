import { io, Socket } from 'socket.io-client';
import { SocketEvent, GameState, Player } from '../types';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
  private socket: Socket | null = null;
  private eventHandlers: Map<string, Function[]> = new Map();

  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.setupDefaultHandlers();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupDefaultHandlers(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  // Event emitters
  createLobby(playerName: string): void {
    this.socket?.emit(SocketEvent.CREATE_LOBBY, { playerName });
  }

  joinLobby(lobbyCode: string, playerName: string): void {
    this.socket?.emit(SocketEvent.JOIN_LOBBY, {
      lobbyCode: lobbyCode.toUpperCase(),
      playerName,
    });
  }

  leaveLobby(): void {
    this.socket?.emit(SocketEvent.LEAVE_LOBBY);
  }

  startGame(): void {
    this.socket?.emit(SocketEvent.START_GAME);
  }

  submitCategory(category: string): void {
    this.socket?.emit(SocketEvent.SUBMIT_CATEGORY, { category });
  }

  submitAnswers(answers: { [rank: number]: string }): void {
    this.socket?.emit(SocketEvent.SUBMIT_ANSWERS, { answers });
  }

  startTricks(): void {
    this.socket?.emit(SocketEvent.START_TRICKS);
  }

  playCard(cardId: string): void {
    this.socket?.emit(SocketEvent.PLAY_CARD, { cardId });
  }

  continueTrick(): void {
    this.socket?.emit(SocketEvent.CONTINUE_TRICK);
  }

  nextRound(): void {
    this.socket?.emit(SocketEvent.NEXT_ROUND);
  }

  // Event listeners
  onLobbyCreated(
    callback: (data: {
      lobbyCode: string;
      playerId: string;
      gameState: GameState;
    }) => void,
  ): void {
    this.on(SocketEvent.LOBBY_CREATED, callback);
  }

  onLobbyJoined(
    callback: (data: { playerId: string; gameState: GameState }) => void,
  ): void {
    this.on(SocketEvent.LOBBY_JOINED, callback);
  }

  onPlayerJoined(
    callback: (data: { player: Player; gameState: GameState }) => void,
  ): void {
    this.on(SocketEvent.PLAYER_JOINED, callback);
  }

  onPlayerLeft(callback: (data: { playerId: string }) => void): void {
    this.on(SocketEvent.PLAYER_LEFT, callback);
  }

  onGameStarted(callback: (data: { gameState: GameState }) => void): void {
    this.on(SocketEvent.GAME_STARTED, callback);
  }

  onGameStateChanged(callback: (data: { gameState: GameState }) => void): void {
    this.on(SocketEvent.GAME_STATE_CHANGED, callback);
  }

  onError(callback: (data: { message: string }) => void): void {
    this.on(SocketEvent.ERROR, callback);
  }

  private on(event: string, callback: Function): void {
    if (!this.socket) return;

    this.socket.on(event, callback);

    // Track handlers for cleanup
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(callback);
  }

  removeAllListeners(): void {
    this.eventHandlers.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        this.socket?.off(event, handler as any);
      });
    });
    this.eventHandlers.clear();
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
