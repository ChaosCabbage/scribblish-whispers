import React, { useCallback, useState } from "react";
import * as Messages from "@scrawl.io/game-messages";
import { Board } from "./Board";
import { CountdownTimer } from "./Countdown";
import "./DrawingChallenge.css";

export interface DrawingChallengeProps {
  challenge: Messages.DrawChallenge;
  timeLimitSeconds: number;
  onDrawingChange?(pngURL: string): void;
  onFinish?(): void;
}

export const DrawingChallenge = ({
  timeLimitSeconds,
  challenge,
  onDrawingChange,
  onFinish,
}: DrawingChallengeProps) => {
  const [png, setPng] = useState("");
  const onChange = useCallback(
    (dataURL: string) => {
      setPng(dataURL);
      onDrawingChange?.(dataURL);
    },
    [onDrawingChange, setPng]
  );

  return (
    <article className="challenge">
      <section className="caption">
        <p>{challenge.from} wrote:</p>
        <blockquote>{challenge.caption}</blockquote>
      </section>
      <Board onDrawingChange={onChange} />
      <section className="preview">
        <CountdownTimer startSeconds={timeLimitSeconds} />
        <img
          className="previewImage"
          alt="Preview"
          width="64"
          height="64"
          src={png}
        />
        <button className="finished" onClick={onFinish}>
          I'm finished!
        </button>
      </section>
    </article>
  );
};
