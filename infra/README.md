# Infra

Deployment infrastructure for the platform.

- `docker/` — Dockerfiles / compose files for local dev and CI.
- `k8s/` — Kubernetes manifests or Helm charts for the isolated execution environments the
  BRD requires (per-system isolation for regulated data — see BRD §9, Constraints, and
  SECURITY.md).

## Status

Placeholder — no manifests yet. Each per-system analysis environment must remain isolated
(no shared credentials/network/storage) per `SECURITY.md`.
