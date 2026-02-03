import React, { useState, useEffect } from 'react';
import { GamePhase, GameState, Player, PlayerColor, Card as CardType, PlayedCard } from './types';
import { Card } from './components/Card';
import { GameHeader } from './components/GameHeader';
import { InterimScreen } from './components/InterimScreen';
import { TrickDisplay } from './components/TrickDisplay';
import { HandDisplay } from './components/HandDisplay';
import { PlayerIndicator } from './components/PlayerIndicator';
import { HelpTooltip } from './components/HelpTooltip';
import { COLORS, TEXT_COLORS, BORDER_COLORS, HeartIcon, BrokenHeartIcon, MAX_TRICKS, TOTAL_ROUNDS, EyeIcon } from './constants';
import { determineTrickWinner } from './utils/gameLogic';

const INITIAL_COLORS: PlayerColor[] = ['blue', 'pink', 'yellow', 'green'];

// --- Modal Components ---

const ManualModal = ({ onClose }: { onClose: () => void }) => {
  const [page, setPage] = useState(0);
  const pages = [
    {
      title: "Objetivo del Juego",
      content: (
        <div className="text-left space-y-4">
          <p>En <strong>My Favourite Things</strong>, ganas corazones ganando bazas.</p>
          <p>Tienes cartas numeradas del <strong>1 al 5</strong> (tus cosas favoritas) y un <strong>Corazón Roto</strong> (algo que no te gusta).</p>
          <p>¡El jugador con más corazones al final de 2 rondas gana!</p>
        </div>
      )
    },
    {
      title: "Preparación",
      content: (
        <div className="text-left space-y-4">
          <p>1. Primero, escribirás una <strong>Categoría</strong> para el jugador sentado a tu lado.</p>
          <p>2. Luego, recibirás una categoría de otro jugador.</p>
          <p>3. Completarás tus cartas escribiendo cosas que encajen en esa categoría, desde tu Favorito #1 hasta el #5, y una cosa que NO te guste para el Corazón Roto.</p>
        </div>
      )
    },
    {
      title: "¿Qué es una Baza?",
      content: (
        <div className="text-left space-y-4">
          <p>Una <strong>baza</strong> (o "trick") es una ronda de juego donde cada jugador juega una carta.</p>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-2">
            <p className="font-bold text-blue-700">📋 Paso a paso:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>El jugador inicial elige y juega una carta</li>
              <li>Cada jugador, en orden, juega una carta</li>
              <li>Se revelan los números ocultos</li>
              <li>El número más bajo gana la baza</li>
              <li>El ganador toma un corazón ❤️</li>
            </ol>
          </div>
          <p className="text-sm">Se juegan <strong>5 bazas</strong> por ronda (quedará 1 carta sin jugar).</p>
        </div>
      )
    },
    {
      title: "Cómo Jugar",
      content: (
        <div className="text-left space-y-4">
          <p>En tu turno:</p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <p className="font-bold">Elige una carta</p>
                <p className="text-sm text-gray-600">Piensa estratégicamente: ¿qué carta crees que ganará?</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <p className="font-bold">Ponla en la mesa</p>
                <p className="text-sm text-gray-600">El número permanece oculto hasta el final</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <p className="font-bold">Lee tu respuesta</p>
                <p className="text-sm text-gray-600">Anuncia lo que escribiste para esa categoría</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Reglas de Victoria",
      content: (
        <div className="text-left space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="font-bold text-green-700 mb-2">✅ Regla Normal:</p>
            <p className="text-sm">El <strong>número más bajo</strong> gana la baza</p>
            <p className="text-xs text-gray-600 mt-1">Ejemplo: Si se juegan 3, 1, 4 → gana el 1</p>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="font-bold text-red-600 mb-2">💔 Regla Especial:</p>
            <p className="text-sm mb-1">Si se juega un <strong>#1</strong> Y un <strong>Corazón Roto</strong> juntos...</p>
            <p className="font-bold text-sm">¡El Corazón Roto gana!</p>
            <p className="text-xs text-gray-600 mt-1">El odio vence al amor en este único caso</p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs"><strong>Empates:</strong> Gana quien jugó su carta primero</p>
          </div>
        </div>
      )
    },
    {
      title: "Ejemplo de Baza",
      content: (
        <div className="text-left space-y-3">
          <p className="text-sm font-bold">Categoría: "Ingredientes de Pizza"</p>
          
          <div className="space-y-2">
            <div className="bg-blue-100 p-2 rounded text-xs">
              <strong>Ana juega:</strong> "Pepperoni" → Revela: #2
            </div>
            <div className="bg-pink-100 p-2 rounded text-xs">
              <strong>Luis juega:</strong> "Piña" 💔 → Revela: Corazón Roto
            </div>
            <div className="bg-yellow-100 p-2 rounded text-xs">
              <strong>María juega:</strong> "Mozzarella" → Revela: #1
            </div>
          </div>

          <div className="bg-red-50 p-3 rounded-lg border-2 border-red-400">
            <p className="font-bold text-red-700 text-sm">💔 ¡Luis gana!</p>
            <p className="text-xs text-gray-700 mt-1">
              Aunque María jugó un #1, el Corazón Roto de Luis activa la regla especial y gana la baza.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Estrategia",
      content: (
        <div className="text-left space-y-4">
          <p className="font-bold">💡 Consejos para ganar:</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Conoce a tus amigos:</strong> ¿Qué les gusta realmente?</li>
            <li><strong>Adivina los números:</strong> Las respuestas más entusiastas suelen ser el #1</li>
            <li><strong>Timing del Corazón Roto:</strong> Úsalo cuando sospeches que alguien jugará su #1</li>
            <li><strong>Observa las cartas usadas:</strong> Si ya salió el #1, el Corazón Roto pierde valor</li>
          </ul>
          <p className="text-xs text-gray-500 mt-4 italic">Recuerda: Este juego es sobre conocer a tus amigos y divertirte juntos</p>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-2xl text-mft-blue">{pages[page].title}</h3>
          <span className="text-xs font-bold text-gray-400">{page + 1} / {pages.length}</span>
        </div>
        
        <div className="flex-1 font-body text-gray-700">
          {pages[page].content}
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          <button 
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className={`px-4 py-2 rounded-lg font-bold ${page === 0 ? 'text-gray-300' : 'text-black hover:bg-gray-100'}`}
          >
            Anterior
          </button>
          
          {page === pages.length - 1 ? (
            <button 
              onClick={onClose}
              className="bg-mft-pink text-white px-6 py-2 rounded-lg font-bold hover:opacity-90"
            >
              ¡Entendido!
            </button>
          ) : (
            <button 
              onClick={() => setPage(p => Math.min(pages.length - 1, p + 1))}
              className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:opacity-90"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ExamplesModal = ({ onClose }: { onClose: () => void }) => {
  const categories = [
    "Ingredientes de Pizza",
    "Superhéroes Inútiles",
    "Cosas que huelen mal",
    "Lugares para una primera cita",
    "Cosas que harías por $1 millón",
    "Mascotas exóticas",
    "Sabores de helado",
    "Tareas del hogar",
    "Regalos de cumpleaños terribles",
    "Cosas que encuentras en un bolsillo"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        
        <h3 className="font-display text-3xl text-mft-blue mb-6 text-center">Ideas de Categorías</h3>
        
        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100 font-body text-gray-700 text-center hover:bg-yellow-50 transition-colors">
              {cat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  // --- State ---
  const [gameState, setGameState] = useState<GameState>({
    phase: GamePhase.SETUP,
    round: 1,
    players: [],
    startPlayerIndex: 0,
    activePlayerIndex: 0,
    currentTrick: [],
    trickWinnerId: null,
    winnerReason: null,
    tricksPlayedInRound: 0,
  });

  const [inputName, setInputName] = useState('');
  const [tempCategory, setTempCategory] = useState('');
  const [tempAnswers, setTempAnswers] = useState<Record<number, string>>({});
  const [isInterimScreen, setIsInterimScreen] = useState(false);
  
  // Modal States
  const [showManual, setShowManual] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  // --- Actions ---

  const addPlayer = () => {
    if (gameState.players.length >= 4) return;
    const newPlayer: Player = {
      id: gameState.players.length,
      name: inputName || `Jugador ${gameState.players.length + 1}`,
      color: INITIAL_COLORS[gameState.players.length],
      score: 0,
      hand: [],
      category: '',
      assignedCategoryBy: -1
    };
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
    setInputName('');
  };

  const startGame = () => {
    if (gameState.players.length < 3) {
      alert("¡Se necesitan al menos 3 jugadores!");
      return;
    }
    
    // Assign initial "Category Giver" logic
    // Round 1: Pass Left (i+1)
    const playersWithAssignment = gameState.players.map((p, i) => ({
      ...p,
      assignedCategoryBy: (i - 1 + gameState.players.length) % gameState.players.length
    }));

    setGameState(prev => ({
      ...prev,
      players: playersWithAssignment,
      phase: GamePhase.CATEGORY_SELECTION,
      activePlayerIndex: 0
    }));
  };

  const submitCategory = () => {
    if (!tempCategory.trim()) return;

    // In Round 1, Player X writes category for Player X+1 (Left)
    // We are currently simulating: Active Player writes a category for their *Target*.
    // Target is the player who has 'assignedCategoryBy' === activePlayer
    const targetPlayerIndex = gameState.players.findIndex(p => p.assignedCategoryBy === gameState.activePlayerIndex);
    
    const updatedPlayers = [...gameState.players];
    updatedPlayers[targetPlayerIndex].category = tempCategory;

    const nextIndex = (gameState.activePlayerIndex + 1) % gameState.players.length;

    if (nextIndex === gameState.startPlayerIndex) {
      // All categories written
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        phase: GamePhase.WRITING_ANSWERS,
        activePlayerIndex: 0
      }));
      setTempCategory('');
      setIsInterimScreen(true);
    } else {
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        activePlayerIndex: nextIndex
      }));
      setTempCategory('');
      setIsInterimScreen(true);
    }
  };

  const submitAnswers = () => {
    // Validate inputs
    if (Object.keys(tempAnswers).length < 6) return;

    const currentPlayer = gameState.players[gameState.activePlayerIndex];
    
    const newHand: CardType[] = [1, 2, 3, 4, 5, 6].map(rank => ({
      id: `${currentPlayer.id}-${rank}`,
      rank: rank === 6 ? 100 : rank, // Internal logic for sorting, but we display icon
      isBrokenHeart: rank === 6,
      text: tempAnswers[rank] || "Desconocido",
      ownerId: currentPlayer.id,
      isPlayed: false
    }));

    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.activePlayerIndex].hand = newHand;

    const nextIndex = (gameState.activePlayerIndex + 1) % gameState.players.length;

    if (nextIndex === gameState.startPlayerIndex) {
       // All answers written, start trick
       setGameState(prev => ({
         ...prev,
         players: updatedPlayers,
         phase: GamePhase.TRICK_START,
         activePlayerIndex: prev.startPlayerIndex
       }));
       setTempAnswers({});
       setIsInterimScreen(true);
    } else {
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        activePlayerIndex: nextIndex
      }));
      setTempAnswers({});
      setIsInterimScreen(true);
    }
  };

  const playCard = (cardId: string) => {
    const player = gameState.players[gameState.activePlayerIndex];
    const card = player.hand.find(c => c.id === cardId);
    
    if (!card) return;

    // Mark card as played in hand
    const updatedHand = player.hand.map(c => c.id === cardId ? { ...c, isPlayed: true } : c);
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.activePlayerIndex].hand = updatedHand;

    const newPlayedCard: PlayedCard = {
      card: { ...card, isPlayed: true },
      playerId: player.id,
      order: gameState.currentTrick.length
    };

    const nextTrickState = [...gameState.currentTrick, newPlayedCard];
    
    // Check if trick is complete
    if (nextTrickState.length === gameState.players.length) {
       setGameState(prev => ({
         ...prev,
         players: updatedPlayers,
         currentTrick: nextTrickState,
         phase: GamePhase.TRICK_RESOLUTION
       }));
    } else {
      // Pass to next player
      const nextIndex = (gameState.activePlayerIndex + 1) % gameState.players.length;
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        currentTrick: nextTrickState,
        activePlayerIndex: nextIndex
      }));
      setIsInterimScreen(true);
    }
  };

  const resolveTrick = () => {
    const result = determineTrickWinner(gameState.currentTrick);
    
    setGameState(prev => ({
      ...prev,
      trickWinnerId: result.winnerId,
      winnerReason: result.reason
    }));
  };

  const nextTrick = () => {
    if (gameState.trickWinnerId === null) return;

    // Give heart to winner
    const updatedPlayers = gameState.players.map(p => 
      p.id === gameState.trickWinnerId ? { ...p, score: p.score + 1 } : p
    );

    const tricksPlayed = gameState.tricksPlayedInRound + 1;
    const winnerIndex = gameState.players.findIndex(p => p.id === gameState.trickWinnerId);

    // Pass First Player Token Left
    const nextStartPlayer = (gameState.startPlayerIndex + 1) % gameState.players.length;

    if (tricksPlayed >= MAX_TRICKS) {
      // End of Round
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        currentTrick: [],
        trickWinnerId: null,
        winnerReason: null,
        tricksPlayedInRound: 0,
        phase: GamePhase.ROUND_END,
      }));
    } else {
      // Next Trick
      setGameState(prev => ({
        ...prev,
        players: updatedPlayers,
        currentTrick: [],
        trickWinnerId: null,
        winnerReason: null,
        tricksPlayedInRound: tricksPlayed,
        phase: GamePhase.TRICK_START,
        startPlayerIndex: nextStartPlayer,
        activePlayerIndex: nextStartPlayer // Current start player leads
      }));
      setIsInterimScreen(true);
    }
  };

  const nextRound = () => {
    if (gameState.round >= TOTAL_ROUNDS) {
      setGameState(prev => ({ ...prev, phase: GamePhase.GAME_END }));
    } else {
      // Setup Round 2
      // Round 2: Pass Right (i-1)
      const playersWithAssignment = gameState.players.map((p, i) => ({
        ...p,
        hand: [], // Clear hand
        category: '',
        assignedCategoryBy: (i + 1) % gameState.players.length
      }));

      setGameState(prev => ({
        ...prev,
        round: prev.round + 1,
        players: playersWithAssignment,
        phase: GamePhase.CATEGORY_SELECTION,
        activePlayerIndex: 0,
        startPlayerIndex: 0 // Reset or keep moving? Manual implies "Return all cards... start Second Round". Let's reset start token to youngest (0) or keep rotating. Let's keep rotating.
      }));
    }
  };

  // --- Views ---

  if (isInterimScreen) {
    const nextPlayer = gameState.players[gameState.activePlayerIndex];
    return <InterimScreen nextPlayer={nextPlayer} onContinue={() => setIsInterimScreen(false)} />;
  }

  // 1. SETUP
  if (gameState.phase === GamePhase.SETUP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-mft-blue to-mft-purple flex flex-col items-center justify-center p-4">
        {showManual && <ManualModal onClose={() => setShowManual(false)} />}
        <HelpTooltip phase={gameState.phase} />
        
        <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full animate-[slideIn_0.5s_ease-out]">
          <div className="text-center mb-6">
            <div className="inline-block bg-gradient-to-r from-mft-pink to-mft-yellow p-1 rounded-2xl mb-4">
              <div className="bg-white px-6 py-3 rounded-xl">
                <h1 className="font-display text-5xl text-transparent bg-clip-text bg-gradient-to-r from-mft-blue to-mft-pink uppercase">
                  My Favourite Things
                </h1>
              </div>
            </div>
            <p className="text-gray-500 font-body text-sm">Edición Digital · v1.0</p>
          </div>
          
          <div className="flex justify-center mb-6">
            <button 
              onClick={() => setShowManual(true)}
              className="text-mft-pink font-bold hover:text-mft-blue transition-colors flex items-center gap-2 text-lg hover:scale-105 transform"
            >
              <EyeIcon className="w-5 h-5" /> 
              <span>Cómo Jugar</span>
            </button>
          </div>
          
          <div className="space-y-4 mb-6">
            <h2 className="font-bold text-lg text-gray-700">Añadir Jugadores</h2>
            <p className="text-sm text-gray-500">Se necesitan entre 3 y 4 jugadores</p>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputName} 
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Nombre del jugador"
                className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 font-body focus:border-mft-blue outline-none transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                maxLength={20}
              />
              <button 
                onClick={addPlayer} 
                disabled={gameState.players.length >= 4}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  gameState.players.length >= 4 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-mft-pink text-white hover:bg-opacity-90 hover:scale-105'
                }`}
              >
                Añadir
              </button>
            </div>
            
            <div className="min-h-[60px]">
              {gameState.players.length === 0 ? (
                <div className="text-center py-4 text-gray-400 text-sm">
                  <p>¡Añade jugadores para comenzar!</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mt-4">
                  {gameState.players.map(p => (
                    <div 
                      key={p.id} 
                      className={`${COLORS[p.color]} text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-md animate-[pop_0.3s_ease-out]`}
                    >
                      <span>{p.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button 
              onClick={startGame}
              disabled={gameState.players.length < 3}
              className={`
                w-full py-4 rounded-xl font-display text-2xl tracking-wide transition-all shadow-lg
                ${gameState.players.length >= 3 
                  ? 'bg-gradient-to-r from-mft-yellow to-mft-orange text-black hover:scale-105 hover:shadow-xl' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {gameState.players.length < 3 
                ? `Necesitas ${3 - gameState.players.length} jugador${3 - gameState.players.length > 1 ? 'es' : ''} más` 
                : 'INICIAR JUEGO'
              }
            </button>
            
            {gameState.players.length >= 3 && (
              <p className="text-center text-xs text-gray-500 animate-pulse">
                ✨ ¡Todo listo para jugar!
              </p>
            )}
          </div>
        </div>
        
        <p className="text-white text-sm mt-6 opacity-75">
          Un juego sobre conocer a tus amigos
        </p>
      </div>
    );
  }

  // 2. CATEGORY SELECTION
  if (gameState.phase === GamePhase.CATEGORY_SELECTION) {
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const targetPlayer = gameState.players.find(p => p.assignedCategoryBy === activePlayer.id)!;
    
    return (
      <div className={`min-h-screen ${COLORS[activePlayer.color]} p-4 flex flex-col animate-[fadeIn_0.5s_ease-out]`}>
        {showExamples && <ExamplesModal onClose={() => setShowExamples(false)} />}
        <HelpTooltip phase={gameState.phase} />

        <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
          <div className="bg-white p-10 rounded-3xl shadow-2xl w-full text-center animate-[slideUp_0.5s_ease-out]">
            <div className="mb-6">
              <div className={`inline-block ${COLORS[activePlayer.color]} text-white px-6 py-2 rounded-full text-sm font-bold mb-4`}>
                Paso 1 de 3: Categoría
              </div>
            </div>
            
            <h2 className={`font-display text-5xl mb-4 ${TEXT_COLORS[activePlayer.color]}`}>
              Elige una Categoría
            </h2>
            
            <div className="bg-gray-50 p-6 rounded-2xl mb-6">
              <p className="font-body text-gray-700 text-lg mb-2">
                Escribe una categoría para
              </p>
              <p className={`font-display text-3xl ${TEXT_COLORS[activePlayer.color]}`}>
                {targetPlayer.name}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                (Jugador a tu {gameState.round === 1 ? 'Izquierda ←' : 'Derecha →'})
              </p>
            </div>
            
            <input 
              type="text"
              value={tempCategory}
              onChange={(e) => setTempCategory(e.target.value)}
              placeholder="ej. Ingredientes de Pizza, Cosas Ruidosas..."
              className="w-full text-center text-2xl border-b-4 border-gray-300 focus:border-black outline-none py-3 mb-2 font-bold font-body transition-colors"
              autoFocus
              maxLength={60}
            />
            <p className="text-xs text-gray-400 mb-6">
              {tempCategory.length}/60 caracteres
            </p>

            <div className="flex justify-center mb-8">
               <button 
                 onClick={() => setShowExamples(true)}
                 className="text-gray-400 font-bold text-sm hover:text-black flex items-center gap-2 transition-colors hover:scale-105 transform"
               >
                 <EyeIcon className="w-4 h-4" /> Ver Ejemplos de Categorías
               </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-5 rounded-2xl text-left text-sm text-gray-600 mb-8 border border-blue-100">
              <p className="font-bold mb-2 text-blue-700">💡 Tips para buenas categorías:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Evita categorías vagas. Sé específico.</li>
                <li>No tiene que ser "Favorito". Puede ser "Lo peor", "Más probable que..."</li>
                <li>Piensa en algo divertido para tu grupo.</li>
                <li>¡Categorías raras = Juego más divertido!</li>
              </ul>
            </div>

            <button 
              onClick={submitCategory}
              disabled={!tempCategory.trim()}
              className={`
                w-full py-4 rounded-2xl font-display text-2xl tracking-wide transition-all shadow-lg
                ${tempCategory.trim() 
                  ? 'bg-black text-white hover:scale-105 hover:shadow-xl' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Confirmar Categoría
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. WRITING ANSWERS
  if (gameState.phase === GamePhase.WRITING_ANSWERS) {
    const activePlayer = gameState.players[gameState.activePlayerIndex];
    const filledCount = Object.keys(tempAnswers).length;
    
    return (
      <div className={`min-h-screen ${COLORS[activePlayer.color]} p-4 animate-[fadeIn_0.5s_ease-out]`}>
        <HelpTooltip phase={gameState.phase} />
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[90vh] flex flex-col">
          <div className="p-6 border-b-2 border-gray-100 text-center bg-gradient-to-r from-gray-50 to-white">
            <div className={`inline-block ${COLORS[activePlayer.color]} text-white px-6 py-2 rounded-full text-sm font-bold mb-3`}>
              Paso 2 de 3: Escribir Respuestas
            </div>
            <h2 className="font-body text-gray-500 uppercase text-xs tracking-widest mb-2">
              Categoría para {activePlayer.name}
            </h2>
            <h1 className="font-display text-5xl text-black mb-2">{activePlayer.category}</h1>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span>{filledCount} / 6 completadas</span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${COLORS[activePlayer.color]} transition-all duration-300`}
                  style={{ width: `${(filledCount / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((rank) => (
                  <div key={rank} className="flex flex-col animate-[slideIn_0.5s_ease-out]" style={{ animationDelay: `${rank * 0.05}s` }}>
                    <div className={`mb-3 font-display text-2xl ${TEXT_COLORS[activePlayer.color]} flex items-center justify-center gap-2`}>
                      {rank === 6 ? (
                        <>
                          <BrokenHeartIcon className="w-7 h-7 inline" />
                          <span>No me gusta</span>
                        </>
                      ) : (
                        <>
                          <span className="text-3xl">#{rank}</span>
                          {rank === 1 && <span className="text-lg">⭐ Favorito</span>}
                        </>
                      )}
                    </div>
                    <div className={`
                      w-full h-36 border-3 rounded-2xl p-4 flex items-center justify-center relative transition-all
                      ${tempAnswers[rank] ? BORDER_COLORS[activePlayer.color] + ' border-3 bg-white shadow-md' : 'border-2 border-dashed border-gray-300 bg-gray-50'}
                    `}>
                      <textarea 
                        className="w-full h-full text-center font-bold text-lg resize-none outline-none bg-transparent placeholder-gray-400"
                        placeholder={
                          rank === 6 ? "Algo que NO te gusta..." : 
                          rank === 1 ? "Tu FAVORITO absoluto..." : 
                          `Tu opción #${rank}...`
                        }
                        value={tempAnswers[rank] || ''}
                        onChange={(e) => setTempAnswers({...tempAnswers, [rank]: e.target.value})}
                        maxLength={50}
                      />
                      {tempAnswers[rank] && (
                        <div className="absolute top-2 right-2 text-xs text-gray-400">
                          {tempAnswers[rank].length}/50
                        </div>
                      )}
                    </div>
                  </div>
                ))}
             </div>

             <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200">
               <p className="font-bold text-yellow-800 mb-2">⚠️ Recuerda:</p>
               <ul className="text-sm text-yellow-900 space-y-1">
                 <li>• El <strong>#1</strong> debe ser tu favorito real de esa categoría</li>
                 <li>• El <strong>💔</strong> es algo que NO te gusta (no necesariamente lo peor)</li>
                 <li>• Los otros (#2-5) son tus siguientes opciones en orden</li>
               </ul>
             </div>
          </div>

          <div className="p-6 border-t-2 border-gray-100 flex justify-center bg-gradient-to-r from-white to-gray-50">
            <button 
              onClick={submitAnswers}
              disabled={filledCount < 6}
              className={`
                px-16 py-5 rounded-2xl font-display text-3xl tracking-wide text-white transition-all shadow-lg
                ${filledCount >= 6 
                  ? 'bg-black hover:scale-105 hover:shadow-2xl' 
                  : 'bg-gray-300 cursor-not-allowed'
                }
              `}
            >
              {filledCount >= 6 ? '¡Enviar Respuestas!' : `Faltan ${6 - filledCount} respuestas`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. TRICK PLAYING
  if (gameState.phase === GamePhase.TRICK_START || gameState.phase === GamePhase.TRICK_PLAYING) {
    const activePlayer = gameState.players[gameState.activePlayerIndex];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
        <GameHeader 
          round={gameState.round}
          trickNumber={gameState.tricksPlayedInRound + 1}
          maxTricks={MAX_TRICKS}
          players={gameState.players}
          onShowManual={() => setShowManual(true)}
        />
        {showManual && <ManualModal onClose={() => setShowManual(false)} />}
        <HelpTooltip phase={gameState.phase} />

        {/* Table Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-400 to-transparent"></div>
          
          <h2 className="text-gray-400 font-display text-2xl mb-8 uppercase tracking-widest">Mesa</h2>
          
          <TrickDisplay 
            playedCards={gameState.currentTrick}
            players={gameState.players}
            isRevealed={false}
          />

          {/* Player Action Area */}
          <HandDisplay 
            cards={activePlayer.hand}
            color={activePlayer.color}
            onCardClick={playCard}
            category={activePlayer.category}
          />
        </div>
      </div>
    );
  }

  // 5. TRICK RESOLUTION
  if (gameState.phase === GamePhase.TRICK_RESOLUTION) {
    // Determine winner if not yet calculated
    if (!gameState.trickWinnerId) {
      resolveTrick();
    }
    
    const winner = gameState.players.find(p => p.id === gameState.trickWinnerId);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-4 animate-[fadeIn_0.5s_ease-out]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none"></div>
        
        <h1 className="text-white font-display text-6xl mb-12 uppercase tracking-wider animate-[slideUp_0.5s_ease-out] drop-shadow-2xl">
          ¡Revelación!
        </h1>
        
        <TrickDisplay 
          playedCards={gameState.currentTrick}
          players={gameState.players}
          isRevealed={true}
        />

        {winner && (
          <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-lg mt-12 animate-[slideUp_0.7s_ease-out] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mft-pink/10 to-mft-yellow/10 pointer-events-none"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                <HeartIcon className="w-20 h-20 text-mft-pink animate-bounce drop-shadow-lg" />
              </div>
              <h2 className="font-display text-5xl mb-4 text-black">¡{winner.name} gana la baza!</h2>
              <p className="font-body text-gray-700 text-lg mb-8 italic">{gameState.winnerReason}</p>
              <button 
                onClick={nextTrick}
                className="bg-gradient-to-r from-mft-blue to-mft-purple text-white px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-lg hover:shadow-2xl"
              >
                Continuar Juego
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 6. ROUND/GAME END
  if (gameState.phase === GamePhase.ROUND_END || gameState.phase === GamePhase.GAME_END) {
    // Sort players by score
    const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
    const leader = sortedPlayers[0];
    const isGameEnd = gameState.phase === GamePhase.GAME_END;

    return (
      <div className="min-h-screen bg-gradient-to-br from-mft-yellow via-mft-orange to-mft-pink flex flex-col items-center justify-center p-4 animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-2xl w-full text-center relative overflow-hidden animate-[slideUp_0.6s_ease-out]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,0,126,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(255,198,11,0.1),transparent_50%)] pointer-events-none"></div>
          
          <div className="relative z-10">
            {isGameEnd && (
              <div className="mb-6 animate-bounce">
                <span className="text-7xl">🎉</span>
              </div>
            )}
            
            <h1 className="font-display text-6xl mb-3 text-black uppercase tracking-wider">
              {isGameEnd ? "FIN DEL JUEGO" : "FIN DE LA RONDA"}
            </h1>
            <p className="text-gray-500 font-body text-lg mb-8">
              {isGameEnd ? "Puntajes Finales" : `Fin de la Ronda ${gameState.round}`}
            </p>

            <div className="space-y-3 mb-12">
              {sortedPlayers.map((p, idx) => (
                <div 
                  key={p.id} 
                  className={`
                    flex items-center justify-between p-5 rounded-2xl border-2 transition-all
                    ${idx === 0 && isGameEnd 
                      ? 'bg-gradient-to-r from-yellow-100 to-orange-100 border-yellow-400 shadow-lg scale-105' 
                      : 'bg-gray-50 border-gray-200'
                    }
                  `}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      font-display text-3xl w-12 h-12 flex items-center justify-center rounded-full
                      ${idx === 0 && isGameEnd ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-500'}
                    `}>
                      {idx === 0 && isGameEnd ? '👑' : idx + 1}
                    </div>
                    <div className={`w-6 h-6 rounded-full ${COLORS[p.color]}`}></div>
                    <span className="font-bold text-2xl">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-mft-pink">
                    <HeartIcon className="w-10 h-10" />
                    <span className="font-display text-4xl">{p.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {isGameEnd ? (
               <div className="text-center">
                  <p className="font-display text-4xl mb-6 text-black">
                    ¡{leader.name} es el Ganador!
                  </p>
                  <p className="text-gray-600 mb-8">
                    Gracias por jugar My Favourite Things
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-mft-blue to-mft-purple text-white px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-lg"
                  >
                    Jugar de Nuevo
                  </button>
               </div>
            ) : (
              <button 
                onClick={nextRound}
                className="bg-gradient-to-r from-mft-blue to-mft-purple text-white px-12 py-4 rounded-full font-bold text-xl hover:scale-105 transition-all shadow-lg"
              >
                Comenzar Ronda {gameState.round + 1}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <div>Cargando...</div>;
};

export default App;