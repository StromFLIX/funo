import { Card, ColorType } from "./card.ts";
import { times } from "./utils.ts";

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
      unusedCard.color !== "special"
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
    for (let i = this._unusedDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this._unusedDeck[i], this._unusedDeck[j]] = [
        this._unusedDeck[j],
        this._unusedDeck[i],
      ];
    }
  }

  private _createDeck(): Card[] {
    const constructedDeck: Array<Card> = [];
    for (let i = 0; i <= 12; i++) {
      (["red", "green", "blue", "yellow"] as ColorType[]).forEach((value) => {
        switch (i) {
          case 0:
            constructedDeck.push(new Card(value, i));
            break;
          case 10:
            constructedDeck.push(new Card(value, "skip"));
            constructedDeck.push(new Card(value, "skip"));
            break;
          case 11:
            constructedDeck.push(new Card(value, "reverse"));
            constructedDeck.push(new Card(value, "reverse"));
            break;
          case 12:
            constructedDeck.push(new Card(value, "+2"));
            constructedDeck.push(new Card(value, "+2"));
            break;
          default:
            constructedDeck.push(new Card(value, i));
            constructedDeck.push(new Card(value, i));
            break;
        }
      });
    }
    times(4, () => {
      constructedDeck.push(new Card("special", "+4"));
      constructedDeck.push(new Card("special", "wish"));
      constructedDeck.push(new Card("special", "wish"));
    });
    return constructedDeck;
  }
}
