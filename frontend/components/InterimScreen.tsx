import React from 'react';
import { Player } from '../types';
import { COLORS } from '../constants';

interface InterimScreenProps {
  nextPlayer: Player;
  onContinue: () => void;
  message?: string;
}

export const InterimScreen: React.FC<InterimScreenProps> = ({ 
  nextPlayer, 
  onContinue,
  message 
}) => {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${COLORS[nextPlayer.color]} text-white p-8 animate-[fadeIn_0.3s_ease-out]`}>
      <div className="text-center max-w-lg space-y-8">
        <div className="animate-[bounce_1s_ease-in-out_infinite]">
          <div className={`w-32 h-32 mx-auto bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm`}>
            <span className="text-7xl">🎮</span>
          </div>
        </div>
        
        <h1 className="font-display text-6xl mb-4 uppercase tracking-wider drop-shadow-lg">
          Pasa el dispositivo
        </h1>
        
        <div className="bg-white bg-opacity-20 p-6 rounded-2xl backdrop-blur-md">
          <p className="font-body text-2xl mb-2">
            Turno de
          </p>
          <p className="font-display text-5xl uppercase tracking-wide">
            {nextPlayer.name}
          </p>
        </div>
        
        {message && (
          <p className="font-body text-lg opacity-90 italic">
            {message}
          </p>
        )}
        
        <div className="pt-4">
          <button 
            onClick={onContinue}
            className="bg-white text-black font-display text-3xl px-16 py-5 rounded-full shadow-2xl hover:scale-105 transition-all duration-200 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
          >
            Soy {nextPlayer.name}
          </button>
        </div>
        
        <p className="text-sm opacity-75 mt-4">
          ⚠️ ¡No mires las respuestas de otros jugadores!
        </p>
      </div>
    </div>
  );
};
