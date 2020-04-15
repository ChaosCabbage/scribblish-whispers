import React from "react";
import { LobbyProps, Lobby } from "./Lobby";
import { DrawingChallengeProps, DrawingChallenge } from "./DrawingChallenge";
import { CaptionChallengeProps, CaptionChallenge } from "./CaptionChallenge";

export type GameProps =
  | {
      state: "lobby";
      lobby: LobbyProps;
    }
  | {
      state: "drawing";
      drawing: DrawingChallengeProps;
    }
  | {
      state: "caption";
      caption: CaptionChallengeProps;
    };

export type GameState = GameProps["state"];

export const Game = (props: GameProps) => {
  switch (props.state) {
    case "lobby":
      return <Lobby {...props.lobby} />;
    case "drawing":
      return <DrawingChallenge {...props.drawing} />;
    case "caption":
      return <CaptionChallenge {...props.caption} />;
  }
};
