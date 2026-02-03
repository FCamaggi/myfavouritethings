import React from 'react';
import { Card as CardType } from '../types';
import { Card } from './Card';
import { PlayerColor } from '../types';

interface HandDisplayProps {
  cards: CardType[];
  color: PlayerColor;
  onCardClick: (cardId: string) => void;
  isDisabled?: boolean;
  category: string;
}

export const HandDisplay: React.FC<HandDisplayProps> = ({ 
  cards, 
  color, 
  onCardClick, 
  isDisabled = false,
  category 
}) => {
  const availableCards = cards.filter(c => !c.isPlayed);

  return (
    <div className="w-full max-w-5xl bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-8 flex flex-col items-center z-20 mt-auto">
      <div className="mb-6 text-center">
        <h3 className="font-display text-3xl text-black mb-2">Tu Turno</h3>
        <p className="text-gray-600 font-body">
          Categoría: <span className="font-bold text-black">{category}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Cartas restantes: {availableCards.length}
        </p>
      </div>

      {availableCards.length === 0 ? (
        <div className="text-center text-gray-400 py-8">
          <p className="text-xl font-bold mb-2">No tienes más cartas</p>
          <p className="text-sm">Esperando a otros jugadores...</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-4">
          {availableCards.map((card) => (
            <div 
              key={card.id}
              className="transform transition-all duration-200 hover:scale-105"
            >
              <Card 
                card={card}
                color={color}
                isRevealed={false}
                onClick={() => !isDisabled && onCardClick(card.id)}
                disabled={isDisabled}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
