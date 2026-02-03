import React, { useState, useEffect } from 'react';
import { GamePhase } from './types';
import { useSocket } from './hooks/useSocket';
import { HeartIcon, BrokenHeartIcon } from './constants';
import { ManualModal, ExamplesModal } from './components/GameModals';
import { TutorialModal } from './components/TutorialModal';

// Import components (crearemos después)
// import { LobbyScreen } from './components/LobbyScreen';
// import { LobbyWaitingRoom } from './components/LobbyWaitingRoom';
// import { CategoryPhase } from './components/CategoryPhase';
// import { AnswerPhase } from './components/AnswerPhase';
// import { TrickPhase } from './components/TrickPhase';
// import { RoundEndPhase } from './components/RoundEndPhase';
// import { GameEndPhase } from './components/GameEndPhase';

function App() {
  const {
    isConnected,
    gameState,
    playerId,
    error,
    createLobby,
    joinLobby,
    leaveLobby,
    startGame,
    submitCategory,
    submitAnswers,
    startTricks,
    playCard,
    continueTrick,
    nextRound
  } = useSocket();

  const [playerName, setPlayerName] = useState('');
  const [lobbyCode, setLobbyCode] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Auto-show tutorial on first visit
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('mft_tutorial_completed');
    if (!tutorialCompleted && !gameState) {
      setShowTutorial(true);
    }
  }, [gameState]);

  // Si no hay gameState, mostrar lobby screen
  if (!gameState) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mft-blue via-mft-purple to-mft-pink flex items-center justify-center p-4">
        {showManual && <ManualModal onClose={() => setShowManual(false)} />}
        {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="font-display text-4xl text-mft-blue mb-2">
              My Favourite Things
            </h1>
            <p className="text-gray-600">Versión Multiplayer</p>
            {!isConnected && (
              <p className="text-yellow-600 mt-2 text-sm">🔄 Conectando...</p>
            )}
          </div>

          {/* Tutorial and Manual Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setShowTutorial(true)}
              className="text-mft-blue font-bold hover:text-mft-purple transition-colors flex items-center gap-2 text-base hover:scale-105 transform"
            >
              <span>🎓</span>
              <span>Tutorial</span>
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={() => setShowManual(true)}
              className="text-mft-pink font-bold hover:text-mft-blue transition-colors flex items-center gap-2 text-base hover:scale-105 transform"
            >
              <span>📖</span>
              <span>Manual</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {!showJoinForm ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Escribe tu nombre..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-mft-blue focus:outline-none"
                  maxLength={20}
                />
              </div>

              <button
                onClick={() => createLobby(playerName)}
                disabled={!isConnected || playerName.length < 1}
                className="w-full bg-mft-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                🎮 Crear Lobby
              </button>

              <div className="text-center text-gray-500 text-sm">o</div>

              <button
                onClick={() => setShowJoinForm(true)}
                disabled={!isConnected}
                className="w-full bg-mft-purple text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                🚪 Unirse a Lobby
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Escribe tu nombre..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-mft-blue focus:outline-none"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código del lobby
                </label>
                <input
                  type="text"
                  value={lobbyCode}
                  onChange={(e) => setLobbyCode(e.target.value.toUpperCase())}
                  placeholder="Ej: A3F9"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-mft-purple focus:outline-none text-center text-2xl font-mono tracking-widest"
                  maxLength={4}
                />
              </div>

              <button
                onClick={() => joinLobby(lobbyCode, playerName)}
                disabled={!isConnected || playerName.length < 1 || lobbyCode.length !== 4}
                className="w-full bg-mft-purple text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                ✅ Unirse
              </button>

              <button
                onClick={() => setShowJoinForm(false)}
                className="w-full text-gray-600 py-2 text-sm hover:text-gray-800"
              >
                ← Volver
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>Conecta con amigos desde cualquier dispositivo</p>
            <p className="mt-1">Mínimo 3 jugadores • Máximo 6 jugadores</p>
          </div>
        </div>
      </div>
    );
  }

  // Render según la fase del juego
  return (
    <div className="min-h-screen bg-gradient-to-br from-mft-blue via-mft-purple to-mft-pink">
      {/* Error toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slideIn">
          <p>{error}</p>
        </div>
      )}

      {/* Render según fase */}
      {gameState.phase === GamePhase.LOBBY && (
        <LobbyWaitingRoom 
          gameState={gameState} 
          playerId={playerId!}
          onStartGame={() => startGame(gameState.lobbyCode)}
          onLeave={() => leaveLobby(gameState.lobbyCode)}
        />
      )}

      {gameState.phase === GamePhase.CATEGORY_SELECTION && (
        <>
          {showExamples && <ExamplesModal onClose={() => setShowExamples(false)} />}
          <CategoryPhaseComponent
            gameState={gameState}
            playerId={playerId!}
            onSubmit={(category) => submitCategory(category)}
            onShowExamples={() => setShowExamples(true)}
          />
        </>
      )}

      {gameState.phase === GamePhase.WRITING_ANSWERS && (
        <AnswerPhaseComponent
          gameState={gameState}
          playerId={playerId!}
          onSubmit={(answers) => submitAnswers(answers)}
        />
      )}

      {gameState.phase === GamePhase.READING_PHASE && (
        <ReadingPhaseComponent
          gameState={gameState}
          playerId={playerId!}
          onStartTricks={() => startTricks()}
        />
      )}

      {(gameState.phase === GamePhase.TRICK_START || 
        gameState.phase === GamePhase.TRICK_PLAYING) && (
        <TrickPhaseComponent
          gameState={gameState}
          playerId={playerId!}
          onPlayCard={(cardId) => playCard(cardId)}
        />
      )}

      {gameState.phase === GamePhase.TRICK_RESOLUTION && (
        <TrickResolutionComponent
          gameState={gameState}
          playerId={playerId!}
          onContinue={() => continueTrick()}
        />
      )}

      {gameState.phase === GamePhase.ROUND_END && (
        <RoundEndComponent
          gameState={gameState}
          playerId={playerId!}
          onNextRound={() => nextRound()}
        />
      )}

      {gameState.phase === GamePhase.GAME_END && (
        <GameEndComponent
          gameState={gameState}
          playerId={playerId!}
          onNewGame={() => {
            leaveLobby();
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

// Componentes temporales (simplificados) - se crearán completos después

function LobbyWaitingRoom({ gameState, playerId, onStartGame, onLeave }: any) {
  const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
  const isHost = currentPlayer?.isHost;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-mft-blue mb-4">Lobby</h1>
          <div className="bg-mft-yellow/20 border-2 border-mft-yellow rounded-xl p-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">Código del lobby:</p>
            <p className="text-5xl font-mono font-bold text-mft-blue tracking-widest">
              {gameState.lobbyCode}
            </p>
            <p className="text-xs text-gray-500 mt-2">Comparte este código con tus amigos</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg mb-4">
            Jugadores ({gameState.players.length}/6)
          </h3>
          <div className="space-y-2">
            {gameState.players.map((player: any) => (
              <div
                key={player.id}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 ${
                  player.id === playerId ? 'border-mft-blue bg-blue-50' : 'border-gray-200'
                }`}
              >
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: `var(--color-${player.color})` }}
                />
                <span className="font-medium flex-1">{player.name}</span>
                {player.isHost && (
                  <span className="text-xs bg-mft-yellow text-white px-2 py-1 rounded">
                    HOST
                  </span>
                )}
                {player.id === playerId && (
                  <span className="text-xs bg-mft-blue text-white px-2 py-1 rounded">
                    TÚ
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {gameState.players.length < 3 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              ⏳ Esperando más jugadores... (mínimo 3)
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {isHost && (
            <button
              onClick={onStartGame}
              disabled={gameState.players.length < 3}
              className="flex-1 bg-mft-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              🚀 Iniciar Juego
            </button>
          )}
          <button
            onClick={onLeave}
            className="px-6 bg-gray-200 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoryPhaseComponent({ gameState, playerId, onSubmit, onShowExamples }: any) {
  const [category, setCategory] = useState('');
  const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
  const hasSubmitted = currentPlayer?.hasSubmittedCategory;

  // Encontrar a quién le asignamos categoría
  const assignedPlayer = gameState.players.find(
    (p: any) => p.assignedCategoryBy === playerId
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
        <h2 className="font-display text-3xl text-center text-mft-purple mb-6">
          Asignar Categoría
        </h2>

        {!hasSubmitted ? (
          <>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mb-6">
              <p className="text-center text-lg">
                Escribe una categoría para <strong>{assignedPlayer?.name}</strong>
              </p>
              <p className="text-center text-sm text-gray-600 mt-2">
                Ronda {gameState.round} - Categoría pasa a la{' '}
                {gameState.round === 1 ? 'izquierda' : 'derecha'}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Ej: Lugares para viajar"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-mft-purple focus:outline-none"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {category.length}/100 caracteres
              </p>
            </div>

            {/* Helper tooltip */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4 text-sm">
              <p className="text-gray-700 text-center">
                <strong className="text-mft-purple">Ronda {gameState.round}:</strong> {gameState.round === 1 ? '⬅️ Izquierda' : '➡️ Derecha'} • 
                <span className="text-xs ml-1">💡 Elige categorías con muchas opciones</span>
              </p>
            </div>

            {/* Botón de ejemplos */}
            <div className="flex justify-center mb-6">
              <button
                onClick={onShowExamples}
                className="text-gray-400 font-bold text-sm hover:text-black flex items-center gap-2 transition-colors hover:scale-105 transform"
              >
                <span>💡</span> Ver Ejemplos de Categorías
              </button>
            </div>

            <button
              onClick={() => onSubmit(category)}
              disabled={category.length < 1}
              className="w-full bg-mft-purple text-white py-4 rounded-xl font-bold text-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              ✅ Enviar Categoría
            </button>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-xl font-bold text-mft-purple mb-2">
              ¡Categoría enviada!
            </p>
            <p className="text-gray-600">
              Esperando a los demás jugadores...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnswerPhaseComponent({ gameState, playerId, onSubmit }: any) {
  const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const hasSubmitted = currentPlayer?.hasSubmittedAnswers;

  // Find who gave me this category (I'm writing on THEIR cards)
  const cardOwner = gameState.players.find(
    (p: any) => p.assignedCategoryBy === playerId
  );

  const handleAnswerChange = (rank: number, value: string) => {
    setAnswers({ ...answers, [rank]: value });
  };

  const allAnswersFilled = [1, 2, 3, 4, 5, 6].every(
    (rank) => answers[rank]?.length > 0
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        <h2 className="font-display text-3xl text-center text-mft-green mb-6">
          Escribir Respuestas
        </h2>

        {!hasSubmitted ? (
          <>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <p className="text-center text-lg font-bold text-mft-green">
                Categoría: {currentPlayer?.category || 'Sin categoría'}
              </p>
              <p className="text-center text-sm text-gray-600 mt-2">
                Escribe 6 cosas para esta categoría
              </p>
              <p className="text-center text-xs text-gray-500 mt-1">
                (Estas respuestas irán en las cartas de {cardOwner?.name})
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {[1, 2, 3, 4, 5, 6].map((rank) => {
                const isBrokenHeart = rank === 6;
                return (
                  <div key={rank} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 text-center">
                      {isBrokenHeart ? (
                        <div className="text-3xl">💔</div>
                      ) : (
                        <div className="text-3xl">#{rank}</div>
                      )}
                    </div>
                    <input
                      type="text"
                      value={answers[rank] || ''}
                      onChange={(e) => handleAnswerChange(rank, e.target.value)}
                      placeholder={
                        isBrokenHeart
                          ? 'Algo que NO te gusta...'
                          : `Tu ${rank === 1 ? 'favorito absoluto' : `favorito #${rank}`}...`
                      }
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-mft-green focus:outline-none"
                      maxLength={50}
                    />
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onSubmit(answers)}
              disabled={!allAnswersFilled}
              className="w-full bg-mft-green text-white py-4 rounded-xl font-bold text-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              ✅ Enviar Respuestas
            </button>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✓</div>
            <p className="text-xl font-bold text-mft-green mb-2">
              ¡Respuestas enviadas!
            </p>
            <p className="text-gray-600">
              Esperando a los demás jugadores...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ReadingPhaseComponent({ gameState, playerId, onStartTricks }: any) {
  const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
  const isHost = currentPlayer?.isHost;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="font-display text-3xl text-center text-mft-blue mb-2">
            📖 Lectura de Respuestas
          </h2>
          <p className="text-center text-gray-600">
            Todos leen sus categorías y respuestas en voz alta
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            (Recuerda: los números están OCULTOS, solo se revelan al jugar las cartas)
          </p>
        </div>

        {/* Grid de todos los jugadores con sus respuestas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {gameState.players.map((player: any) => {
            const isMe = player.id === playerId;
            return (
              <div 
                key={player.id} 
                className={`bg-white rounded-2xl shadow-lg p-6 ${
                  isMe ? 'ring-4 ring-mft-pink' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: `var(--color-${player.color})` }}
                    >
                      {player.name[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {player.name} {isMe && '(Tú)'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {player.score} {HeartIcon}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Categoría */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Categoría:</p>
                  <p className="font-bold text-lg text-mft-purple">
                    {player.category}
                  </p>
                </div>

                {/* Respuestas (sin números) */}
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 font-bold mb-2">Sus respuestas:</p>
                  {player.hand
                    .sort((a: any, b: any) => {
                      // Sort: ranks 1-5, then broken heart (100)
                      if (a.isBrokenHeart) return 1;
                      if (b.isBrokenHeart) return -1;
                      return a.rank - b.rank;
                    })
                    .map((card: any, index: number) => (
                      <div 
                        key={card.id} 
                        className="flex items-center gap-2 bg-gray-50 rounded-lg p-3"
                      >
                        <span className="text-lg">
                          {card.isBrokenHeart ? '💔' : '❓'}
                        </span>
                        <span className="flex-1 text-gray-800">
                          {card.text || '(Sin respuesta)'}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botón para continuar (solo host) */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {isHost ? (
            <button
              onClick={onStartTricks}
              className="w-full bg-mft-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
            >
              🎲 ¡Comenzar a Jugar Bazas!
            </button>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">
                ⏳ Esperando que el host inicie el juego...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TrickPhaseComponent({ gameState, playerId, onPlayCard }: any) {
  const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
  const isMyTurn = gameState.activePlayerIndex === gameState.players.findIndex((p: any) => p.id === playerId);
  const activePlayer = gameState.players[gameState.activePlayerIndex];
  const firstPlayerThisTrick = gameState.currentTrick.length > 0 
    ? gameState.players.find((p: any) => p.id === gameState.currentTrick[0].playerId)
    : activePlayer;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h2 className="font-display text-2xl text-mft-blue">
                Ronda {gameState.round} - Baza {gameState.tricksPlayedInRound + 1}/5
              </h2>
              <p className="text-gray-600">
                {isMyTurn ? '¡Es tu turno!' : `Turno de ${activePlayer?.name}`}
              </p>
              {gameState.currentTrick.length > 0 && (
                <p className="text-sm text-mft-purple mt-1">
                  🎯 Primer jugador: {firstPlayerThisTrick?.name} (gana empates)
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Tu puntaje:</p>
              <p className="text-3xl font-bold text-mft-pink">
                {currentPlayer?.score} {HeartIcon}
              </p>
            </div>
          </div>
          
          {/* Categoría del jugador actual */}
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-3">
            <p className="text-sm text-gray-600">Tu categoría:</p>
            <p className="font-bold text-mft-purple">{currentPlayer?.category}</p>
          </div>
        </div>

        {/* Panel de estado de jugadores */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <h3 className="font-bold text-sm text-gray-600 mb-3">Estado de Jugadores:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {gameState.players.map((player: any, index: number) => {
              const isActive = gameState.activePlayerIndex === index;
              const isMe = player.id === playerId;
              const hasPlayed = gameState.currentTrick.some((pc: any) => pc.playerId === player.id);
              
              return (
                <div 
                  key={player.id}
                  className={`rounded-lg p-3 border-2 transition-all ${
                    isActive ? 'border-mft-blue bg-blue-50 scale-105' : 
                    hasPlayed ? 'border-green-300 bg-green-50' : 
                    'border-gray-200 bg-gray-50'
                  } ${isMe ? 'ring-2 ring-mft-pink' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: `var(--color-${player.color})` }}
                    >
                      {player.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm truncate">
                        {player.name} {isMe && '(Tú)'}
                      </p>
                      <p className="text-xs text-gray-600">
                        {player.score} {HeartIcon}
                      </p>
                    </div>
                    {isActive && <span className="text-lg">👉</span>}
                    {hasPlayed && !isActive && <span className="text-lg">✓</span>}
                  </div>
                  <p className="text-xs text-gray-600 truncate italic">
                    {player.category}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {player.hand.filter((c: any) => !c.isPlayed).length} cartas
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cartas en la mesa */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 min-h-[300px] flex items-center justify-center">
          {gameState.currentTrick.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-2">Esperando primera carta...</p>
              <p className="text-sm text-gray-500">El primer jugador inicia la baza</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-4 justify-center">
              {gameState.currentTrick.map((playedCard: any, index: number) => {
                const isFirst = index === 0;
                return (
                  <div key={playedCard.playerId} className="text-center animate-fadeIn">
                    {isFirst && (
                      <div className="mb-2">
                        <span className="text-xs bg-mft-purple text-white px-2 py-1 rounded-full">
                          🎯 Primero
                        </span>
                      </div>
                    )}
                    <div className={`bg-gray-50 border-2 rounded-xl p-4 w-36 h-52 flex flex-col items-center justify-center transition-all ${
                      isFirst ? 'border-mft-purple shadow-lg' : 'border-gray-300'
                    }`}>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded-full mb-2">
                        #{index + 1}
                      </span>
                      <p className="text-sm font-bold mb-2">{playedCard.playerName}</p>
                      <p className="text-base mb-2 text-center px-2">{playedCard.card.text}</p>
                      <p className="text-3xl">❓</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mano del jugador */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="font-bold text-lg mb-4">Tu mano:</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            {currentPlayer?.hand
              .filter((card: any) => !card.isPlayed)
              .map((card: any) => (
                <button
                  key={card.id}
                  onClick={() => onPlayCard(card.id)}
                  disabled={!isMyTurn}
                  className={`bg-gradient-to-br from-white to-gray-50 border-2 rounded-xl p-4 w-40 h-56 flex flex-col items-center justify-center transition-all ${
                    isMyTurn
                      ? 'border-mft-blue hover:scale-105 hover:shadow-xl cursor-pointer'
                      : 'border-gray-300 opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-4xl mb-3">
                    {card.isBrokenHeart ? '💔' : `#${card.rank}`}
                  </div>
                  <p className="text-center text-sm font-medium">{card.text}</p>
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TrickResolutionComponent({ gameState, playerId, onContinue }: any) {
  const winnerPlayer = gameState.players.find((p: any) => p.id === gameState.trickWinnerId);
  const firstPlayer = gameState.currentTrick[0];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
        <h2 className="font-display text-3xl text-center text-mft-pink mb-6 animate-bounce">
          🎊 ¡Baza Terminada! 🎊
        </h2>

        {/* Info de primer jugador */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            🎯 Primer jugador fue: <span className="font-bold text-mft-purple">{firstPlayer?.playerName}</span>
          </p>
          <p className="text-xs text-gray-500">(Gana empates)</p>
        </div>

        {/* Cartas reveladas con animación */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {gameState.currentTrick.map((playedCard: any, index: number) => {
            const isWinner = playedCard.playerId === gameState.trickWinnerId;
            const isFirst = index === 0;
            return (
              <div
                key={playedCard.playerId}
                className={`text-center transition-all duration-500 animate-fadeIn ${
                  isWinner ? 'transform scale-110' : ''
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {isFirst && (
                  <div className="mb-2">
                    <span className="text-xs bg-mft-purple text-white px-2 py-1 rounded-full">
                      🎯 Primero
                    </span>
                  </div>
                )}
                <div
                  className={`border-4 rounded-xl p-6 w-44 transition-all ${
                    isWinner 
                      ? 'border-mft-pink bg-pink-50 shadow-2xl animate-pulse' 
                      : 'border-gray-300 bg-white'
                  }`}
                >
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded-full mb-2 inline-block">
                    #{index + 1}
                  </span>
                  <p className="text-sm font-bold mb-2">{playedCard.playerName}</p>
                  <p className="text-base mb-3 text-center">{playedCard.card.text}</p>
                  <div className={`text-5xl transition-all ${
                    isWinner ? 'animate-bounce' : ''
                  }`}>
                    {playedCard.card.isBrokenHeart ? '💔' : `#${playedCard.card.rank}`}
                  </div>
                </div>
                {isWinner && <div className="text-4xl mt-3 animate-bounce">👑</div>}
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-300 rounded-lg p-6 mb-6 animate-fadeIn">
          <p className="text-center text-2xl font-bold text-mft-pink mb-2">
            ¡{winnerPlayer?.name} gana la baza y recibe 1 {HeartIcon}!
          </p>
          {gameState.winnerReason && (
            <p className="text-center text-gray-700 font-medium">{gameState.winnerReason}</p>
          )}
          <p className="text-center text-sm text-gray-600 mt-2">
            Puntaje actual: {winnerPlayer?.score} {HeartIcon}
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-mft-pink text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-600 transition-colors"
        >
          ➡️ Continuar
        </button>
      </div>
    </div>
  );
}

function RoundEndComponent({ gameState, playerId, onNextRound }: any) {
  const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        <h2 className="font-display text-4xl text-center text-mft-blue mb-8">
          Fin de Ronda {gameState.round}
        </h2>

        <div className="space-y-3 mb-8">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
                player.id === playerId ? 'border-mft-blue bg-blue-50' : 'border-gray-200'
              }`}
            >
              <div className="text-3xl font-bold text-gray-400 w-12 text-center">
                #{index + 1}
              </div>
              <div
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: `var(--color-${player.color})` }}
              />
              <span className="flex-1 font-bold text-lg">{player.name}</span>
              <div className="text-2xl font-bold text-mft-pink">
                {player.score} {HeartIcon}
              </div>
            </div>
          ))}
        </div>

        {currentPlayer?.isHost && (
          <button
            onClick={onNextRound}
            className="w-full bg-mft-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
          >
            {gameState.round === 1 ? '🎮 Siguiente Ronda' : '🏆 Ver Resultados Finales'}
          </button>
        )}
        {!currentPlayer?.isHost && (
          <div className="text-center text-gray-600">
            Esperando que el host continúe...
          </div>
        )}
      </div>
    </div>
  );
}

function GameEndComponent({ gameState, playerId, onNewGame }: any) {
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const winners = sortedPlayers.filter(p => p.score === sortedPlayers[0].score);
  const currentPlayer = gameState.players.find((p: any) => p.id === playerId);
  const isWinner = winners.some(w => w.id === playerId);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🏆</div>
          <h2 className="font-display text-4xl text-mft-blue mb-4">
            ¡Fin del Juego!
          </h2>
          {isWinner && (
            <p className="text-2xl font-bold text-mft-pink">
              {winners.length > 1 ? '¡Empataron!' : '¡Ganaste!'}
            </p>
          )}
        </div>

        <div className="space-y-3 mb-8">
          {sortedPlayers.map((player, index) => (
            <div
              key={player.id}
              className={`flex items-center gap-4 p-6 rounded-xl border-4 ${
                winners.some(w => w.id === player.id)
                  ? 'border-mft-pink bg-pink-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="text-5xl">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
              </div>
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: `var(--color-${player.color})` }}
              />
              <span className="flex-1 font-bold text-xl">{player.name}</span>
              <div className="text-3xl font-bold text-mft-pink">
                {player.score} {HeartIcon}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onNewGame}
          className="w-full bg-mft-blue text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-600 transition-colors"
        >
          🎮 Nueva Partida
        </button>
      </div>
    </div>
  );
}

export default App;
