import { Card, SymbolType } from "./card.ts";
import { getPossibilities } from "./game.ts";
import { Strategy } from "./strategy.ts";

export class Player {
  handCards: Card[];
  private _strategy: Strategy;
  private _name: string;

  constructor(handCards: Card[], strategy: Strategy, name: string) {
    this.handCards = handCards;
    this._strategy = strategy;
    this._name = name;
  }

  receive(card: Card) {
    this.handCards.push(card);
  }

  toString() {
    return `${this._name}`;
  }

  decide(topCard: Card, playedCards: Card[], plusTwoCount: number) {
    const handCardCopy = structuredClone(this.handCards) as Card[];
    const decision = this._strategy.decide(
      topCard,
      playedCards,
      handCardCopy,
      plusTwoCount,
    );

    if (decision === undefined) {
      return undefined;
    }

    if (
      !getPossibilities(topCard, handCardCopy, plusTwoCount).find((
        possibility,
      ) =>
        possibility.color === decision.color &&
        possibility.symbol === decision.symbol
      )
    ) {
      throw new Error("Strategy decided on impossible card.");
    }

    if ((["+4", "wish"] as SymbolType[]).includes(decision.symbol)) {
      if (!decision.wish) {
        throw new Error("Strategy did not decide on a wish.");
      }
    }
    if (
      handCardCopy.filter((handCard) =>
        handCard.color === decision.color && handCard.symbol === decision.symbol
      ).length === 0
    ) {
      throw new Error("Strategy resolved to unexpected card.");
    }
    const removeIndex = this.handCards.findIndex((handCard) =>
      handCard.color === decision.color && handCard.symbol === decision.symbol
    );
    const decisionRef = this.handCards.splice(removeIndex, 1)[0];
    decisionRef.wish = decision.wish;
    return decisionRef;
  }
}
