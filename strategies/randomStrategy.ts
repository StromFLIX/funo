import { Card, SpecialSymbols, Colors } from "../card.ts";
import { getPossibilities } from "../game.ts";
import { Strategy } from "../strategy.ts";
import { pickRandom } from "../utils.ts";
import { Names } from "./names.ts";

export class RandomStrategy extends Strategy {
  readonly strategyName = Names.random;

  decide(
    topCard: Card,
    _playedCards: Card[],
    handCards: Card[],
    plusTwoCount: number,
    _playersCardCount: { amount: number; name: string }[],
  ): Card | undefined {
    const decision = pickRandom(
      getPossibilities(topCard, handCards, plusTwoCount),
    );
    if (decision === undefined) {
      return undefined;
    }
    if (
      decision.symbol === SpecialSymbols.plusFour ||
      decision.symbol === SpecialSymbols.wish
    ) {
      const pick = pickRandom(Object.values(Colors));
      decision.wish = pick ?? null;
    }
    return decision;
  }
}
