import { describe, expect, it } from 'vitest';
import { mockProvider } from '../src/data/mock/mockProvider.js';

describe('mockProvider', () => {
  it('returns a system summary with sane values', async () => {
    const summary = await mockProvider.getSystemSummary();
    expect(summary.id).toBe('aurora-commerce');
    expect(summary.coverageScore).toBeGreaterThan(0);
    expect(summary.coverageScore).toBeLessThanOrEqual(1);
  });

  it('returns context and container architecture views', async () => {
    const context = await mockProvider.getArchitecture('context');
    const container = await mockProvider.getArchitecture('container');
    expect(context.nodes.length).toBeGreaterThan(0);
    expect(container.nodes.length).toBeGreaterThan(0);
    // every edge must reference nodes that actually exist in the same view
    const contextIds = new Set(context.nodes.map((n) => n.id));
    for (const edge of context.edges) {
      expect(contextIds.has(edge.source)).toBe(true);
      expect(contextIds.has(edge.target)).toBe(true);
    }
  });

  it('returns domains with at least one aggregate each', async () => {
    const domains = await mockProvider.getDomains();
    expect(domains.length).toBeGreaterThan(0);
    for (const domain of domains) {
      expect(domain.aggregates.length).toBeGreaterThan(0);
    }
  });

  it('returns execution flows whose steps all carry provenance', async () => {
    const flows = await mockProvider.getExecutionFlows();
    expect(flows.length).toBeGreaterThan(0);
    for (const flow of flows) {
      for (const step of flow.steps) {
        expect(step.metadata.provenance.length).toBeGreaterThan(0);
      }
    }
  });

  it('returns review items including at least one conflict', async () => {
    const items = await mockProvider.getReviewItems();
    expect(items.some((i) => i.conflict && i.conflict.length > 0)).toBe(true);
  });
});
