import { Game } from "../game.ts";
import { Names } from "../strategies/names.ts";



const results : Record<Names | "failed", number> = {
    [Names.obvious]: 0,
    [Names.random]: 0,
    "failed": 0
}

for (let i = 0; i < 10000; i++) {
    const game = new Game([{strategyName: Names.obvious, players: 2},{strategyName: Names.random, players: 2}], 12);
    results[game.run(10000)]++;
}

console.log(results)