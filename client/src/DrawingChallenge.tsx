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
  const [done, setDone] = useState(false);
  const onChange = useCallback(
    (dataURL: string) => {
      if (!done) {
        setPng(dataURL);
        onDrawingChange?.(dataURL);
      }
    },
    [onDrawingChange, setPng, done]
  );
  const onDone = useCallback(() => {
    setDone(true);
    onFinish?.();
  }, [onFinish, setDone]);

  return (
    <article className="challenge">
      <section className="caption">
        <p>{challenge.from} wrote:</p>
        <blockquote>{challenge.caption}</blockquote>
        <p>Draw it!</p>
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
        <button disabled={done} className="finished" onClick={onDone}>
          I'm finished!
        </button>
      </section>
    </article>
  );
};
