# STEMPROOF release manifest

## Release identity
- Product: STEMPROOF
- Static website: `web/index.html`
- API entry point: `app.py`
- Verification engine: `verifier.py`
- Report generator: `reports.py`
- Current version: `1.0.0`

## Included capabilities
- Multi-page product website: overview, platform, verification, workflows, benchmark, audit workspace, docs, pilot and evaluation brief.
- CSV and JSON question-bank ingestion.
- Restricted AST parser for supported mathematical expressions.
- Single-variable equation solving with complete solution-set comparison.
- Symbolic expression equivalence with variable-denominator domain review.
- Newton's second-law numerical checks.
- Selected constant-acceleration kinematics checks.
- Explicit verified, defect and needs-review outcomes.
- Duplicate item-ID detection.
- Evidence records and reviewer decisions.
- PDF, CSV and JSON exports.
- Sample question bank and automated tests.

## Known limitations
- No natural-language parsing of arbitrary questions.
- No diagram interpretation, proof checking, psychometric analysis or syllabus mapping.
- MCQ key checking is internal consistency only and remains a review item when fields agree.
- No authentication, tenant isolation, billing, audit deletion or production retention controls.
- JSON-file storage is a small-release persistence layer, not a production multi-tenant database.
- CI and unit tests do not establish customer value or educational efficacy.

## Release gates
- [ ] Python test suite passes on release commit.
- [ ] JavaScript syntax check passes.
- [ ] Identity and required-page checks pass.
- [ ] Live Pages and API integration smoke tests pass.
- [ ] Security and data-governance controls are added before confidential customer use.
