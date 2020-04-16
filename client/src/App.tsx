import React, { useState, useEffect } from "react";
import "./App.css";
import { DrawingChallenge } from "./DrawingChallenge";
import { CaptionChallenge } from "./CaptionChallenge";
import { Lobby } from "./Lobby";
import { Results } from "./Results";
import * as Messages from "@scrawl.io/game-messages";

type GameState =
  | {
      type: "preload";
    }
  | {
      type: "lobby";
      modeProps: Messages.LobbyState;
    }
  | {
      type: "drawing";
      modeProps: Messages.DrawChallenge;
    }
  | {
      type: "caption";
      modeProps: Messages.CaptionChallenge;
    }
  | {
      type: "results";
      modeProps: Messages.GameResult;
    }
  | {
      type: "error";
      message: string;
    };

function App({
  roomCode,
  socket,
}: {
  roomCode: string;
  socket: SocketIOClient.Socket;
}) {
  const [mode, setMode] = useState<GameState>({
    type: "preload",
  });
  const [name, setName] = useState("");

  useEffect(() => {
    socket.on("fail", (message: string) => {
      if (mode.type === "results") return;
      setMode({ type: "error", message });
    });
    socket.on("joined-room", ({ you }: Messages.JoinRoom) => {
      setName(you);
    });
    socket.on("changed-name", setName);
    socket.on("lobby-update", (lobby: Messages.LobbyState) => {
      if (mode.type === "results") return;
      setMode({ type: "lobby", modeProps: lobby });
    });
    socket.on(
      "start-caption-challenge",
      (payload: Messages.CaptionChallenge) => {
        if (mode.type === "results") return;
        setMode({ type: "caption", modeProps: payload });
      }
    );
    socket.on("start-drawing-challenge", (payload: Messages.DrawChallenge) => {
      if (mode.type === "results") return;
      setMode({ type: "drawing", modeProps: payload });
    });
    socket.on("results", (payload: Messages.GameResult) => {
      setMode({ type: "results", modeProps: payload });
    });
  }, [socket]);

  const gameContent = () => {
    switch (mode.type) {
      case "preload":
        return <p>Please wait...</p>;
      case "lobby":
        return (
          <Lobby
            beginGame={() => socket.emit("start-game")}
            changeName={(newName) => socket.emit("change-name", newName)}
            minimumPlayers={4}
            yourName={name}
            otherPlayers={mode.modeProps.players.filter((n) => n !== name)}
            youAreHost={mode.modeProps.host === name}
          />
        );
      case "drawing":
        return (
          <DrawingChallenge
            challenge={mode.modeProps}
            onDrawingChange={(drawing) =>
              socket.emit("update-drawing", drawing)
            }
            onFinish={() => socket.emit("finished-drawing")}
            timeLimitSeconds={60}
          />
        );
      case "caption":
        return (
          <CaptionChallenge
            challenge={mode.modeProps}
            timeLimitSeconds={40}
            onCaptionChange={(caption) =>
              socket.emit("update-caption", caption)
            }
            onFinish={() => socket.emit("finished-caption")}
          />
        );
      case "results":
        return <Results {...mode.modeProps} />;
      case "error":
        return (
          <article className="errorPage">
            <h1>A thing went wrong.</h1>
            <p>{mode.message}</p>
          </article>
        );
    }
  };

  return <div className="App">{gameContent()}</div>;
}

export default App;
