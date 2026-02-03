<div align="center">

# 🎮 My Favourite Things

### _Un juego de bazas multiplayer sobre conocer a tus amigos_

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/tu-usuario/my-favourite-things)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

[🎮 Jugar Ahora](#) • [📖 Manual](docs/md/My_favourite_things_condensed_rules.md) • [🎓 Tutorial](#características)

</div>

---

## 📋 ¿Qué es My Favourite Things?

Un party game digital donde **no conoces el valor de tus propias cartas**. Debes hacer conjeturas informadas basándote en lo que escribieron tus amigos sobre sus cosas favoritas.

**La mecánica única:** Escribes respuestas en las cartas de OTRO jugador, no en las tuyas. Luego juegas tus cartas sin saber qué número tienen, intentando ganar bazas adivinando qué tan favorito es cada ítem para quien lo escribió.

---

## ✨ Características

### 🌐 Multiplayer en Tiempo Real

- Cada jugador usa su propio dispositivo
- Sincronización instantánea con WebSocket
- Sistema de lobbies con códigos únicos (ej: "A3F9")
- 3-6 jugadores por partida

### 🎓 Experiencia Completa

- **Tutorial interactivo** paso a paso para nuevos jugadores
- **Fase de lectura** donde todos ven las respuestas antes de jugar
- **Ayudas contextuales** durante todo el juego
- **Animaciones suaves** y feedback visual claro
- **Panel de estado** mostrando info de todos los jugadores

### 🎯 Fiel a las Reglas Oficiales

- 2 rondas, 5 bazas por ronda
- Pasar categorías izquierda (R1) / derecha (R2)
- Regla especial: 💔 vence a #1
- Empates resueltos por orden de jugada
- Sistema de puntuación con corazones ❤️

### 🎨 Interfaz Moderna

- Diseño responsive (móvil/desktop/tablet)
- 6 colores vibrantes de jugador
- Animaciones de revelación
- Modals con manuales y ejemplos
- Transiciones suaves

---

## 🎲 Cómo Jugar

### 🚪 1. Crear o Unirse a un Lobby

**Crear Lobby:**

1. Ingresa tu nombre
2. Click en "Crear Lobby"
3. Comparte el código de 4 letras con tus amigos

**Unirse:**

1. Ingresa tu nombre
2. Click en "Unirse a Lobby"
3. Escribe el código del lobby
4. ¡Listo!

### 📝 2. Fase de Categorías

Cada jugador:

- Recibe una categoría de otro jugador
- Ejemplo: "Sabores de helado", "Películas de acción", "Lugares para viajar"
- **Tip:** Las categorías pasan a la IZQUIERDA en Ronda 1, a la DERECHA en Ronda 2

### ✍️ 3. Escribir Respuestas

Escribe 6 cosas para la categoría que recibiste:

- **#1**: Tu favorito absoluto ⭐
- **#2**: Tu segundo favorito
- **#3**: Tercero
- **#4**: Cuarto
- **#5**: Quinto
- **💔**: Algo que NO te gusta

**Importante:** Estas respuestas se escriben EN LAS CARTAS DEL JUGADOR QUE TE DIO LA CATEGORÍA.

**Ejemplo:**

```
Categoría: "Sabores de helado"
#1: Chocolate
#2: Vainilla
#3: Fresa
#4: Menta
#5: Limón
💔: Ron con pasas
```

### 📖 4. Fase de Lectura

**¡Momento crucial!**

- Todos ven las respuestas de todos en pantalla
- Los rankings (#1-5, 💔) están OCULTOS
- Solo sabes QUÉ escribieron, no QUÉ NÚMERO tiene cada respuesta

**Estrategia:** Intenta adivinar qué respuesta es el favorito (#1) de cada jugador. ¡Los números bajos ganan bazas!

### 🎲 5. Jugando Bazas (×10 total)

Cada baza:

1. El jugador activo elige una carta
2. Los demás juegan una carta cada uno en orden
3. Se revelan los números ocultos
4. **El número MÁS BAJO gana la baza**
5. El ganador recibe 1 ❤️

**Reglas importantes:**

- 1 es mejor que 2, 2 mejor que 3, etc.
- En caso de empate, gana el primer jugador de la baza
- El ganador de cada baza inicia la siguiente

### 💔 Regla Especial del Corazón Roto

```
Si en una baza hay:
  - Alguien juega un #1
  - Alguien juega un 💔

¡El 💔 GANA la baza!
```

En cualquier otra situación, el 💔 pierde contra todo (es como un #100).

### 🏆 6. Victoria

Después de **2 rondas** (10 bazas totales):

- El jugador con MÁS ❤️ gana
- En caso de empate, ¡todos ganan!

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 19** con TypeScript
- **Vite** para bundling ultra-rápido
- **TailwindCSS** para estilos
- **Socket.IO Client** para comunicación real-time

### Backend

- **Node.js** + **Express**
- **TypeScript** para type safety
- **Socket.IO Server** para WebSocket
- **MongoDB** + **Mongoose** para persistencia
- **Rate limiting** y seguridad incluida

### Deployment

- **Frontend:** Netlify
- **Backend:** Render
- **Database:** MongoDB Atlas

---

## 🚀 Desarrollo Local

### Prerequisitos

- Node.js v18+
- MongoDB local o Atlas

### Setup

```bash
# 1. Instalar dependencias
npm install
cd backend && npm install
cd ../frontend && npm install

# 2. Iniciar desarrollo
cd ..
bash dev.sh

# Servidor corriendo:
# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

### Testing Multiplayer

Abre 4 tabs en `http://localhost:3000`:

1. Tab 1: Crea lobby
2. Tabs 2-4: Únete con el código
3. ¡Juega!

---

## 📁 Estructura del Proyecto

```
my-favourite-things/
├── frontend/               # React app
│   ├── src/
│   │   ├── App.tsx        # Componente principal
│   │   ├── components/    # Componentes React
│   │   ├── hooks/         # Custom hooks
│   │   └── services/      # Socket.IO service
│   └── package.json
│
├── backend/               # Node.js server
│   ├── src/
│   │   ├── index.ts       # Entry point
│   │   ├── models/        # Mongoose models
│   │   ├── services/      # Game logic
│   │   └── socket/        # Socket handlers
│   └── package.json
│
├── shared/                # Shared types
│   └── types.ts
│
├── docs/                  # Game manuals
│   └── md/
│       ├── MTF_rulebook.md
│       └── My_favourite_things_condensed_rules.md
│
└── dev.sh                 # Dev startup script
```

---

## 🎨 Capturas

### Lobby Screen

Crea o únete a un lobby con código único

### Fase de Categorías

Asigna categorías creativas a tus amigos

### Escribir Respuestas

Completa tus 6 respuestas favoritas

### Fase de Lectura

Todos ven las respuestas sin números

### Jugando Bazas

Adivina qué carta es mejor para ganar

### Resolución

Rankings revelados con animación

---

## 💡 Tips Estratégicos

1. **🎯 En la Fase de Lectura:** Memoriza qué crees que es el favorito de cada jugador
2. **🤔 Observa Patrones:** Si alguien juega una carta temprano, probablemente sea un número bajo
3. **💔 Cuidado con el Corazón Roto:** Solo es bueno contra #1
4. **👑 Ser Primer Jugador:** Ventaja en empates, juega estratégicamente
5. **🎲 Perder a Propósito:** A veces es mejor guardar tus mejores cartas

---

## 🤝 Contribuir

Las contribuciones son bienvenidas!

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Distribuido bajo licencia MIT. Ver `LICENSE` para más información.

---

## 🙏 Créditos

- Basado en el juego físico **"My Favourite Things"**
- Implementación fiel a las reglas oficiales
- Desarrollado con ❤️ para jugar con amigos

---

## 📞 Soporte

¿Problemas o sugerencias? Abre un [issue](https://github.com/tu-usuario/my-favourite-things/issues)

---

<div align="center">

**¡Diviértete conociendo mejor a tus amigos! 🎉**

[⬆️ Volver arriba](#-my-favourite-things)

</div>

## 🛠️ Instalación y Desarrollo

### Prerrequisitos

- Node.js (v18 o superior)
- MongoDB Atlas account (free tier)
- npm o yarn

### Setup Inicial

```bash
# Clonar repositorio
git clone [tu-repo]
cd FavouriteThings

# Configurar Backend
cd backend
cp .env.example .env
# Edita .env con tu MONGODB_URI
npm install
npm run dev  # Puerto 5000

# Configurar Frontend (nueva terminal)
cd ../frontend
cp .env.example .env
# .env ya tiene valores por defecto
npm install
npm run dev  # Puerto 3000
```

### Variables de Entorno

**backend/.env:**

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://...
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=dev-secret
```

**frontend/.env:**

```
VITE_API_URL=http://localhost:5000
VITE_WS_URL=http://localhost:5000
```

---

## 📁 Estructura del Proyecto

```
FavouriteThings/
├── frontend/               # React SPA (Netlify)
│   ├── src/
│   │   ├── App.tsx        # Componente principal
│   │   ├── components/    # Card, UI components
│   │   ├── hooks/         # useSocket hook
│   │   ├── services/      # socketService
│   │   ├── utils/         # Helpers
│   │   └── constants.tsx  # Colores, constantes
│   ├── package.json
│   └── vite.config.ts
├── backend/               # Node.js API (Render)
│   ├── src/
│   │   ├── index.ts       # Express + Socket.IO server
│   │   ├── models/        # MongoDB schemas
│   │   ├── services/      # lobbyService (game logic)
│   │   ├── socket/        # socketHandler
│   │   └── utils/         # gameLogic, helpers
│   ├── package.json
│   └── tsconfig.json
├── shared/                # Shared TypeScript types
│   └── types.ts
├── docs/                  # Documentación y manuales
│   └── md/
├── netlify.toml           # Config Netlify
├── render.yaml            # Config Render
└── DEPLOYMENT_V2.md       # Guía de despliegue completa
```

---

## 🌐 Despliegue

### Producción (Netlify + Render + MongoDB Atlas)

Ver guía completa en [DEPLOYMENT_V2.md](DEPLOYMENT_V2.md).

**Resumen rápido:**

1. Crear cluster en MongoDB Atlas (free tier)
2. Desplegar backend en Render con env vars
3. Desplegar frontend en Netlify
4. Actualizar CORS_ORIGIN en Render

**URLs ejemplo:**

- Frontend: `https://favourite-things.netlify.app`
- Backend: `https://favourite-things-backend.onrender.com`

---

## 🎮 Componentes Frontend

### Arquitectura de Componentes

```
App.tsx (Orquestador principal)
├── LobbyScreen          # Crear/unirse a lobby
├── GameScreen           # Vista principal del juego
│   ├── GameHeader       # Info ronda, jugadores
│   ├── CategoryPhase    # Asignar categorías
│   ├── AnswerPhase      # Escribir respuestas
│   ├── TrickDisplay     # Cartas en mesa
│   ├── HandDisplay      # Mano del jugador
│   └── ResultsDisplay   # Ganadores, puntajes
└── components/
    ├── Card.tsx         # Carta con animación sleeve
    ├── PlayerIndicator  # Lista de jugadores
    └── HelpTooltip      # Sistema de ayuda
```

### Hooks Personalizados

- **useSocket:** Maneja conexión WebSocket, eventos, estado del juego

### Servicios

- **socketService:** Cliente Socket.IO con métodos para todas las operaciones (crear lobby, jugar carta, etc.)

---

## 🔧 Backend Architecture

### Capas

1. **Express + Socket.IO Server** - HTTP + WebSocket
2. **Socket Handler** - Routing de eventos, validación
3. **Lobby Service** - Lógica de negocio authoritative
4. **MongoDB Models** - Persistencia con Mongoose

### Socket Events

**Client → Server:**

- `CREATE_LOBBY` - Crear nuevo lobby
- `JOIN_LOBBY` - Unirse con código
- `START_GAME` - Iniciar partida
- `SUBMIT_CATEGORY` - Enviar categoría
- `SUBMIT_ANSWERS` - Enviar respuestas
- `PLAY_CARD` - Jugar carta
- `CONTINUE_TRICK` - Siguiente baza
- `NEXT_ROUND` - Siguiente ronda
- `LEAVE_LOBBY` - Salir del lobby

**Server → Client:**

- `LOBBY_CREATED` - Lobby creado exitosamente
- `LOBBY_JOINED` - Unión exitosa
- `PLAYER_JOINED` - Nuevo jugador se unió
- `PLAYER_LEFT` - Jugador salió
- `GAME_STARTED` - Juego iniciado
- `GAME_STATE_CHANGED` - Estado actualizado
- `ERROR` - Error en operación

### Database Schema

**Lobby:**

```typescript
{
  code: string,           // 4-digit code (A3F9)
  players: Player[],      // Array de jugadores
  gameState: GameState,   // Estado completo del juego
  hostId: string,         // ID del host
  createdAt: Date,
  expiresAt: Date         // TTL: 2 horas
}
```

---

## 🎨 Diseño y UX

### Paleta de Colores

- **Rosa:** `#E6007E` - Jugador/Corazones
- **Amarillo:** `#FFC60B` - Destacados
- **Verde:** `#7AC142` - Natural
- **Azul:** `#0060AD` - Principal
- **Morado:** `#605CA8` - Profundo
- **Naranja:** `#F18E00` - Cálido

### Tipografía

- **Display:** Anton (títulos, estilo "marker")
- **Body:** Inter (contenido, legible)

### Animaciones

- `fadeIn` - Transiciones de pantalla
- `slideIn` - Entrada de elementos
- `slideUp` - Modales y alertas
- `pop` - Feedback de acciones
- `bounce` - Elementos destacados

---

## 🎮 Fases del Juego

1. **LOBBY** - Jugadores se unen con código
2. **CATEGORY_SELECTION** - Asignar categorías (cada uno en su dispositivo)
3. **WRITING_ANSWERS** - Escribir respuestas privadamente
4. **TRICK_START** - Inicio de baza
5. **TRICK_PLAYING** - Jugadores juegan cartas
6. **TRICK_RESOLUTION** - Revelar ganador
7. **ROUND_END** - Fin de ronda
8. **GAME_END** - Ganador final

---

## 🧩 Componentes Clave

### Card Component

Carta con animación de "sleeve" que se desliza para revelar el rango oculto.

```tsx
<Card
  card={cardData}
  color="pink"
  isRevealed={true}
  onClick={() => playCard(card.id)}
  size="md"
/>
```

### useSocket Hook

Hook personalizado que encapsula toda la lógica de Socket.IO.

```tsx
const {
  isConnected,
  gameState,
  playerId,
  error,
  createLobby,
  joinLobby,
  playCard,
} = useSocket();
```

---

## 📖 Manuales Incluidos

- `MTF_rulebook.md` - Reglas completas en español con análisis de diseño
- `manual_both_side_english.md` - Versión inglesa ("Eye My Favorite Things")
- `My_favourite_things_condensed_rules.md` - Guía rápida con ejemplos

---

## 🎯 Reglas Especiales

### Ganador de Baza

```typescript
// Regla Normal: Número más bajo gana
if (lowestRank) {
  winner = playerWithLowestRank;
}

// Regla Especial: 💔 vence a #1
if (hasRank1 && hasBrokenHeart) {
  winner = playerWithBrokenHeart; // ¡El odio vence al amor!
}

// Empate: Quien jugó primero gana
if (tie) {
  winner = firstPlayerInOrder;
}
```

**Implementación:** Ver [backend/src/utils/gameLogic.ts](backend/src/utils/gameLogic.ts#L10)

---

## 🧪 Testing

### Desarrollo Local

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Abrir múltiples tabs en http://localhost:3000
# Probar crear lobby y unirse desde diferentes tabs
```

### Testing Multiplayer

1. Crear lobby en tab 1 (obtener código)
2. Unirse desde tabs 2, 3, 4 con el mismo código
3. Host inicia juego
4. Cada "jugador" escribe categorías y respuestas
5. Jugar bazas completas
6. Verificar sincronización en todas las tabs

---

## 🤝 Contribuir

Este proyecto sigue fielmente las reglas del juego físico original. Las contribuciones deben:

- Respetar la mecánica original del juego
- Mantener el estilo visual flat establecido
- Seguir las convenciones de código TypeScript
- Probar en múltiples dispositivos/tabs
- Documentar cambios significativos

---

## 📝 Changelog

### V2.0 (Actual)

- ✨ Sistema multiplayer con lobbies
- ✨ Backend Node.js + Socket.IO
- ✨ MongoDB Atlas para persistencia
- ✨ WebSocket para tiempo real
- ✨ Cada jugador en su dispositivo
- ✨ Auto-despliegue en Netlify + Render

### V1.0 (Deprecada)

- Versión local single-device
- Estado en React useState
- Pas device entre jugadores

---

## 📄 Licencia

Proyecto educacional basado en el juego físico "My Favourite Things". El diseño original pertenece a sus creadores.

---

## 🙏 Créditos

- **Juego Original:** Labo (Toshiki V.J)
- **Artwork Original:** TANSAN & Co.
- **Implementación Digital:** Edición comunitaria V2 Multiplayer

---

<div align="center">
<p>Hecho con ❤️ para conocer mejor a tus amigos</p>
<p><strong>v2.0 - Multiplayer Cloud Edition</strong></p>
</div>
