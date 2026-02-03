import React from 'react';
import { Card as CardType, PlayerColor } from '../types';
import { COLORS, TEXT_COLORS, BrokenHeartIcon } from '../constants';

interface CardProps {
  card: CardType;
  color: PlayerColor;
  isRevealed: boolean;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ card, color, isRevealed, onClick, disabled, size = 'md' }) => {
  const bgColor = COLORS[color];
  const textColor = TEXT_COLORS[color];

  const sizeClasses = {
    sm: 'w-20 h-32 text-xs',
    md: 'w-32 h-48 text-sm',
    lg: 'w-48 h-72 text-lg',
  };

  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`
        relative flex flex-col items-center justify-between
        ${sizeClasses[size]} 
        bg-white border-2 border-gray-200 rounded-xl overflow-hidden
        card-shadow transition-transform duration-200
        ${!disabled && onClick ? 'cursor-pointer hover:-translate-y-2' : ''}
        ${disabled ? 'opacity-75' : ''}
      `}
    >
      {/* Top half: The "Thing" (Always visible if written) */}
      <div className="w-full h-1/2 p-2 flex items-center justify-center text-center font-body font-bold text-gray-800 leading-tight z-10 bg-white">
        {card.text || <span className="text-gray-300 italic">Vacío</span>}
      </div>

      {/* Bottom half: The Sleeve / Rank */}
      <div className={`w-full h-1/2 flex items-center justify-center relative transition-all duration-500`}>
        
        {/* The Rank Value (Behind the sleeve) */}
        <div className={`absolute inset-0 flex items-center justify-center font-display text-4xl ${textColor}`}>
           {card.isBrokenHeart ? <BrokenHeartIcon className="w-12 h-12" /> : card.rank}
        </div>

        {/* The Sleeve (Overlays the rank) */}
        <div 
          className={`
            absolute inset-0 ${bgColor} flex flex-col items-center justify-center
            transition-transform duration-500 origin-bottom
            ${isRevealed ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'}
          `}
        >
          {/* Decorative pattern on sleeve */}
          <div className="opacity-20 flex space-x-2">
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <div className="w-2 h-2 rounded-full bg-white"></div>
             <div className="w-2 h-2 rounded-full bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};