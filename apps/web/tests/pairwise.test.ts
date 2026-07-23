import { describe, expect, it } from 'vitest';
import { pairwise } from '../src/lib/pairwise.js';

describe('pairwise', () => {
  it('returns consecutive pairs', () => {
    expect(pairwise([1, 2, 3])).toEqual([
      [1, 2],
      [2, 3],
    ]);
  });

  it('returns an empty array for 0 or 1 items', () => {
    expect(pairwise([])).toEqual([]);
    expect(pairwise([1])).toEqual([]);
  });
});
