import React, { useCallback, ChangeEvent } from "react";
import * as Messages from "@scrawl.io/game-messages";
import { CountdownTimer } from "./Countdown";

interface Props {
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
}: Props) => {
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      onCaptionChange?.(event.target.value),
    [onCaptionChange]
  );
  const submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onFinish?.();
    },
    [onFinish]
  );
  return (
    <article>
      <section>
        <p>{challenge.from} drew:</p>
        <div>
          <img alt={`${challenge.from}'s drawing`} src={challenge.drawing} />
        </div>
      </section>
      <form onSubmit={submit}>
        <CountdownTimer startSeconds={timeLimitSeconds} />
        <label htmlFor="answer">What is it?</label>
        <input id="answer" autoFocus onChange={onChange} />
      </form>
    </article>
  );
};
