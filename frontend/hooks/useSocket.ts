import { useEffect, useState } from 'react';
import { socketService } from '../services/socketService';
import { GameState } from '../types';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socketService.connect();

    const checkConnection = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 1000);

    // Set up event listeners
    socketService.onLobbyCreated((data) => {
      setPlayerId(data.playerId);
      setGameState(data.gameState);
    });

    socketService.onLobbyJoined((data) => {
      setPlayerId(data.playerId);
      setGameState(data.gameState);
    });

    socketService.onPlayerJoined((data) => {
      setGameState(data.gameState);
    });

    socketService.onPlayerLeft((data) => {
      if (gameState) {
        const updatedPlayers = gameState.players.filter(
          (p) => p.id !== data.playerId,
        );
        setGameState({ ...gameState, players: updatedPlayers });
      }
    });

    socketService.onGameStarted((data) => {
      setGameState(data.gameState);
    });

    socketService.onGameStateChanged((data) => {
      setGameState(data.gameState);
    });

    socketService.onError((data) => {
      setError(data.message);
      setTimeout(() => setError(null), 5000);
    });

    return () => {
      clearInterval(checkConnection);
      socketService.removeAllListeners();
      socketService.disconnect();
    };
  }, []);

  return {
    isConnected,
    gameState,
    playerId,
    error,
    createLobby: socketService.createLobby.bind(socketService),
    joinLobby: socketService.joinLobby.bind(socketService),
    leaveLobby: socketService.leaveLobby.bind(socketService),
    startGame: socketService.startGame.bind(socketService),
    submitCategory: socketService.submitCategory.bind(socketService),
    submitAnswers: socketService.submitAnswers.bind(socketService),
    startTricks: socketService.startTricks.bind(socketService),
    playCard: socketService.playCard.bind(socketService),
    continueTrick: socketService.continueTrick.bind(socketService),
    nextRound: socketService.nextRound.bind(socketService),
  };
};
