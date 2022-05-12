import { Card } from "./card.ts";

export abstract class Strategy {
  abstract decide(
    topCard: Card,
    playedCards: Card[],
    handCards: Card[],
    plusTwoCount: number,
  ): Card | undefined;
}
