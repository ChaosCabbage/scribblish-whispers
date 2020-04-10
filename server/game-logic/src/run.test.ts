import {
  runGame,
  Player,
  GameResult,
  DrawChallenge,
  Drawing,
  Caption,
  CaptionChallenge,
} from "./game";
import { delay } from "./delay";
import { randomInt } from "./randomInt";

class FakePlayer implements Player {
  constructor(public id: string) {}
  private responses = [
    "it's a monkfish",
    "a bloke with a flannel?",
    "i don't know",
    "hentai",
    "megaman",
  ];

  private log(message: string): void {
    console.log(
      `${new Date().toLocaleTimeString("en-GB")} | Player ${this.id} ${message}`
    );
  }

  private randomCaption(): string {
    return this.responses[randomInt(this.responses.length)];
  }

  async doCaptionChallenge(payload: CaptionChallenge): Promise<Caption> {
    this.log("is writing a caption");
    await delay(randomInt(9000));
    this.log("has finished the caption");
    return this.randomCaption();
  }

  async doDrawChallenge(payload: DrawChallenge): Promise<Drawing> {
    this.log(`is drawing "${payload.caption}"`);
    await delay(randomInt(15000));
    this.log("has finished the drawing");
    return "type:png;balalalalalalah";
  }

  async viewResults(payload: GameResult): Promise<void> {
    this.log("got the results");
  }
}

const players = [
  "Bob",
  "Allyob",
  "Brendob",
  "Javiob",
  "Bangreeta",
  "Himjaloo",
  "Mancrab",
].map((name) => new FakePlayer(name));

const captionPool = [
  "A picture of no tomatoes",
  "Chewing gum stuck to the bottom of a table",
  "A man playing an umbrella as if it was a guitar",
  "A spider from mars",
];

runGame(captionPool, players);
