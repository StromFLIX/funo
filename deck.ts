import { Card, Colors, ColorsWithSpecial, SpecialSymbols } from "./card.ts";
import { times, shuffle } from "./utils.ts";

export class Deck {
  private _unusedDeck: Card[];
  usedDeck: Card[];
  topCard: Card | null;

  constructor() {
    this._unusedDeck = this._createDeck();
    this.usedDeck = [];
    this.topCard = null;
  }

  toString() {
    return `The current card on top is: ${
      this.topCard?.toString()
    }, the deck has ${this._unusedDeck.length} cards.`;
  }

  public initialize(): void {
    this._shuffle();
    const indexTopCardPrototype = this._unusedDeck.findIndex((unusedCard) =>
      unusedCard.color !== ColorsWithSpecial.special
    );
    this.topCard = this._unusedDeck.splice(indexTopCardPrototype, 1)[0];
  }

  public discard(discardee: Card): void {
    if (this.topCard === null) {
      throw new Error("Deck not initalized.");
    }
    this.topCard.wish = null;
    this.usedDeck.push(this.topCard);
    this.topCard = discardee;
  }

  public take(): Card {
    if (this._unusedDeck.length === 0) {
      if (this.usedDeck.length === 0) {
        throw new Error("All cards on hand.");
      }
      this._unusedDeck = this.usedDeck;
      this._shuffle();
    }
    const takenCard = this._unusedDeck.pop();
    if (takenCard != undefined) {
      return takenCard;
    } else {
      throw new Error("No cards available to take.");
    }
  }

  private _shuffle(): void {
    this._unusedDeck = shuffle(this._unusedDeck)
  }

  private _createDeck(): Card[] {
    const constructedDeck: Array<Card> = [];
    for (let i = 0; i <= 12; i++) {
      Object.values(Colors).forEach((value) => {
        switch (i) {
          case 0:
            constructedDeck.push(new Card(value, i));
            break;
          case 10:
            constructedDeck.push(new Card(value, SpecialSymbols.skip));
            constructedDeck.push(new Card(value, SpecialSymbols.skip));
            break;
          case 11:
            constructedDeck.push(new Card(value, SpecialSymbols.reverse));
            constructedDeck.push(new Card(value, SpecialSymbols.reverse));
            break;
          case 12:
            constructedDeck.push(new Card(value, SpecialSymbols.plustwo));
            constructedDeck.push(new Card(value, SpecialSymbols.plustwo));
            break;
          default:
            constructedDeck.push(new Card(value, i));
            constructedDeck.push(new Card(value, i));
            break;
        }
      });
    }
    times(4, () => {
      constructedDeck.push(new Card(ColorsWithSpecial.special, SpecialSymbols.plusFour));
      constructedDeck.push(new Card(ColorsWithSpecial.special, SpecialSymbols.wish));
      constructedDeck.push(new Card(ColorsWithSpecial.special, SpecialSymbols.wish));
    });
    return constructedDeck;
  }
}
