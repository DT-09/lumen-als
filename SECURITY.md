# Security and data handling

## Current service model

STEMPROOF accepts structured question banks and persists audit records as JSON files under `STEMPROOF_DATA_DIR`. The current release has no user authentication, tenant isolation, account recovery, audit deletion endpoint or role-based access control. Anyone who can reach the API can create and retrieve audit records if they know the generated audit identifier.

This is not an acceptable boundary for confidential customer content.

## Before public customer use

- Put the API behind authentication and authorization.
- Implement tenant isolation and verify it with cross-tenant access tests.
- Add audit deletion, retention schedules and backup deletion procedures.
- Enforce request-size limits, rate limits and upload quotas at the edge and origin.
- Use HTTPS for the site and API.
- Restrict direct backend access where practical.
- Keep persistent storage and backups private.
- Do not log uploaded question-bank contents or personal data.
- Define a data-processing and incident-response procedure.
- Do not commit secrets, credentials or customer material.

## Demonstration guidance

Until those controls exist, use synthetic, public-domain or properly redacted sample questions only. The sample question bank in this repository is synthetic demonstration data.

## Reporting

Report suspected vulnerabilities privately to the repository owner. Do not publish customer data or exploit details in public issues.
