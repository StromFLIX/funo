export enum Colors {
  red = "RED",
  green = "GREEN",
  blue = "BLUE",
  yellow = "YELLOW",
}

export enum Special {
  special = "SPECIAL"
} 

export const ColorsWithSpecial = {...Special, ...Colors} 
export type ColorsWithSpecial = Special | Colors

export enum SpecialSymbols {
  reverse = "REVERSE",
  plustwo = "+2",
  skip = "SKIP",
  wish = "WISH",
  plusFour = "+4",
}
export type Symbols = number | SpecialSymbols;

export class Card {
  color: ColorsWithSpecial;
  symbol: Symbols;
  wish: Colors | null;

  constructor(color: ColorsWithSpecial, symbol: Symbols) {
    this.color = color;
    this.symbol = symbol;
    this.wish = null;
  }

  toString() {
    return `${this.color}, ${this.symbol}` +
      (this.wish ? ` Wish: ${this.wish}` : "");
  }
}
