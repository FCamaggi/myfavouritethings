import React from 'react';
import { Player, PlayerColor } from '../types';
import { COLORS, TEXT_COLORS } from '../constants';

interface PlayerIndicatorProps {
  player: Player;
  isActive?: boolean;
  isStartPlayer?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const PlayerIndicator: React.FC<PlayerIndicatorProps> = ({ 
  player, 
  isActive = false,
  isStartPlayer = false,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3'
  };

  return (
    <div className={`
      ${sizeClasses[size]}
      ${isActive ? COLORS[player.color] + ' text-white shadow-lg scale-110' : 'bg-white ' + TEXT_COLORS[player.color]}
      rounded-full font-bold flex items-center gap-2 transition-all duration-300
      ${isActive ? 'ring-4 ring-white ring-opacity-50' : ''}
    `}>
      {isStartPlayer && <span className="text-lg">👑</span>}
      <span>{player.name}</span>
    </div>
  );
};
