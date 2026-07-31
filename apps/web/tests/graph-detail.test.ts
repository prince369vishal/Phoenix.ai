import { describe, expect, it } from 'vitest';
import { mockProvider } from '../src/data/mock/mockProvider.js';

describe('graph node dossiers', () => {
  it('gives every node a detail payload with a summary and provenance', async () => {
    const { nodes } = await mockProvider.getFullGraph();
    expect(nodes.length).toBeGreaterThan(0);
    for (const node of nodes) {
      expect(node.detail, `${node.id} has no detail`).toBeDefined();
      expect(node.detail?.summary.trim().length).toBeGreaterThan(0);
      expect(node.detail?.attributes.length).toBeGreaterThan(0);
      expect(node.detail?.metadata.provenance.length).toBeGreaterThan(0);
      expect(node.detail?.route.startsWith('/')).toBe(true);
      expect(node.detail?.routeLabel.length).toBeGreaterThan(0);
    }
  });

  it('never emits an empty detail section', async () => {
    const { nodes } = await mockProvider.getFullGraph();
    for (const node of nodes) {
      for (const section of node.detail?.sections ?? []) {
        expect(section.items.length, `${node.id} → ${section.label}`).toBeGreaterThan(0);
      }
    }
  });

  it('keeps node confidence in sync with the dossier metadata', async () => {
    const { nodes } = await mockProvider.getFullGraph();
    for (const node of nodes) {
      if (node.id === 'aurora-commerce') continue; // synthesised root
      expect(node.detail?.metadata.confidence.level).toBe(node.confidenceLevel);
    }
  });

  it('resolves cross-references to items that really exist on other pages', async () => {
    const [{ nodes }, reviews, drift, gaps, nfrs, integrations, deployment] = await Promise.all([
      mockProvider.getFullGraph(),
      mockProvider.getReviewItems(),
      mockProvider.getDriftAlerts(),
      mockProvider.getGapItems(),
      mockProvider.getNonFunctionalRequirements(),
      mockProvider.getIntegrations(),
      mockProvider.getDeploymentTopology(),
    ]);

    const idsByKind: Record<string, Set<string>> = {
      review: new Set(reviews.map((r) => r.id)),
      drift: new Set(drift.map((d) => d.id)),
      gap: new Set(gaps.map((g) => g.id)),
      nfr: new Set(nfrs.map((n) => n.id)),
      integration: new Set(integrations.map((i) => i.id)),
      deployment: new Set(deployment.map((d) => d.id)),
    };

    let total = 0;
    for (const node of nodes) {
      for (const ref of node.detail?.crossRefs ?? []) {
        total += 1;
        expect(idsByKind[ref.kind]?.has(ref.id), `${node.id} → ${ref.kind}:${ref.id}`).toBe(true);
        expect(ref.detail.trim().length).toBeGreaterThan(0);
      }
    }
    expect(total).toBeGreaterThan(0);
  });

  it('links the disputed payments adapter to its open review item', async () => {
    const { nodes } = await mockProvider.getFullGraph();
    const payments = nodes.find((n) => n.id === 'ctr-payments');
    expect(payments?.detail?.crossRefs.some((r) => r.kind === 'review' && r.id === 'rev-1')).toBe(
      true,
    );
    expect(payments?.detail?.metadata.confidence.rationale).toContain('Java/Spring');
  });

  it('only draws edges between nodes that exist', async () => {
    const { nodes, edges } = await mockProvider.getFullGraph();
    const ids = new Set(nodes.map((n) => n.id));
    for (const edge of edges) {
      expect(ids.has(edge.source), `${edge.id} source`).toBe(true);
      expect(ids.has(edge.target), `${edge.id} target`).toBe(true);
    }
  });
});
