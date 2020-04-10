import React from "react";
import "./App.css";
import { DrawingChallenge } from "./DrawingChallenge";

function App() {
  return (
    <div className="App">
      <DrawingChallenge
        challenge={{ caption: "Moses in a helicopter", from: "Jeff Goldblum" }}
      />
    </div>
  );
}

export default App;
