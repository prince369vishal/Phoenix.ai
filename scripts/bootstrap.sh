#!/usr/bin/env bash
# Bootstraps a fresh clone of the repo for local development.
set -euo pipefail

command -v pnpm >/dev/null 2>&1 || { echo "pnpm is required. Install: corepack enable"; exit 1; }

pnpm install
pnpm build

echo
echo "Bootstrap complete. Try:"
echo "  pnpm dev        # run apps/api and apps/web in watch mode"
echo "  pnpm test       # run all package test suites"
echo "  pnpm lint        # lint all packages"
