import React, { useState } from 'react';
import { HeartIcon } from '../constants';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "¡Bienvenido a My Favourite Things! 🎮",
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            Un juego de bazas donde adivinas los rankings secretos de las respuestas de tus amigos.
          </p>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="font-bold text-mft-blue mb-2">🎯 Objetivo:</p>
            <p>Gana bazas jugando cartas inteligentemente. El jugador con MÁS corazones {HeartIcon} al final gana!</p>
          </div>
          <div className="flex items-center justify-center gap-4 text-4xl">
            <span>📝</span>
            <span>→</span>
            <span>🎲</span>
            <span>→</span>
            <span>👑</span>
          </div>
        </div>
      )
    },
    {
      title: "🎴 Estructura del Juego",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <h4 className="font-bold text-mft-blue mb-2">2 Rondas Completas</h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Ronda 1:</strong> Pasas categorías a la IZQUIERDA ⬅️</li>
              <li>• <strong>Ronda 2:</strong> Pasas categorías a la DERECHA ➡️</li>
              <li>• Cada ronda tiene 5 bazas</li>
              <li>• Sobra 1 carta (tienes 6 cartas, juegas 5 bazas)</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-700">
              <strong>Dato clave:</strong> Escribes respuestas EN LAS CARTAS DE OTRO JUGADOR, no en las tuyas!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "📝 Fase 1: Categorías",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-bold text-mft-purple mb-3">¿Qué hacer?</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>Recibes una categoría de otro jugador</li>
              <li>Piensa en 6 cosas para esa categoría</li>
              <li>Ordénalas de favorita (#1) a menos favorita (#5)</li>
              <li>La #6 es el "💔 Corazón Roto" (algo que NO te gusta)</li>
            </ol>
          </div>
          <div className="border-2 border-purple-300 rounded-lg p-3">
            <p className="text-sm font-bold mb-2">Ejemplo: "Sabores de Helado"</p>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold">#1:</span> Chocolate
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">#2:</span> Vainilla
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">#3:</span> Fresa
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">#4:</span> Menta
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">#5:</span> Limón
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">💔:</span> Ron con pasas
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "📖 Fase 2: Lectura",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-bold text-mft-blue mb-3">¡Momento crucial!</h4>
            <p className="text-sm mb-3">
              Todos leen sus respuestas EN VOZ ALTA (o las ves en pantalla):
            </p>
            <ul className="space-y-2 text-sm">
              <li>✅ SABES todas las respuestas de todos</li>
              <li>❌ NO SABES qué ranking (#1-5, 💔) tiene cada una</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3">
            <p className="text-sm">
              <strong>🧠 Estrategia:</strong> Adivina qué respuesta es el favorito (#1) de cada jugador. Los números bajos ganan bazas!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "🎲 Fase 3: Jugando Bazas",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-bold text-mft-green mb-3">Cómo se juega cada baza:</h4>
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>El primer jugador elige una carta</li>
              <li>Los demás juegan una carta cada uno</li>
              <li>Se revelan los rankings secretos</li>
              <li>El número MÁS BAJO gana la baza</li>
              <li>El ganador recibe 1 {HeartIcon}</li>
            </ol>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border-2 border-green-300 rounded-lg p-3">
              <p className="font-bold text-green-700 mb-1 text-sm">Ganadoras:</p>
              <div className="space-y-1 text-xs">
                <div>#1 es la mejor ⭐</div>
                <div>#2 mejor que #3</div>
                <div>#3 mejor que #4</div>
              </div>
            </div>
            <div className="bg-white border-2 border-red-300 rounded-lg p-3">
              <p className="font-bold text-red-700 mb-1 text-sm">Perdedoras:</p>
              <div className="space-y-1 text-xs">
                <div>#5 pierde contra todos</div>
                <div>💔 CASI siempre pierde</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "💔 Regla Especial del Corazón Roto",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border-2 border-red-300">
            <h4 className="font-bold text-red-700 mb-3 text-lg">¡Regla Mágica!</h4>
            <div className="bg-white rounded-lg p-3 mb-3">
              <p className="text-center text-2xl mb-2">💔 vence a #1</p>
              <p className="text-sm text-center text-gray-600">
                Si alguien juega el Corazón Roto Y alguien juega un #1 en la misma baza...
              </p>
            </div>
            <p className="text-center font-bold text-red-700">
              ¡El Corazón Roto gana la baza!
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-3">
            <p className="text-sm">
              <strong>Nota:</strong> En cualquier otra situación, el 💔 es como un #100 (casi siempre pierde).
            </p>
          </div>
        </div>
      )
    },
    {
      title: "🎯 Empates y Primer Jugador",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-bold text-mft-purple mb-3">Resolución de Empates</h4>
            <p className="text-sm mb-3">
              Si dos cartas tienen el mismo ranking (ej: dos #2):
            </p>
            <div className="bg-white rounded-lg p-3 border-2 border-purple-300">
              <p className="text-center text-lg mb-2">
                🎯 El <strong>primer jugador</strong> de la baza gana
              </p>
              <p className="text-xs text-center text-gray-600">
                (Por eso se marca quién jugó primero)
              </p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm">
              <strong>Rotación:</strong> El ganador de cada baza inicia la siguiente. Así todos tienen oportunidad de ser primeros!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "🏆 Victoria y Consejos Finales",
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-400">
            <h4 className="font-bold text-yellow-700 mb-3 text-lg">🏆 Cómo Ganar</h4>
            <p className="text-center text-xl mb-2">
              El jugador con MÁS {HeartIcon} al final de 2 rondas gana!
            </p>
            <p className="text-sm text-center text-gray-600">
              (10 bazas totales: 5 en Ronda 1 + 5 en Ronda 2)
            </p>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-bold text-green-700 mb-2">💡 Consejos Estratégicos:</h4>
            <ul className="space-y-1 text-sm">
              <li>🎯 Intenta adivinar el favorito (#1) de cada jugador</li>
              <li>🤔 Observa qué cartas juegan temprano vs tarde</li>
              <li>💔 Cuidado con jugar el Corazón Roto (¡solo gana vs #1!)</li>
              <li>👑 Ser primer jugador es ventaja en empates</li>
              <li>🎲 A veces es mejor perder una baza estratégicamente</li>
            </ul>
          </div>
          
          <div className="text-center text-4xl">
            🎮 ¡Diviértete! 🎉
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('mft_tutorial_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-mft-blue via-mft-purple to-mft-pink p-6 rounded-t-3xl">
          <div className="flex justify-between items-start mb-4">
            <h2 className="font-display text-2xl text-white">
              {steps[currentStep].title}
            </h2>
            <button
              onClick={handleSkip}
              className="text-white text-sm hover:underline"
            >
              Saltar
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-white text-xs mt-2 text-center">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed font-medium"
          >
            ← Anterior
          </button>
          
          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-mft-blue to-mft-purple text-white rounded-xl font-bold hover:shadow-lg transition-all"
          >
            {currentStep === steps.length - 1 ? '¡Entendido! 🎮' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
};
