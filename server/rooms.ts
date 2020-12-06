import _ from 'lodash';
import * as securePin from 'secure-pin';
import { Server } from 'socket.io';
import uniqid from 'uniqid';
import { AppSocket } from '.';
import Player from './player';
import { Rule, standardRules } from './rules';
import { CommonModels } from '../common/models';
import {
  GameState,
  GameStateType,
  PopupState,
  PopupType,
  POPUP_STANDARD_DELAY
} from '../common/models/common';

const securePinGeneratePromise = (length: number) =>
  new Promise<string>((resolve) => {
    securePin.generatePin(length, (pin: string) => resolve(pin));
  });

export class Room implements CommonModels.Room {
  players: Player[] = [];
  activePlayers: Player[] = [];
  rules: Rule[] = [...standardRules];
  turn?: string;
  dice: CommonModels.Dice = [];
  host: AppSocket;
  destroyed: boolean = false;
  gameState: GameState = {
    type: GameStateType.Playing
  };

  rollTime: Date;

  constructor(public code: string) {
    this.code = code;
  }

  setGameState(state: GameState) {
    this.gameState = state;
  }

  addPlayer(name: string, socket: AppSocket) {
    name = _.toUpper(name);
    const ply = _.find(this.players, (p) => p.name == name);

    if (ply && ply.active) return;

    if (ply && !ply.active) {
      this.activatePlayer(ply, socket);
      socket.player = ply;

      return ply;
    }

    const newPly = new Player(name, uniqid(), socket);
    socket.player = newPly;

    this.players.push(newPly);

    this.activatePlayer(newPly, socket);

    return newPly;
  }

  activatePlayer(ply: Player, socket: AppSocket) {
    if (!ply) return;
    if (!this.players.find((p) => p == ply)) return;

    ply.setActive(true);
    ply.setSocket(socket);

    if (this.activePlayers.length == 0) {
      this.turn = ply.id;
    }

    if (!_.find(this.activePlayers, (p) => p == ply)) {
      console.log('Activating player ', ply.name, ' in room ', this.code);
      this.activePlayers.push(ply);
    }
  }

  inactivatePlayer(ply: Player) {
    if (!ply) return;

    ply.setActive(false);
    _.remove(this.activePlayers, (p) => {
      return p == ply;
    });

    if (this.turn === ply.id) {
      this.nextTurn();
    }
  }

  resetPlayerDrinks() {
    _.each(this.players, (p) => (p.pendingDrinks = 0));
  }

  setTurn(id: string) {
    if (!this.activePlayers.find((p) => p.id === id)) {
      console.error('Attempted to set turn to inactive player');
      return;
    }

    this.turn = id;
    console.log('now turn ', this.turn);
  }

  nextTurn() {
    const index = _.findIndex(this.activePlayers, (p) => p.id == this.turn);
    console.log('current turn index: ', index);

    if (index === -1) {
      if (this.activePlayers.length == 0) {
        this.turn = null;
      } else {
        this.turn = this.activePlayers[0].id;
      }

      return;
    }

    const nextIndex = (index + 1) % this.activePlayers.length;
    console.log('next turn index: ', nextIndex);

    const ply = this.activePlayers[nextIndex];
    this.turn = ply.id;

    console.log('now turn ', this.turn);
  }

  rollDice(ply: Player) {
    if (this.turn != ply.id) {
      console.log('Tried to roll when not player turn', ply.id);
      return false;
    }

    if (this.gameState.type !== GameStateType.Playing) {
      console.log('Tried to roll when game state is not playing', ply.id);
      return false;
    }

    const n1 = Math.floor(Math.random() * 6) + 1;
    const n2 = Math.floor(Math.random() * 6) + 1;

    this.dice = [n1, n2];
    this.rollTime = new Date();

    this.resetPlayerDrinks();

    const rules = this.matchRules(this.dice);
    if (rules.length == 0) {
      console.log('No rule matched');
      this.nextTurn();
    }

    return true;
  }

  matchRules(dice: CommonModels.Dice) {
    return _.filter(this.rules, (r) => r.matches(dice));
  }

  setHost(socket: AppSocket) {
    this.host = socket;
  }

