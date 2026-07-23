# Contributing

## Branching

- `main` is always releasable. Direct pushes are disabled; all changes land via pull request.
- Branch names: `feat/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`, `docs/<short-desc>`.
- Rebase onto `main` before opening a PR; keep history linear where practical.

## Commit conventions

This repo follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]
[optional footer(s)]
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `perf`, `ci`. Scope should be the package name (e.g. `feat(knowledge-graph): add provenance edge type`).

## Pull requests

1. Keep PRs scoped to a single concern; large module changes should reference the relevant PRD epic / FRD module in the description.
2. Every PR must pass CI: lint, typecheck, unit tests, and CodeQL.
3. New or changed functional behavior requires an update to the corresponding package `README.md` and, for cross-module contracts, a note in `docs/architecture/adr/`.
4. At least one CODEOWNER approval is required before merge (see `.github/CODEOWNERS`).
5. Squash-merge by default; keep the final commit message conventional-commit compliant.

## Adding a new pipeline module or package

```bash
mkdir -p packages/<name>/src packages/<name>/tests
```

Copy `package.json` / `tsconfig.json` structure from an existing package (e.g. `packages/shared`), register it in the root `pnpm-workspace.yaml` (already globbed via `packages/*`), and add a short module README describing its FRD traceability.

## Architecture decisions

Significant, hard-to-reverse decisions (data model changes, new trust boundaries, new external dependencies, changes to the OKF ontology) should be captured as an ADR in `docs/architecture/adr/` using the template in `0000-template.md`.

## Code style

Formatting and linting are enforced automatically via Husky + lint-staged on commit, and via CI on every PR. Run `pnpm format` and `pnpm lint:fix` locally before pushing to avoid churn.

## Reporting issues

Use the issue templates under `.github/ISSUE_TEMPLATE/`. For suspected vulnerabilities, do **not** open a public issue — follow [SECURITY.md](./SECURITY.md) instead.
