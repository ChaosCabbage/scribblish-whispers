import React, { useCallback, ChangeEvent, useState } from "react";
import * as Messages from "@scrawl.io/game-messages";
import { CountdownTimer } from "./Countdown";
import "./CaptionChallenge.css";

export interface CaptionChallengeProps {
  challenge: Messages.CaptionChallenge;
  timeLimitSeconds: number;
  onCaptionChange?(caption: string): void;
  onFinish?(): void;
}

export const CaptionChallenge = ({
  challenge,
  timeLimitSeconds,
  onCaptionChange,
  onFinish,
}: CaptionChallengeProps) => {
  const [done, setDone] = useState(false);
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onCaptionChange?.(event.target.value),
    [onCaptionChange]
  );
  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setDone(true);
      onFinish?.();
    },
    [onFinish, setDone]
  );
  return (
    <article>
      <section>
        <p>{challenge.from} drew:</p>
        <div className="imagePrompt">
          <img alt={`${challenge.from}'s drawing`} src={challenge.drawing} />
        </div>
      </section>
      <form onSubmit={submit}>
        <label htmlFor="answer">What is it?</label>
        <input disabled={done} id="answer" autoFocus onChange={onChange} />
        <CountdownTimer startSeconds={timeLimitSeconds} />
        {done ? undefined : (
          <>
            <input type="submit" value="Done" />
          </>
        )}
      </form>
    </article>
  );
};
