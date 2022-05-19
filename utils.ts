export function times(times: number, fn: () => void) {
  Array(times).fill(null).forEach(() => {
    fn();
  });
}

export function pickRandom<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  return array[Math.floor(Math.random() * array.length)];
}

export type KeysOfUnion<T> = T extends T ? keyof T : never;

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [
      array[j],
      array[i],
    ];
  }
  return array;
}