  addRule(rule: Rule) {
    this.rules.push(rule);
  }

  getPlayerFromId(id: string) {
    return this.players.find((p) => p.id === id);
  }

  destroy() {
    this.destroyed = true;
  }

  serialize() {
    return {
      code: this.code,
      turn: this.turn,
      dice: this.dice,
      rollTime: this.rollTime,
      players: _.map(this.activePlayers, (p) => p.serialize()),
      gameState: this.gameState
    };
  }
}

export class RoomManager {
  rooms: Room[] = [];

  constructor(private io: Server) {
    this.io = io;
  }

  getRoom(code: string) {
    return _.find(this.rooms, (r) => r.code == code);
  }

  sendRoomInfo(socket: AppSocket) {
    const room = socket.room;

    // If room is invalid, and socket is not host
    if (!room || (room.host !== socket && !this.verifySocket(socket))) {
      this.sendInvalidSession(socket);

      return false;
    }

    if (room.destroyed) {
      socket.emit('room_info', {
        error: 'destroyed'
      });
      return;
    }

    socket.emit('room_info', room.serialize());

    return true;
  }

  setGameState(room: Room, state: GameState) {
    if (!room || room.destroyed) {
      console.error('Attempted to set game state in invalid room');
      return;
    }

    room.setGameState(state);
    this.syncRoom(room);
  }

  syncRoom(room: Room) {
    if (!room) {
      console.error('Attempted to sync invalid room');
      return;
    }

    if (room.destroyed) {
      this.io.to('room_' + room.code).emit('room_info', {
        error: 'destroyed'
      });
      return;
    }

    this.io.to('room_' + room.code).emit('room_info', room.serialize());
  }

  verifySocket(socket: AppSocket) {
    const room = socket.room;
    const ply = socket.player;

    if (room && room.host === socket) return true;

    if (!room || !ply || !ply.socket || ply.socket.id !== socket.id) {
      console.error('Invalid socket', socket.id, room?.host === socket, room?.code, ply?.socket);
      console.error(new Error().stack);
      return false;
    }

    return true;
  }

  kickPlayer(socket: AppSocket, id: string) {
    const { room } = socket;

    if (!room) return;

    if (room.host !== socket) {
      console.error('Only host can kick players');
      return;
    }

    const target = room.getPlayerFromId(id);
    if (!target) {
      console.error('Attempted to kick non existant player', id);
      return;
    }

    console.log('Kicked player', id);
    room.inactivatePlayer(target);

    this.syncRoom(room);

    if (target.socket) {
      target.socket.emit('room_info', { error: 'kicked' });
      target.socket.leave('room_' + room.code);
      target.socket = null;
    }
  }

  giveTurn(socket: AppSocket, id: string) {
    const { room } = socket;

    if (!this.verifySocket(socket)) {
      this.sendInvalidSession(socket);
      return;
    }

    if (room.host !== socket) {
      console.error('Only host can give turn to other players');
      return;
    }

    const target = room.getPlayerFromId(id);
    if (!target) {
      console.error('Attempted to give turn to non existant player', id);
      return;
    }

    room.setTurn(id);
    this.syncRoom(room);
  }

  giveDrinks(socket: AppSocket, targetIds: string[]) {
    const { room } = socket;

    if (!this.verifySocket(socket)) {
      this.sendInvalidSession(socket);
      return;
    }

    if (room.gameState.type !== GameStateType.Give) {
      console.error('Attempted to give drinks when game state is wrong');
      return;
    }

    if (room.gameState.playerId !== socket.player.id) {
      console.error('Wrong player attempted to give out drinks');
      return;
    }

    if (targetIds.length !== room.gameState.amount.length) {
      console.error('Player tried to give out too few drinks');
      return;
    }

    const targets = targetIds.map((id) => room.getPlayerFromId(id));
    if (targets.length !== targetIds.length) {
      console.error('Attempted to give drinks to non existant player', targetIds);
      return;
    }

    const gameState = room.gameState;

    const totalDrinks = {};
    targets.forEach((ply, i) => {
      totalDrinks[ply.id] ??= 0;
      totalDrinks[ply.id] += gameState.amount[i] ?? 0;
    });

    targets.forEach((ply) => {
      if (totalDrinks[ply.id] === 0) return;

      ply.addScore(totalDrinks[ply.id]);
      this.sendPopup(ply.socket, {
        type: PopupType.Drink,
        drinks: totalDrinks[ply.id],
        dice: room.dice
      });
    });

    this.setGameState(room, {
      type: GameStateType.Playing
    });

    this.syncRoom(room);
  }

