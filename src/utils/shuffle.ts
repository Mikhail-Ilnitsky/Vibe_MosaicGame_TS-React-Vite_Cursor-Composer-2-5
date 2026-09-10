export function shuffleBySwaps(order: number[], swapCount: number): number[] {
  const len = order.length;
  if (len < 2) return [...order];

  let result = [...order];
  let attempts = 0;

  do {
    result = [...order];
    for (let i = 0; i < swapCount; i++) {
      const a = Math.floor(Math.random() * len);
      let b = Math.floor(Math.random() * len);
      while (b === a) {
        b = Math.floor(Math.random() * len);
      }
      [result[a], result[b]] = [result[b], result[a]];
    }
    attempts++;
  } while (isSolved(result) && attempts < 20);

  return result;
}

export function isSolved(order: number[]): boolean {
  return order.every((tileId, index) => tileId === index);
}
