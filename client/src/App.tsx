import React, { useState } from "react";
import "./App.css";
import { DrawingChallenge } from "./DrawingChallenge";
import { CaptionChallenge } from "./CaptionChallenge";
import { Lobby } from "./Lobby";

function App() {
  const [mode, setMode] = useState<"lobby" | "drawing" | "caption">("lobby");
  const [name, setName] = useState("Player#0");
  const [caption, setCaption] = useState("Moses in a helicopter");
  const [drawing, setDrawing] = useState("");

  const gameContent = () => {
    switch (mode) {
      case "lobby":
        return (
          <Lobby
            beginGame={() => setMode("drawing")}
            changeName={setName}
            minimumPlayers={4}
            yourName={name}
            otherPlayers={["Esme", "Plun", "Gahjo", "Marin"]}
            youAreHost={true}
          />
        );
      case "drawing":
        return (
          <DrawingChallenge
            challenge={{ caption, from: "Jeff Goldblum" }}
            onDrawingChange={setDrawing}
            onFinish={() => setMode("caption")}
            timeLimitSeconds={60}
          />
        );
      case "caption":
        return (
          <CaptionChallenge
            challenge={{ drawing, from: "Yourself" }}
            timeLimitSeconds={40}
            onCaptionChange={setCaption}
            onFinish={() => setMode("drawing")}
          />
        );
    }
  };

  return <div className="App">{gameContent()}</div>;
}

export default App;
