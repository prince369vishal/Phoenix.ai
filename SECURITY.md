# Security Policy

## Scope and sensitivity

This platform is designed to ingest source code, logs, tickets, and technical documentation from third-party systems under analysis — material that may contain secrets, PII, or PHI (see BRD §9, Constraints). Two rules are non-negotiable across every package:

1. **Redaction before storage or inference.** All ingested content passes through the `redaction-hardening` module before it is persisted or sent to any model. No package may bypass this layer.
2. **No side effects from untrusted content.** Extraction agents that read untrusted artifacts have no tools and no write access — they emit structured claims only (FRD §2.2). Only validated, reconciled claims may enter the knowledge graph.

## Supported versions

| Version             | Supported                 |
| ------------------- | ------------------------- |
| `main` (unreleased) | ✅                        |
| Tagged releases     | See release notes per tag |

## Reporting a vulnerability

Do not open a public GitHub issue for suspected security vulnerabilities. Instead, contact the maintainers listed in `.github/CODEOWNERS` directly, including:

- A description of the vulnerability and its potential impact
- Steps to reproduce
- Any relevant logs or proof-of-concept (redacted of any real customer/system data)

We aim to acknowledge reports within 2 business days and to provide a remediation timeline within 5 business days.

## Data handling constraints

- Never commit real ingested artifacts (source code, logs, tickets) from an analysed system into this repository. `data/` and `artifacts/` are git-ignored for this reason.
- Isolation environments (per system under analysis) must not share credentials, network access, or storage with this repository's CI/CD.
- Any new external dependency must be reviewed for supply-chain risk before being added to a package's `package.json`.
