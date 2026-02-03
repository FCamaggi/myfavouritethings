import React from 'react';
import { Player } from '../types';
import { COLORS, HeartIcon, EyeIcon } from '../constants';

interface GameHeaderProps {
  round: number;
  trickNumber: number;
  maxTricks: number;
  players: Player[];
  onShowManual: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  round, 
  trickNumber, 
  maxTricks, 
  players,
  onShowManual 
}) => {
  return (
    <div className="bg-white p-4 shadow-md flex justify-between items-center z-10 border-b-2 border-gray-100">
      <div className="flex items-center gap-4">
        <span className="font-display text-2xl text-mft-blue">Ronda {round}</span>
        <span className="font-body text-gray-500 text-lg">
          Baza {trickNumber} / {maxTricks}
        </span>
      </div>
      
      <div className="flex gap-4 items-center flex-wrap">
        {players.map(p => (
          <div key={p.id} className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
            <div className={`w-4 h-4 rounded-full ${COLORS[p.color]}`}></div>
            <span className="font-bold text-sm">{p.name}</span>
            <div className="flex items-center text-mft-pink ml-1">
              <HeartIcon className="w-4 h-4"/>
              <span className="text-sm font-bold ml-0.5">{p.score}</span>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={onShowManual}
        className="text-mft-blue hover:text-mft-pink transition-colors flex items-center gap-1 font-bold"
        title="Ver manual"
      >
        <EyeIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Ayuda</span>
      </button>
    </div>
  );
};
