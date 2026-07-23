import type { GraphEdge, GraphNode } from '../types.js';
import { containerEdges, containerNodes, domains, executionFlows, systemSummary } from './fixtures.js';
import { personas, journeys } from './personas.js';
import { epics } from './epics.js';

/**
 * Derives one big node/edge list spanning containers, domains, personas,
 * journeys, flows, and the product backlog — for the graph explorer view.
 * Deliberately built from the *same* fixture data every other page reads,
 * rather than a separate hand-authored dataset, so the explorer can never
 * drift out of sync with what the rest of the demo shows.
 */
function buildFullGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  nodes.push({ id: systemSummary.id, label: systemSummary.name, kind: 'System', confidenceLevel: 'high' });

  for (const c of containerNodes) {
    nodes.push({ id: c.id, label: c.name, kind: 'Container', confidenceLevel: c.metadata.confidence.level });
    edges.push({ id: `sys-${c.id}`, source: systemSummary.id, target: c.id, label: 'contains' });
  }
  for (const e of containerEdges) {
    edges.push({ id: e.id, source: e.source, target: e.target, label: e.label });
  }

  for (const d of domains) {
    nodes.push({ id: d.id, label: d.name, kind: 'Domain', confidenceLevel: d.metadata.confidence.level });
    for (const a of d.aggregates) {
      nodes.push({ id: a.id, label: a.name, kind: 'Aggregate', confidenceLevel: a.metadata.confidence.level });
      edges.push({ id: `${d.id}-${a.id}`, source: d.id, target: a.id, label: 'has' });
    }
  }

  for (const p of personas) {
    nodes.push({ id: p.id, label: p.name, kind: 'Persona', confidenceLevel: p.metadata.confidence.level });
  }
  for (const j of journeys) {
    nodes.push({ id: j.id, label: j.name, kind: 'Journey', confidenceLevel: j.metadata.confidence.level });
    edges.push({ id: `${j.personaId}-${j.id}`, source: j.personaId, target: j.id, label: 'experiences' });
    for (const flowId of j.flowIds) {
      const flow = executionFlows.find((f) => f.id === flowId);
      if (flow) {
        edges.push({ id: `${j.id}-${flowId}`, source: j.id, target: flowId, label: 'realised by' });
      }
    }
  }
  for (const f of executionFlows) {
    nodes.push({ id: f.id, label: f.name, kind: 'Flow', confidenceLevel: f.metadata.confidence.level });
  }

  for (const e of epics) {
    nodes.push({ id: e.id, label: e.name, kind: 'Epic', confidenceLevel: e.metadata.confidence.level });
    for (const feature of e.features) {
      nodes.push({ id: feature.id, label: feature.name, kind: 'Feature', confidenceLevel: feature.metadata.confidence.level });
      edges.push({ id: `${e.id}-${feature.id}`, source: e.id, target: feature.id, label: 'contains' });
      for (const story of feature.stories) {
        nodes.push({ id: story.id, label: story.title, kind: 'Story', confidenceLevel: story.metadata.confidence.level });
        edges.push({ id: `${feature.id}-${story.id}`, source: feature.id, target: story.id, label: 'contains' });
      }
    }
  }

  return { nodes, edges };
}

export const fullGraph = buildFullGraph();
