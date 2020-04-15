import express from "express";
import socketIO from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 5385;

app.get("/", (req, res) => res.send("Hello World!"));

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);

  socket.on("join-room", () => {});
});

server.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
