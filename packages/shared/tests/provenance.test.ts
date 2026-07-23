import { describe, expect, it } from 'vitest';
import type { GraphElementMetadata } from '../src/provenance.js';

describe('GraphElementMetadata', () => {
  it('accepts a well-formed provenance + confidence record', () => {
    const metadata: GraphElementMetadata = {
      provenance: [
        {
          sourceId: 'repo://example/src/main.ts',
          sourceType: 'source-code',
          derivedBy: 'extraction-engine',
          derivedAt: new Date().toISOString(),
        },
      ],
      confidence: { level: 'high', score: 0.95 },
    };

    expect(metadata.provenance).toHaveLength(1);
    expect(metadata.confidence.level).toBe('high');
  });
});
