"use strict";
// Shared types between frontend and backend
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketEvent = exports.GamePhase = void 0;
var GamePhase;
(function (GamePhase) {
    GamePhase["LOBBY"] = "LOBBY";
    GamePhase["CATEGORY_SELECTION"] = "CATEGORY_SELECTION";
    GamePhase["WRITING_ANSWERS"] = "WRITING_ANSWERS";
    GamePhase["TRICK_START"] = "TRICK_START";
    GamePhase["TRICK_PLAYING"] = "TRICK_PLAYING";
    GamePhase["TRICK_RESOLUTION"] = "TRICK_RESOLUTION";
    GamePhase["ROUND_END"] = "ROUND_END";
    GamePhase["GAME_END"] = "GAME_END";
})(GamePhase || (exports.GamePhase = GamePhase = {}));
// WebSocket Events
var SocketEvent;
(function (SocketEvent) {
    // Client → Server
    SocketEvent["CREATE_LOBBY"] = "create-lobby";
    SocketEvent["JOIN_LOBBY"] = "join-lobby";
    SocketEvent["LEAVE_LOBBY"] = "leave-lobby";
    SocketEvent["START_GAME"] = "start-game";
    SocketEvent["SUBMIT_CATEGORY"] = "submit-category";
    SocketEvent["SUBMIT_ANSWERS"] = "submit-answers";
    SocketEvent["PLAY_CARD"] = "play-card";
    SocketEvent["CONTINUE_TRICK"] = "continue-trick";
    SocketEvent["NEXT_ROUND"] = "next-round";
    // Server → Client
    SocketEvent["LOBBY_CREATED"] = "lobby-created";
    SocketEvent["LOBBY_JOINED"] = "lobby-joined";
    SocketEvent["LOBBY_UPDATED"] = "lobby-updated";
    SocketEvent["PLAYER_JOINED"] = "player-joined";
    SocketEvent["PLAYER_LEFT"] = "player-left";
    SocketEvent["GAME_STARTED"] = "game-started";
    SocketEvent["GAME_STATE_CHANGED"] = "game-state-changed";
    SocketEvent["TRICK_RESOLVED"] = "trick-resolved";
    SocketEvent["ERROR"] = "error";
    SocketEvent["DISCONNECT"] = "disconnect";
    SocketEvent["RECONNECTED"] = "reconnected";
})(SocketEvent || (exports.SocketEvent = SocketEvent = {}));
