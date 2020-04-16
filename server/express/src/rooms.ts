import { GameRoom } from "./gameRoom";
import SocketIO from "socket.io";

const currentRooms: { [id: string]: GameRoom } = {};

const roomExists = (room: string) => Object.keys(currentRooms).includes(room);

export const createRoom = (name: string, io: SocketIO.Server) => {
  if (roomExists(name)) return;

  currentRooms[name] = new GameRoom(name, io);
};

export const joinRoom = (room: string, player: SocketIO.Socket) => {
  if (!roomExists(room)) {
    player.emit("fail", "No such room");
    return;
  }

  currentRooms[room].add(player);
};
