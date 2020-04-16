import React from "react";
import * as Messages from "@scrawl.io/game-messages";
import "./Results.css";

const CaptionWithAuthor = (props: Messages.Authored<Messages.Caption>) => (
  <figure>
    <blockquote>{props.content}</blockquote>
    <figcaption>{props.author}</figcaption>
  </figure>
);

const DrawingWithAuthor = (props: Messages.Authored<Messages.Drawing>) => (
  <figure>
    <img src={props.content} alt={`${props.author}'s drawing`} />
    <figcaption>{props.author}</figcaption>
  </figure>
);

const Chain = ({ result }: { result: Messages.GameChain }) => (
  <section className="chain">
    <CaptionWithAuthor author="Original prompt" content={result.original} />
    {result.results.flatMap(([drawing, caption]) => [
      <DrawingWithAuthor key={drawing.author} {...drawing} />,
      <CaptionWithAuthor key={caption.author} {...caption} />,
    ])}
  </section>
);

export const Results = (props: Messages.GameResult) => (
  <article>
    {props.results.map((result, i) => (
      <Chain key={i} result={result} />
    ))}
  </article>
);
