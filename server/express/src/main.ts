import express from "express";
import socketIO from "socket.io";
import http from "http";
import { createRoom, joinRoom } from "./rooms";

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 5385;

createRoom("test", io);

app.get("/", (req, res) => res.send("Hello World!"));

io.on("connection", (socket) => {
  socket.on("join-room", (roomCode: string) => {
    joinRoom(roomCode, socket);
  });
});

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
