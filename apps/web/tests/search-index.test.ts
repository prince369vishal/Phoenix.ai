import { describe, expect, it } from 'vitest';
import { mockProvider } from '../src/data/mock/mockProvider.js';
import { buildSearchIndex } from '../src/lib/search-index.js';

describe('buildSearchIndex', () => {
  it('includes entries spanning multiple entity kinds', async () => {
    const index = await buildSearchIndex(mockProvider);
    const kinds = new Set(index.map((e) => e.kind));
    expect(kinds.has('Domain')).toBe(true);
    expect(kinds.has('Persona')).toBe(true);
    expect(kinds.has('Epic')).toBe(true);
    expect(index.length).toBeGreaterThan(10);
  });

  it('every entry has a non-empty route starting with /', async () => {
    const index = await buildSearchIndex(mockProvider);
    for (const entry of index) {
      expect(entry.route.startsWith('/')).toBe(true);
    }
  });
});