  onClientLeave(socket: AppSocket) {
    const { room, player } = socket;

    if (room && room.host === socket) {
      console.log('HOST LEFT');

      this.destroyRoom(room);
      return;
    }

    if (!this.verifySocket(socket) || !player) return;

    console.log('player left', player.name);

    room.inactivatePlayer(player);

    socket.leave('room_' + room.code);
    socket.room = null;
    socket.player = null;

    this.syncRoom(room);
  }

  onClientReconnect(socket: AppSocket, id: string, code: string) {
    console.log('reconnect', id, code);
    const room = this.getRoom(code);
    if (!room) return;

    const ply = _.find(room.players, (p) => p.id == id);
    if (!ply) return;

    socket.room = room;
    socket.player = ply;
    socket.join('room_' + room.code);

    room.activatePlayer(ply, socket);
    this.syncRoom(room);
  }

  ensurePlayerActive(socket: AppSocket) {
    const room = socket.room;
    const ply = socket.player;

    if (!this.verifySocket(socket)) {
      this.sendInvalidSession(socket);
      return;
    }

    room.activatePlayer(ply, socket);
  }

  async createRoom(socket: AppSocket) {
    const code = await securePinGeneratePromise(4);

    if (this.getRoom(code)) {
      throw new Error(`Room with code "${code}" already exists`);
    }

    const room = new Room(code);
    this.rooms.push(room);

    console.log('Host is ', socket.id);
    socket.host = true;
    socket.room = room;
    socket.join('room_' + room.code);
    room.setHost(socket);

    return code;
  }

  enterRoom(code: string, name: string, socket: AppSocket) {
    const room = this.getRoom(code);

    if (!room) {
      console.error('No room with code ' + code);
      return false;
    }

    const ply = room.addPlayer(name, socket);

    if (ply) {
      socket.room = room;
      socket.join('room_' + room.code);
      socket.emit('player_id', { id: ply.id });

      console.log('player connected: ', name);

      this.syncRoom(room);
    } else {
      console.log('player could not connected: ', name);
    }

    return !!ply;
  }

  destroyRoom(room: Room) {
    if (!room) {
      console.error('Could not destroy invalid room');
      return;
    }

    room.destroy();
    this.syncRoom(room);
    _.remove(this.rooms, room);
  }

  sendInvalidSession(socket: AppSocket) {
    socket.emit('room_info', {
      error: 'invalid_session'
    });
  }

  rollDice(socket: AppSocket) {
    const { room, player } = socket;
    if (!this.verifySocket(socket)) {
      this.sendInvalidSession(socket);
      return;
    }

    const didRoll = room.rollDice(player);
    if (!didRoll) return;

    const players = room.activePlayers;

    const rules = room.matchRules(room.dice);
    _.each(rules, (r) => {
      console.log('executing rule', r.name);

      r.execute(this, room, player, players);
    });

    _.each(players, (ply) => {
      if (ply.pendingDrinks === 0) return;

      this.sendDrinks(room, ply, ply.pendingDrinks);
      ply.resetPendingDrinks();
    });

    this.syncRoom(room);
  }

  sendPopup(socket: AppSocket, popup: PopupState) {
    if (!this.verifySocket(socket)) {
      this.sendInvalidSession(socket);
      return;
    }

    console.log('Sending popup to ', socket.id, popup);

    socket.emit('room_popup', popup);
  }

  sendDrinks(room: Room, ply: Player, amount: number) {
    if (!ply) return;

    if (!this.verifySocket(ply.socket)) {
      this.sendInvalidSession(ply.socket);
      return;
    }

    ply.addScore(amount);
    this.sendPopup(ply.socket, {
      type: PopupType.Drink,
      drinks: amount,
      dice: room.dice,
      delay: POPUP_STANDARD_DELAY
    });
  }
}
