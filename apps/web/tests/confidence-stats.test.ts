import { describe, expect, it } from 'vitest';
import { computeConfidenceStats } from '../src/lib/confidence-stats.js';
import type { GraphElementMetadata } from '../src/data/index.js';

function el(level: GraphElementMetadata['confidence']['level']): GraphElementMetadata {
  return { provenance: [], confidence: { level } };
}

describe('computeConfidenceStats', () => {
  it('counts elements per confidence level', () => {
    const stats = computeConfidenceStats([el('high'), el('high'), el('low'), el('inferred')]);
    const byLevel = Object.fromEntries(stats.map((s) => [s.level, s.count]));
    expect(byLevel.high).toBe(2);
    expect(byLevel.low).toBe(1);
    expect(byLevel.inferred).toBe(1);
    expect(byLevel.medium).toBe(0);
  });
});
