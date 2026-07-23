# @phoenix-ai/shared

Common types, logging, configuration, and utilities used across every pipeline package
(`ingestion-connectors` through `orchestration`). This is the only package every other
package may depend on directly — it must never depend back on a pipeline module.

## Contents

- `provenance.ts` — shared `Provenance` / `Confidence` types attached to every knowledge
  graph element (per FRD §4.3, Element Metadata).
- `logger.ts` — structured logging wrapper.
- `config.ts` — environment/config loading helper.

## Status

Scaffold only — implementation pending.
