import React, { useState } from 'react';

// --- Manual Modal ---

export const ManualModal = ({ onClose }: { onClose: () => void }) => {
  const [page, setPage] = useState(0);
  const pages = [
    {
      title: 'Objetivo del Juego',
      content: (
        <div className="text-left space-y-4">
          <p>
            En <strong>My Favourite Things</strong>, ganas corazones ganando
            bazas.
          </p>
          <p>
            Tienes cartas numeradas del <strong>1 al 5</strong> (tus cosas
            favoritas) y un <strong>Corazón Roto</strong> (algo que no te
            gusta).
          </p>
          <p>¡El jugador con más corazones al final de 2 rondas gana!</p>
        </div>
      ),
    },
    {
      title: 'Preparación',
      content: (
        <div className="text-left space-y-4">
          <p>
            1. Primero, escribirás una <strong>Categoría</strong> para el
            jugador sentado a tu lado.
          </p>
          <p>2. Luego, recibirás una categoría de otro jugador.</p>
          <p>
            3. Completarás tus cartas escribiendo cosas que encajen en esa
            categoría, desde tu Favorito #1 hasta el #5, y una cosa que NO te
            guste para el Corazón Roto.
          </p>
        </div>
      ),
    },
    {
      title: '¿Qué es una Baza?',
      content: (
        <div className="text-left space-y-4">
          <p>
            Una <strong>baza</strong> (o "trick") es una ronda de juego donde
            cada jugador juega una carta.
          </p>
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
          <p className="text-sm">
            Se juegan <strong>5 bazas</strong> por ronda (quedará 1 carta sin
            jugar).
          </p>
        </div>
      ),
    },
    {
      title: 'Cómo Jugar',
      content: (
        <div className="text-left space-y-4">
          <p>En tu turno:</p>
          <div className="space-y-3">
            <div className="flex gap-3">
              <span className="text-2xl">1️⃣</span>
              <div>
                <p className="font-bold">Elige una carta</p>
                <p className="text-sm text-gray-600">
                  Piensa estratégicamente: ¿qué carta crees que ganará?
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">2️⃣</span>
              <div>
                <p className="font-bold">Ponla en la mesa</p>
                <p className="text-sm text-gray-600">
                  El número permanece oculto hasta el final
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">3️⃣</span>
              <div>
                <p className="font-bold">Lee tu respuesta</p>
                <p className="text-sm text-gray-600">
                  Anuncia lo que escribiste para esa categoría
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Reglas de Victoria',
      content: (
        <div className="text-left space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="font-bold text-green-700 mb-2">✅ Regla Normal:</p>
            <p className="text-sm">
              El <strong>número más bajo</strong> gana la baza
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Ejemplo: Si se juegan 3, 1, 4 → gana el 1
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <p className="font-bold text-red-600 mb-2">💔 Regla Especial:</p>
            <p className="text-sm mb-1">
              Si se juega un <strong>#1</strong> Y un{' '}
              <strong>Corazón Roto</strong> juntos...
            </p>
            <p className="font-bold text-sm">¡El Corazón Roto gana!</p>
            <p className="text-xs text-gray-600 mt-1">
              El odio vence al amor en este único caso
            </p>
          </div>

          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-xs">
              <strong>Empates:</strong> Gana quien jugó su carta primero
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Ejemplo de Baza',
      content: (
        <div className="text-left space-y-3">
          <p className="text-sm font-bold">
            Categoría: "Ingredientes de Pizza"
          </p>

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
              Aunque María jugó un #1, el Corazón Roto de Luis activa la regla
              especial y gana la baza.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: 'Estrategia',
      content: (
        <div className="text-left space-y-4">
          <p className="font-bold">💡 Consejos para ganar:</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>
              <strong>Conoce a tus amigos:</strong> ¿Qué les gusta realmente?
            </li>
            <li>
              <strong>Adivina los números:</strong> Las respuestas más
              entusiastas suelen ser el #1
            </li>
            <li>
              <strong>Timing del Corazón Roto:</strong> Úsalo cuando sospeches
              que alguien jugará su #1
            </li>
            <li>
              <strong>Observa las cartas usadas:</strong> Si ya salió el #1, el
              Corazón Roto pierde valor
            </li>
          </ul>
          <p className="text-xs text-gray-500 mt-4 italic">
            Recuerda: Este juego es sobre conocer a tus amigos y divertirte
            juntos
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-display text-2xl text-mft-blue">
            {pages[page].title}
          </h3>
          <span className="text-xs font-bold text-gray-400">
            {page + 1} / {pages.length}
          </span>
        </div>

        <div className="flex-1 font-body text-gray-700">
          {pages[page].content}
        </div>

        <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
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
              onClick={() => setPage((p) => Math.min(pages.length - 1, p + 1))}
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

// --- Examples Modal ---

export const ExamplesModal = ({ onClose }: { onClose: () => void }) => {
  const categories = [
    'Ingredientes de Pizza',
    'Superhéroes Inútiles',
    'Cosas que huelen mal',
    'Lugares para una primera cita',
    'Cosas que harías por $1 millón',
    'Mascotas exóticas',
    'Sabores de helado',
    'Tareas del hogar',
    'Regalos de cumpleaños terribles',
    'Cosas que encuentras en un bolsillo',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h3 className="font-display text-3xl text-mft-blue mb-6 text-center">
          Ideas de Categorías
        </h3>

        <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-3 rounded-lg border border-gray-100 font-body text-gray-700 text-center hover:bg-yellow-50 transition-colors"
            >
              {cat}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
