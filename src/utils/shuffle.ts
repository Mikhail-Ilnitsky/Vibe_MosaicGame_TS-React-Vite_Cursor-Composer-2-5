export function shuffleBySwaps(order: number[]): number[] {
  const len = order.length;
  if (len < 2) return [...order];

  let result = [...order];
  let attempts = 0;

  do {
    result = [...order];
    for (let i = 0; i < len; i++) {
      let j = Math.floor(Math.random() * len);
      while (j === i) {
        j = Math.floor(Math.random() * len);
      }
      [result[i], result[j]] = [result[j], result[i]];
    }
    attempts++;
  } while (isSolved(result) && attempts < 20);

  return result;
}

export function isSolved(order: number[]): boolean {
  return order.every((tileId, index) => tileId === index);
}
