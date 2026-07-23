# Changelog

All notable changes to this project will be documented in this file. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versioning follows [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Initial corporate-grade repository scaffold: pnpm/Turborepo monorepo, one package per FRD pipeline module (`ingestion-connectors`, `redaction-hardening`, `extraction-engine`, `inference-engine`, `knowledge-graph`, `reconciliation-engine`, `okf-renderers`, `gap-analysis`, `drift-detection`, `review-loop`, `evaluation-harness`, `orchestration`, `shared`), `apps/api` and `apps/web` stubs.
- Governance docs (CONTRIBUTING, CODE_OF_CONDUCT, SECURITY), CI workflows, issue/PR templates, ADR template.
- Requirements documents (BRD, PRD, FRD) relocated to `docs/requirements/`.
