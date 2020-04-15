import React from "react";

export interface LobbyProps {
  minimumPlayers: number;
  yourName: string;
  otherPlayers: string[];
  youAreHost: boolean;
  changeName(newName: string): void;
  beginGame(): void;
}

export const Lobby = (props: LobbyProps) => (
  <article>
    <section id="share">
      <p>
        Share the room link:
        <a href={window.location.toString()}>{window.location.toString()}</a>
      </p>
    </section>
    <section id="playerList">
      <ul>
        <li>
          <input
            type="text"
            defaultValue={props.yourName}
            onBlur={(e) => props.changeName(e.target.value)}
          />
        </li>
        {props.otherPlayers.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
    </section>
    <section>
      <button onClick={props.beginGame}>Begin!</button>
    </section>
  </article>
);
