import React from 'react';
import { PlayedCard } from '../types';
import { Card } from './Card';
import { COLORS, TEXT_COLORS } from '../constants';

interface TrickDisplayProps {
  playedCards: PlayedCard[];
  players: any[];
  isRevealed?: boolean;
}

export const TrickDisplay: React.FC<TrickDisplayProps> = ({ 
  playedCards, 
  players,
  isRevealed = false 
}) => {
  if (playedCards.length === 0) {
    return (
      <div className="min-h-[220px] flex items-center justify-center">
        <div className="border-4 border-dashed border-gray-300 rounded-2xl w-40 h-56 flex flex-col items-center justify-center text-gray-400 animate-pulse">
          <svg className="w-16 h-16 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-bold text-sm">Esperando cartas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 justify-center flex-wrap min-h-[220px] items-center">
      {playedCards.map((played, idx) => {
        const player = players[played.playerId];
        return (
          <div 
            key={idx} 
            className="flex flex-col items-center animate-[slideIn_0.4s_ease-out]"
            style={{ animationDelay: `${idx * 0.1}s` }}
          >
            <div className={`
              text-sm font-bold mb-3 uppercase tracking-wider px-4 py-1.5 rounded-full
              ${COLORS[player.color]} text-white shadow-md
            `}>
              {player.name}
            </div>
            <Card 
              card={played.card} 
              color={player.color} 
              isRevealed={isRevealed} 
              size="md"
            />
          </div>
        );
      })}
    </div>
  );
};
