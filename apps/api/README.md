# @phoenix-ai/api

Backend API serving the OKF knowledge bundle, drift reports, and the human review/correction
workflow to `apps/web`. Built on Fastify.

## Scaffold status

Only a `/health` route exists today. Wire up real endpoints against
`@phoenix-ai/knowledge-graph`, `@phoenix-ai/okf-renderers`, and `@phoenix-ai/review-loop` per the FRD's
Interface Requirements (§5).
