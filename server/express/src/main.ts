import express from "express";
import socketIO from "socket.io";
import http from "http";
import { createRoom, joinRoom } from "./rooms";
import path from "path";
import fetch from "node-fetch";

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = process.env.PORT ?? "80";

const clientPath = path.join(process.cwd(), "..", "client", "build");

createRoom("test", io);

app.get("/", (req, res) => res.send("Hello World!"));

app.get("/games/:gameid", (req, res) => {
  fetch(`http://localhost:${port}/index.html`).then((fetchRes) => {
    fetchRes.body.pipe(res);
  });
});

app.use(express.static(clientPath));

io.on("connection", (socket) => {
  socket.on("join-room", (roomCode: string) => {
    joinRoom(roomCode, socket);
  });
});

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
