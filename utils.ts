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
