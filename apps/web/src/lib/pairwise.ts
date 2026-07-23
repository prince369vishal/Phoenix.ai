/**
 * Returns consecutive [prev, curr] pairs from an array. Exists so callers
 * don't need non-null assertions to satisfy noUncheckedIndexedAccess when
 * building "step N -> step N+1" edges.
 */
export function pairwise<T>(items: T[]): Array<[T, T]> {
  const pairs: Array<[T, T]> = [];
  for (let i = 1; i < items.length; i++) {
    const prev = items[i - 1];
    const curr = items[i];
    if (prev !== undefined && curr !== undefined) {
      pairs.push([prev, curr]);
    }
  }
  return pairs;
}
