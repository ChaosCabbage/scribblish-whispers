import React, { useCallback, useState } from "react";
import * as Messages from "@scrawl.io/game-messages";
import { Board } from "./Board";
import "./DrawingChallenge.css";

interface Props {
  challenge: Messages.DrawChallenge;
  onDrawingChange?(pngURL: string): void;
}

export const DrawingChallenge = ({ challenge, onDrawingChange }: Props) => {
  const [png, setPng] = useState("");
  const onChange = useCallback(
    (dataURL: string) => {
      setPng(dataURL);
      onDrawingChange?.(dataURL);
    },
    [onDrawingChange, setPng]
  );

  return (
    <section className="challenge">
      <div className="caption">
        <p>{challenge.from} wrote:</p>
        <blockquote>{challenge.caption}</blockquote>
      </div>
      <Board onDrawingChange={onChange} />
      <form className="finish">
        <img alt="Preview" width="64" height="64" src={png} />
        <button>Done</button>
      </form>
    </section>
  );
};
