import type { OkfDataProvider } from '../data/index.js';

export interface SearchEntry {
  id: string;
  label: string;
  kind: string;
  route: string;
}

/**
 * Builds a flat, client-side search index by calling every read method on
 * the active data provider once. Small enough dataset (a few hundred
 * entries at most) that no debouncing or server-side search is needed —
 * filtering happens in-memory as the user types.
 */
export async function buildSearchIndex(provider: OkfDataProvider): Promise<SearchEntry[]> {
  const [architecture, domains, flows, personas, journeys, epics, nfrs, integrations, gaps] =
    await Promise.all([
      provider.getArchitecture('container'),
      provider.getDomains(),
      provider.getExecutionFlows(),
      provider.getPersonas(),
      provider.getJourneys(),
      provider.getEpics(),
      provider.getNonFunctionalRequirements(),
      provider.getIntegrations(),
      provider.getGapItems(),
    ]);

  const entries: SearchEntry[] = [];

  for (const node of architecture.nodes) {
    entries.push({ id: node.id, label: node.name, kind: 'Container', route: '/architecture' });
  }
  for (const domain of domains) {
    entries.push({ id: domain.id, label: domain.name, kind: 'Domain', route: '/domains' });
    for (const agg of domain.aggregates) {
      entries.push({ id: agg.id, label: agg.name, kind: 'Aggregate', route: '/domains' });
    }
  }
  for (const flow of flows) {
    entries.push({
      id: flow.id,
      label: flow.name,
      kind: 'Execution Flow',
      route: `/flows?flow=${flow.id}`,
    });
  }
  for (const persona of personas) {
    entries.push({ id: persona.id, label: persona.name, kind: 'Persona', route: '/personas' });
  }
  for (const journey of journeys) {
    entries.push({ id: journey.id, label: journey.name, kind: 'Journey', route: '/personas' });
  }
  for (const epic of epics) {
    entries.push({ id: epic.id, label: epic.name, kind: 'Epic', route: '/backlog' });
    for (const feature of epic.features) {
      entries.push({ id: feature.id, label: feature.name, kind: 'Feature', route: '/backlog' });
    }
  }
  for (const nfr of nfrs) {
    entries.push({ id: nfr.id, label: nfr.requirement, kind: 'NFR', route: '/nfrs' });
  }
  for (const integration of integrations) {
    entries.push({
      id: integration.id,
      label: integration.name,
      kind: 'Integration',
      route: '/integrations',
    });
  }
  for (const gap of gaps) {
    entries.push({ id: gap.id, label: gap.area, kind: 'Gap', route: '/gaps' });
  }

  return entries;
}
