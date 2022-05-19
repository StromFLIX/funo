import { Card, ColorsWithSpecial, Colors, SpecialSymbols } from "../card.ts";
import { getPossibilities } from "../game.ts";
import { Strategy } from "../strategy.ts";
import { Names } from "./names.ts";

export class ObviousStrategy extends Strategy {
  readonly strategyName = Names.obvious;

  decide(
    topCard: Card,
    _playedCards: Card[],
    handCards: Card[],
    plusTwoCount: number,
    _playersCardCount: { amount: number; name: string }[],
  ): Card | undefined {
    const possibilites = getPossibilities(topCard, handCards, plusTwoCount);

    const handCardCounts = handCards.reduce((acc, cur) => {
      const handCardCount = acc.find((handCardCount) =>
        handCardCount.color === cur.color
      );
      if (handCardCount === undefined) {
        return acc;
      }
      handCardCount.amount++;
      return acc;
    }, [
      { color: ColorsWithSpecial.special, amount: 0 },
      { color: ColorsWithSpecial.red, amount: 0 },
      { color: ColorsWithSpecial.green, amount: 0 },
      { color: ColorsWithSpecial.blue, amount: 0 },
      { color: ColorsWithSpecial.yellow, amount: 0 },
    ]).sort((a, b) => b.amount - a.amount);

    for (const handCardCount of handCardCounts) {
      const decision = possibilites.find((possibility) =>
        possibility.color === handCardCount.color
      );
      if (decision !== undefined) {
        if (
          decision.symbol === SpecialSymbols.plusFour ||
          decision.symbol === SpecialSymbols.wish
        ) {
          decision.wish = (handCardCounts[0].color === ColorsWithSpecial.special
            ? handCardCounts[1].color
            : handCardCounts[0].color) as Colors;
        }
        return decision;
      }
    }
    return undefined;
  }
}
