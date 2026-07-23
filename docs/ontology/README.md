# Knowledge Graph Ontology

Reference documentation for the OKF knowledge graph ontology defined in the FRD (§4,
Data Requirements — Knowledge Graph Ontology). This is the schema that
`packages/knowledge-graph` implements and that every OKF renderer projects from.

## Node types (per FRD §4.1)

To be documented per node type: `System`, `Container`, `Component`, `Aggregate`, `Entity`,
`Screen`, `Flow`, `FlowStep`, `Interface`, `Integration`, `DataFlow`, `Epic`, `Feature`,
`Story`, `AcceptanceCriterion`, `Node` (deployment), `DeploymentUnit`, `Environment`,
`Journey`, `Persona`.

## Key relationships (per FRD §4.2)

- `Component` implements `Aggregate`; `Container` contains `Component`; `System` contains `Container`.
- `Screen` triggers `Flow`; `Flow` has `FlowStep`; `Flow` reads/writes `Entity`.
- `Integration` carries `DataFlow`; `Interface` exposes/consumes `DataFlow`.
- `Story` realizes `Feature`; `Feature` belongs to `Epic`; `Story` satisfies `AcceptanceCriterion`.
- `Container` deployedTo `Node`; `DeploymentUnit` runsIn `Environment`.
- `Flow` supports `Journey` (produces OKF output #11: flow-to-journey relationship).

## Element metadata (mandatory on every node/edge, per FRD §4.3)

Every node and edge carries `Provenance[]` and `Confidence` — see
`packages/shared/src/provenance.ts` for the canonical TypeScript types.

## Status

This is a reference stub. Expand with the full entity/relationship diagram and field-level
schema as `packages/knowledge-graph` is implemented.
