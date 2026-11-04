# Security and data handling

## Current service model

The API supports an optional bearer token for local development. The supplied Dockerfile runs in production mode and refuses to start unless `STEMPROOF_API_TOKEN` contains at least 32 characters. All API routes except `GET /api/health` require the exact bearer token when configured. Production OpenAPI and interactive documentation routes are disabled.

The audit workspace accepts the operator-issued token in its access-key field. It is held in browser session storage for the current tab and sent in the Authorization header. Do not embed the token in site configuration, source files, URLs, or public documentation. Rotate the token by changing the backend environment variable and restarting the service.

This is a shared operator key, not individual authentication. It provides no tenant isolation, per-user permissions, account recovery, or customer-specific access boundary. Do not distribute it to customers or expose the authenticated workspace as a public customer portal.

Audit files are persisted as JSON under `STEMPROOF_DATA_DIR`. Writes use temporary files and atomic replacement. An authenticated delete endpoint removes an audit file from the active data directory. This does not erase backups or establish a complete retention policy.

## Before confidential customer use

- Replace shared-key access with individual identities and strong authentication.
- Implement tenant isolation and verify cross-tenant access with automated tests.
- Add role-based authorization and immutable reviewer/audit event history.
- Move from JSON files to a managed database with encryption and backup controls.
- Define retention schedules and deletion procedures for primary data and backups.
- Enforce request-size limits, rate limits, upload quotas and abuse monitoring at edge and origin.
- Restrict direct backend access where practical; keep HTTPS enabled.
- Keep persistent storage and backups private.
- Do not log uploaded question-bank contents or personal data.
- Define a data-processing agreement, incident-response process and support procedure.
- Keep secrets out of source control and rotate them when exposure is suspected.

## Demonstration guidance

Until those controls exist, use synthetic, public-domain or properly redacted sample questions only. The sample question bank in this repository is synthetic demonstration data. Do not upload confidential assessment banks, student records, personally identifiable information or unreleased exam material.

## Reporting

Report suspected vulnerabilities privately to the repository owner. Do not publish customer data or exploit details in public issues.
