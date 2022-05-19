import { Card } from "./card.ts";
import { Names } from "./strategies/names.ts";

export abstract class Strategy {
  abstract readonly strategyName: Names;

  abstract decide(
    topCard: Card,
    playedCards: Card[],
    handCards: Card[],
    plusTwoCount: number,
    playersCardCount: { amount: number; name: string }[],
  ): Card | undefined;
}
