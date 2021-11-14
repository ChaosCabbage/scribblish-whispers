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
            onChange={(e) => props.changeName(e.target.value)}
          />
        </li>
        {props.otherPlayers.map((player) => (
          <li key={player}>{player}</li>
        ))}
      </ul>
    </section>
    {props.youAreHost ? (
      <section>
        <button
          disabled={props.otherPlayers.length + 1 < props.minimumPlayers}
          onClick={props.beginGame}
        >
          Begin!
        </button>
      </section>
    ) : (
      <p>Wait for the host to start the game.</p>
    )}
  </article>
);
