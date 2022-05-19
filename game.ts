import { Card, ColorsWithSpecial, SpecialSymbols } from "./card.ts";
import { Player } from "./player.ts";
import { Deck } from "./deck.ts";
import { shuffle, times } from "./utils.ts";
import Mock from "https://deno.land/x/deno_mock@v2.0.0/mod.ts";
import { Strategies } from "./strategies/import.ts";
import { Names } from "./strategies/names.ts";

export function getPossibilities(
  topCard: Card,
  possibilities: Card[],
  plusTwoCount: number,
): Card[] {
  return possibilities.filter((possibility) => {
    return checkPossible(topCard, possibility, plusTwoCount);
  });
}

export function checkPossible(card: Card, option: Card, plusTwoCount: number) {
  if (card.color === ColorsWithSpecial.special) {
    return option.color === card.wish;
  } else {
    if (plusTwoCount) {
      return option.symbol === card.symbol;
    }
    return option.color === card.color || option.symbol === card.symbol ||
      option.color === ColorsWithSpecial.special;
  }
}

export class Game {
  players: Player[];
  deck: Deck;

  constructor(
    teams: { strategyName: Names; players: number }[],
    cards: number,
  ) {
    const playerAmount = teams.reduce((acc, cur) => acc + cur.players, 0);
    if (playerAmount < 2 || playerAmount > 10) {
      throw new Error("Players out of bounds.");
    }
    if (playerAmount * cards > 60 || cards < 6) {
      throw new Error("Cards out of bounds.");
    }
    this.deck = new Deck();
    this.deck.initialize();
    this.players = teams.flatMap((
      team,
    ) => (Array(team.players).fill(null).map(() => {
      const handCards = Array(cards).fill(null).map(() => this.deck.take());
      const strategy = Strategies.find((strategy) =>
        strategy.strategyName === team.strategyName
      );
      if (!strategy) {
        throw new Error(`Strategy ${team.strategyName} not found.`);
      }
      return new Player(
        handCards,
        strategy,
        (Mock.Random.name() as string).split(" ")[0],
      );
    })));
    this.players = shuffle(this.players);
  }

  run(timeout?: number): Names | "failed" {
    let newPlusFour = false;
    let plusTwoCount = 0;
    console.log(this.deck.toString());
    let rounds = 0;
    while (true) {
      rounds++;
      if (rounds > (timeout ?? Infinity)) {
        return "failed";
      }
      const currentPlayer = this.players.shift();
      if (currentPlayer === undefined) {
        throw new Error("No Player available.");
      }
      //console.log(`The current player is: ${currentPlayer.toString()}`)
      if (!this.deck.topCard) {
        throw new Error("Top Card is missing");
      }
      if (newPlusFour) {
        times(4, () => currentPlayer.receive(this.deck.take()));
        console.log(`${currentPlayer.toString()} must draw 4 cards.`);
        newPlusFour = false;
      }
      const playersCardCount = new Array(this.players.length).fill(0).map((
        _v,
        index,
      ) => {
        return {
          amount: this.players[index].handCards.length,
          name: this.players[index].toString(),
        };
      });

      const decision = currentPlayer.decide(
        this.deck.topCard,
        this.deck.usedDeck,
        plusTwoCount,
        playersCardCount,
      );
      if (decision === undefined) {
        console.log(`${currentPlayer.toString()} had no available cards.`);

        console.log(
          `${currentPlayer.toString()} must draw ${
            plusTwoCount > 0 ? 2 * plusTwoCount : 1
          } cards.`,
        );

        if (plusTwoCount > 0) {
          times(
            2 * plusTwoCount - 1,
            () => currentPlayer.receive(this.deck.take()),
          );
          plusTwoCount = 0;
        }
        currentPlayer.receive(this.deck.take());
        this.players.push(currentPlayer);
        continue;
      }

      console.log(
        `%c${currentPlayer.toString()} made the decision: ${decision.toString()}`,
        "font-weight: bold; color: " +
          (decision.color === ColorsWithSpecial.special
            ? "black;background-color: white "
            : decision.color.toLowerCase()),
      );

      if (currentPlayer.handCards.length === 0) {
        console.log(
          `Winner, winner, chicken dinner. ${currentPlayer.toString()}`,
        );
        return currentPlayer.strategy.strategyName;
      }
      this.deck.discard(decision);
      if (decision.symbol === "+4") {
        newPlusFour = true;
      }

      if (decision.symbol === "+2") {
        plusTwoCount++;
        this.players.push(currentPlayer);
        continue;
      }

      if (decision.symbol === SpecialSymbols.reverse) {
        this.players.reverse();
        this.players.push(currentPlayer);
        continue;
      }

      if (decision.symbol === SpecialSymbols.skip) {
        const nextPlayer = this.players.shift();
        if (nextPlayer === undefined) {
          throw new Error("No Player available.");
        }
        this.players.push(currentPlayer);
        this.players.push(nextPlayer);
        continue;
      }
      this.players.push(currentPlayer);
    }
  }
}
