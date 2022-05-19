import { Game } from "../game.ts";
import { Names } from "../strategies/names.ts";

const game = new Game([{ strategyName: Names.obvious, players: 2 }, {
  strategyName: Names.random,
  players: 2,
}], 12);
console.log(game.run());
