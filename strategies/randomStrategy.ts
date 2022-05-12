import { Card, WishType } from "../card.ts";
import { getPossibilities } from "../game.ts";
import { Strategy } from "../strategy.ts";
import { pickRandom } from "../utils.ts";

export class RandomStrategy extends Strategy {
  decide(
    topCard: Card,
    _playedCards: Card[],
    handCards: Card[],
    plusTwoCount: number,
  ): Card | undefined {
    const decision = pickRandom(
      getPossibilities(topCard, handCards, plusTwoCount),
    );
    if (decision === undefined) {
      return undefined;
    }
    if (decision.symbol === "+4" || decision.symbol === "wish") {
      const pick = pickRandom(["red", "green", "blue", "yellow"] as WishType[]);
      decision.wish = pick ?? null;
    }
    return decision;
  }
}
