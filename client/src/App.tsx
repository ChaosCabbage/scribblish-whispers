import React, { useState } from "react";
import "./App.css";
import { DrawingChallenge } from "./DrawingChallenge";
import { CaptionChallenge } from "./CaptionChallenge";

function App() {
  const [mode, setMode] = useState<"drawing" | "caption">("drawing");
  const [caption, setCaption] = useState("Moses in a helicopter");
  const [drawing, setDrawing] = useState("");

  const challenge =
    mode === "drawing" ? (
      <DrawingChallenge
        challenge={{ caption, from: "Jeff Goldblum" }}
        onDrawingChange={setDrawing}
        onFinish={() => setMode("caption")}
        timeLimitSeconds={60}
      />
    ) : (
      <CaptionChallenge
        challenge={{ drawing, from: "Yourself" }}
        timeLimitSeconds={40}
        onCaptionChange={setCaption}
        onFinish={() => setMode("drawing")}
      />
    );

  return <div className="App">{challenge}</div>;
}

export default App;
