declare module "@scrawl.io/game-messages" {
  export type UserID = string;
  export type DataURL = string;
  export type Drawing = DataURL;
  export type Caption = string;

  export interface Authored<T> {
    author: UserID;
    content: T;
  }

  export interface DrawChallenge {
    from: UserID;
    caption: string;
  }

  export interface CaptionChallenge {
    from: UserID;
    drawing: Drawing;
  }

  export interface GameChain {
    original: Caption;
    results: Array<[Authored<Drawing>, Authored<Caption>]>;
  }

  export interface GameResult {
    results: GameChain[];
  }
}
