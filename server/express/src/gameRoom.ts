import * as Messages from "@scrawl.io/game-messages";
import { Player, runGame } from "../../game-logic/src/game";
import { delay } from "../../game-logic/src/delay";
import { captionPool } from "./captionPool";

class PlayerImpl implements Player {
  constructor(private socket: SocketIO.Socket, private name: string) {}

  public get id() {
    return this.name;
  }

  private async doAChallenge<T extends object>(
    payload: T,
    defaultAnswer: string,
    events: { start: string; update: string; finish: string },
    timeLimitMS: number
  ) {
    this.socket.emit(events.start, payload);
    let answer = defaultAnswer;
    this.socket.on(events.update, (updated) => (answer = updated));

    const timeLimit = delay(timeLimitMS);
    const finished = new Promise((resolve) => {
      this.socket.on(events.finish, resolve);
    });

    await Promise.race([timeLimit, finished]);

    return answer;
  }

  doCaptionChallenge(
    payload: Messages.CaptionChallenge
  ): Promise<Messages.Caption> {
    return this.doAChallenge(
      payload,
      `[Sorry, but ${this.name} timed out before writing a caption!]`,
      {
        start: "start-caption-challenge",
        update: "update-caption",
        finish: "finished-caption",
      },
      40000
    );
  }

  doDrawChallenge(payload: Messages.DrawChallenge): Promise<Messages.Drawing> {
    return this.doAChallenge(
      payload,
      "",
      {
        start: "start-drawing-challenge",
        update: "update-drawing",
        finish: "finished-drawing",
      },
      60000
    );
  }

  async viewResults(payload: Messages.GameResult): Promise<void> {
    this.socket.emit("results", payload);
  }
}

export class GameRoom {
  constructor(public id: string, private io: SocketIO.Server) {}

  public add(socket: SocketIO.Socket): void {
    if (this.started) {
      socket.emit("fail", "The game has already started");
      return;
    }

    socket.join(this.id);
    this.playerIDs.push(socket.id);
    const newName = this.generateName();
    this.socketIDToName[socket.id] = newName;

    socket.emit("joined-room", {
      room: this.id,
      you: newName,
    });

    this.emitLobbyUpdate();

    socket.on("change-name", (newName: string) => {
      // Names must be unique
      if (!Object.values(this.socketIDToName).includes(newName)) {
        this.socketIDToName[socket.id] = newName;
        socket.emit("changed-name", newName);
        this.emitLobbyUpdate();
      }
    });

    socket.on("start-game", () => {
      if (socket.id !== this.host) {
        socket.emit("fail", "Only the host can start the game");
        return;
      }
      if (this.started) {
        socket.emit("fail", "The game has already started");
        return;
      }
      if (this.numberOfPlayers() < 4) {
        socket.emit("fail", "Not enough players in the game");
        return;
      }
      this.started = true;
      this.runGame();
    });

    socket.on("disconnect", () => {
      if (this.started) {
        this.emit(
          "fail",
          "Somebody disconnected, and I didn't feel like writing the code properly"
        );
      }
      delete this.socketIDToName[socket.id];
      this.playerIDs = this.playerIDs.filter((id) => id !== socket.id);
      this.emitLobbyUpdate();
    });
  }

  private generateName(): string {
    const { players } = this.lobbyState();
    let i = 1;
    while (true) {
      const name = `Player#${i}`;
      if (!players.includes(name)) {
        return name;
      }
      ++i;
    }
  }

  private runGame(): void {
    this.io.sockets.sockets;
    const players = this.playerIDs.map(
      (id) =>
        new PlayerImpl(this.io.sockets.sockets[id], this.socketIDToName[id])
    );

    runGame(captionPool, players)
      .then(() => {
        console.log(`Game ${this.id} finished!`);
      })
      .catch(() => {
        console.log(`Game ${this.id} failed for some reason`);
      })
      .finally(() => {
        this.started = false;
      });
  }

  private emitLobbyUpdate(): void {
    const state = this.lobbyState();
    console.log(`STATE: ${JSON.stringify(state)}`);
    this.emit("lobby-update", state);
  }

  private lobbyState(): Messages.LobbyState {
    console.log(`PLAYERS: ${JSON.stringify(this.socketIDToName)}`);
    return {
      players: Object.values(this.socketIDToName),
      host: this.socketIDToName[this.host ?? ""],
    };
  }

  private emit(event: string, message: string | object): void {
    this.io.to(this.id).emit(event, message);
  }

  private numberOfPlayers() {
    return Object.keys(this.socketIDToName).length;
  }

  private get host(): string | undefined {
    return this.playerIDs[0];
  }

  private started: boolean = false;
  private playerIDs: string[] = [];
  private socketIDToName: { [id: string]: string } = {};
}
