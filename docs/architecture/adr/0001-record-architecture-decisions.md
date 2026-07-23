# ADR 0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-07-22
- **Owners:** Platform maintainers

## Context

The platform is built around a shared knowledge graph with strict trust boundaries between
untrusted-content readers and the graph itself (FRD §2.2). Decisions about the graph ontology,
module contracts, and trust boundaries are hard to reverse once other modules depend on them,
and need to be discoverable by future contributors.

## Decision

We will record architecturally significant decisions as Architecture Decision Records (ADRs)
in `docs/architecture/adr/`, using the template in `0000-template.md`, numbered sequentially.

## Consequences

Future contributors can see why a decision was made, not just what it is. PRs that make
architecturally significant changes should include a new ADR (see `CONTRIBUTING.md`).

## Alternatives considered

- No formal record (rejected — knowledge would live only in PR discussions and decay, which
  is exactly the failure mode this platform exists to solve for the systems it analyses).
