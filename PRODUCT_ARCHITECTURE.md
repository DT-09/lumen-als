# STEMPROOF product architecture

## Product objective

Provide an independent, inspectable verification layer for supported mathematics and physics assessment items. The first buyer profile is an assessment publisher or test-preparation provider maintaining a structured question bank.

## Verification flow

`Import → Normalize → Route → Verify → Record evidence → Human review → Export`

| Layer | Responsibility | Implementation |
|---|---|---|
| Import | Accept assessment bank | FastAPI CSV and JSON upload |
| Normalize | Parse required fields and nested values | Input normalization and schema checks |
| Route | Select a supported verification rule | Item type dispatch |
| Verify | Recompute answer or compare expressions | Restricted Python AST parser and SymPy; explicit physics equations |
| Evidence | Preserve inputs and result | Rule ID, inputs, computed value and answer comparison |
| Review | Record editorial disposition | Approve, reject, correct or defer |
| Export | Deliver an audit record | PDF, CSV and JSON |

## Request path

`Browser → Cloudflare Pages Function → FastAPI → JSON audit store`

The static frontend is served from `web/`. The Python service is a separate origin in hosted deployments. The Pages Function proxies same-origin `/api/*` requests to the configured HTTPS backend.

## Deliberate constraints

The engine is not a general exam solver. Unsupported items are sent to human review. A verified result is limited to its named rule; it does not prove clarity, uniqueness, pedagogical quality, syllabus alignment or psychometric validity. Authentication and tenant isolation are not implemented in this release.
