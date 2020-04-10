import { rotate } from "./rotate";
import { ensure } from "./ensure";
import { selectNDifferent } from "./selectNDifferent";
import {
  UserID,
  Caption,
  CaptionChallenge,
  Drawing,
  DrawChallenge,
  GameResult,
  GameChain,
  Authored,
} from "@scrawl.io/game-messages";

export interface Player {
  id: UserID;

  doCaptionChallenge(payload: CaptionChallenge): Promise<Caption>;

  doDrawChallenge(payload: DrawChallenge): Promise<Drawing>;

  viewResults(payload: GameResult): Promise<void>;
}

interface GameChainInProgress extends GameChain {
  players: Player[];
}

interface DrawingTurn {
  chain: GameChainInProgress;
  currentCaption: Authored<Caption>;
}

interface CaptionTurn {
  chain: GameChainInProgress;
  currentDrawing: Authored<Drawing>;
}

export const runGame = async (
  captionPool: readonly Caption[],
  players: readonly Player[]
) => {
  const starterCaptions = selectNDifferent(players.length, captionPool);

  const chains: GameChainInProgress[] = starterCaptions.map(
    (caption, index) => ({
      original: caption,
      results: [],
      players: rotate(index, players),
    })
  );

  chains.forEach((chain, i) => {
    console.log(
      `Chain #${i}: "${chain.original};\n      [${players
        .map((p) => p.id)
        .join(", ")}]`
    );
  });

  let firstTurns: DrawingTurn[] = chains.map((chain) => ({
    chain,
    currentCaption: { content: chain.original, author: "The game" },
  }));

  const rounds = Math.floor(players.length / 2);

  for (let round = 0; round < rounds; ++round) {
    console.log(`Round #${round}. Start drawing!`);

    const drawingsInProgress: Array<Promise<CaptionTurn>> = firstTurns.map(
      async (turn) => {
        const player = ensure(
          turn.chain.players.shift(),
          "Not enough players in the list"
        );
        const answer = await player.doDrawChallenge({
          caption: turn.currentCaption.content,
          from: turn.currentCaption.author,
        });

        return {
          chain: turn.chain,
          currentDrawing: {
            author: player.id,
            content: answer,
          },
        };
      }
    );

    console.log(`Awaiting ${drawingsInProgress.length} drawings`);
    const nextTurns = await Promise.all(drawingsInProgress);
    console.log(`We've got the drawings`);

    const captionsInProgress: Array<Promise<DrawingTurn>> = nextTurns.map(
      async (turn) => {
        const player = ensure(
          turn.chain.players.shift(),
          "Not enough players in the list"
        );
        const answer = await player.doCaptionChallenge({
          drawing: turn.currentDrawing.content,
          from: turn.currentDrawing.author,
        });

        return {
          chain: turn.chain,
          currentCaption: {
            author: player.id,
            content: answer,
          },
        };
      }
    );

    console.log(`Awaiting ${captionsInProgress.length} captions`);
    firstTurns = await Promise.all(captionsInProgress);
    console.log(`We've got the captions`);
  }

  const result: GameResult = {
    results: chains.map(({ original, results }) => ({ original, results })),
  };

  await Promise.all(players.map((player) => player.viewResults(result)));
};
