# Requirements

Source-of-truth requirements documents for Phoenix.ai:

- **BRD.docx** — Business Requirements Document: business rationale, objectives, scope, KPIs.
- **PRD.docx** — Product Requirements Document: product vision, personas, epics, UX principles.
- **FRD.docx** — Functional Requirements Document: module-level functional specification, the
  knowledge graph ontology, and the traceability matrix.

These three documents form a single traceability chain (BRD → PRD → FRD). When implementing a
package under `packages/`, check the FRD module section first, then trace up to the PRD epic
and BRD requirement it satisfies.
