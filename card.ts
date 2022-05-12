export type ColorType = "special" | "red" | "green" | "blue" | "yellow";
export type SymbolType = number | ("reverse" | "+2" | "skip" | "wish" | "+4");
export type WishType = Exclude<ColorType, "special">;

export class Card {
  color: ColorType;
  symbol: SymbolType;
  wish: WishType | null;

  constructor(color: ColorType, symbol: SymbolType) {
    this.color = color;
    this.symbol = symbol;
    this.wish = null;
  }

  toString() {
    return `${this.color}, ${this.symbol}` +
      (this.wish ? ` Wish: ${this.wish}` : "");
  }
}
