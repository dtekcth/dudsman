import express, { Request, Response } from 'express';
import { createServer } from 'http';
import next from 'next';
import { Server, Socket } from 'socket.io';
import Player from './player';
import { Room, RoomManager } from './rooms';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Express
const server = express();
const httpServer = createServer(server);

// Socket IO
export const io: Server = require('socket.io')(httpServer);

export const roomManager = new RoomManager(io);

const room = new Room('0000');
roomManager.rooms.push(room);

export type AppSocket = Socket & {
  room: Room;
  player: Player;
  host?: boolean;
};

io.on('connection', (socket: AppSocket) => {
  socket.on('disconnect', () => {
    roomManager.onClientLeave(socket);
  });

  socket.on('room_create', async (data, cb) => {
    try {
      const code = await roomManager.createRoom(socket);
      cb(null, code);
    } catch (e) {
      cb(e);
    }
  });

  socket.on('room_enter', (data, cb) => {
    const joined = roomManager.enterRoom(data.code, data.name, socket);

    cb(null, joined);
  });

  socket.on('room_leave', () => {
    roomManager.onClientLeave(socket);
  });

  socket.on('room_info', (data, cb) => {
    roomManager.ensurePlayerActive(socket);
    roomManager.sendRoomInfo(socket);
  });

  socket.on('room_roll_dice', () => {
    roomManager.rollDice(socket);
  });

  socket.on('room_reconnect', (data) => {
    roomManager.onClientReconnect(socket, data.id, data.code);
  });

  socket.on('room_kick_player', ({ id }) => {
    roomManager.kickPlayer(socket, id);
  });

  socket.on('room_give_turn', ({ id }) => {
    roomManager.giveTurn(socket, id);
  });

  socket.on('room_give_drinks', ({ targetIds }) => {
    console.log(targetIds);
    roomManager.giveDrinks(socket, targetIds);
  });

  socket.on('room_click_dot', () => {
    roomManager.onClickDot(socket);
  });
});

(async () => {
  try {
    await app.prepare();

    server.all('*', (req: Request, res: Response) => {
      return handle(req, res);
    });

    httpServer.listen(port, (err?: any) => {
      if (err) throw err;
      console.log(`> Ready on localhost:${port} - env ${process.env.NODE_ENV}`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
