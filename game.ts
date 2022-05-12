import { Card } from "./card.ts";
import { Player } from "./player.ts";
import { Deck } from "./deck.ts";
import { RandomStrategy } from "./strategies/randomStrategy.ts";
import { times } from "./utils.ts";

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
  if (card.color === "special") {
    return option.color === card.wish;
  } else {
    if (plusTwoCount) {
      return option.symbol === card.symbol;
    }
    return option.color === card.color || option.symbol === card.symbol ||
      option.color === "special";
  }
}

export class Game {
  players: Player[];
  deck: Deck;

  constructor(players: number, cards: number) {
    if (players < 2 || players > 10) {
      throw new Error("Players out of bounds.");
    }
    if (players * cards > 60 || cards < 6) {
      throw new Error("Cards out of bounds.");
    }
    this.deck = new Deck();
    this.deck.initialize();
    this.players = Array(players).fill(null).map((_v, index) => {
      const handCards = Array(cards).fill(null).map(() => this.deck.take());
      return new Player(handCards, new RandomStrategy(), "Steve" + index);
    });
  }

  run() {
    let newPlusFour = false;
    let plusTwoCount = 0;
    while (true) {
      //console.log(this.deck.toString());
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
      const decision = currentPlayer.decide(
        this.deck.topCard,
        this.deck.usedDeck,
        plusTwoCount,
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
          (decision.color === "special"
            ? "black;background-color: white "
            : decision.color),
      );

      if (currentPlayer.handCards.length === 0) {
        console.log(
          `Winner, winner, chicken dinner. ${currentPlayer.toString()}`,
        );

        break;
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

      if (decision.symbol === "reverse") {
        this.players.reverse();
        this.players.push(currentPlayer);
        continue;
      }

      if (decision.symbol === "skip") {
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
