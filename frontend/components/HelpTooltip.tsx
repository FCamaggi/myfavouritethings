import React, { useState, useEffect } from 'react';
import { GamePhase } from '../types';

interface HelpTooltipProps {
  phase: GamePhase;
}

const helpMessages: Record<GamePhase, string> = {
  [GamePhase.SETUP]: "Añade entre 3 y 4 jugadores para comenzar el juego.",
  [GamePhase.CATEGORY_SELECTION]: "Elige una categoría divertida e inesperada. ¡Las mejores categorías son específicas!",
  [GamePhase.WRITING_ANSWERS]: "Tu #1 debe ser tu verdadero favorito. El 💔 es algo que NO te gusta. Los demás van en orden.",
  [GamePhase.TRICK_START]: "Es hora de jugar una carta. Piensa: ¿qué escribieron los demás?",
  [GamePhase.TRICK_PLAYING]: "Elige sabiamente. El número más bajo gana... ¡a menos que haya un Corazón Roto con un #1!",
  [GamePhase.TRICK_RESOLUTION]: "¡Momento de la verdad! Los números se revelan y se decide el ganador.",
  [GamePhase.ROUND_END]: "Ronda completada. Prepárate para la siguiente con nuevas categorías.",
  [GamePhase.GAME_END]: "¡Juego terminado! El jugador con más corazones gana.",
};

export const HelpTooltip: React.FC<HelpTooltipProps> = ({ phase }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Show tooltip for 5 seconds when phase changes (only once per phase)
    if (!hasBeenShown) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setHasBeenShown(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [phase, hasBeenShown]);

  useEffect(() => {
    // Reset hasBeenShown when phase changes
    setHasBeenShown(false);
  }, [phase]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-xl shadow-2xl max-w-xs animate-[slideIn_0.5s_ease-out] z-50 border-2 border-mft-blue">
      <div className="flex items-start gap-3">
        <div className="text-2xl">💡</div>
        <div className="flex-1">
          <p className="text-sm text-gray-700 font-body">{helpMessages[phase]}</p>
        </div>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-black transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};
