# PaceLab release manifest

## Release identity

- Product: PaceLab
- Canonical frontend: `web/index.html`
- Backend entry point: `app.py`
- Learning engine: `engine.py`
- Primary branch: `main`

## Included capabilities

- Source ingestion and locator preservation
- Deterministic BM25 retrieval with query coverage checks
- Evidence-linked tutor responses and unsupported-query refusal
- Source-derived practice with server-held answer keys
- Review scheduling and workspace-level progress counters
- Concept extraction and a navigable concept universe
- Restricted mathematical expression plotting
- Per-browser SQLite isolation for hosted deployments

## Known limitations

- Topic extraction and question generation are heuristic.
- Short-answer grading is based on keyword coverage, not semantic rubric evaluation.
- Mastery estimates are transparent statistical summaries, not validated learning measures.
- Review intervals are a simple schedule, not a validated forgetting model.
- The tutor retrieves indexed passages; it does not generate unrestricted answers.
- Browser workspaces are not user accounts and do not support recovery or cross-device sync.
- A successful CI run does not establish production availability or learning efficacy.

## Release gates

- [ ] Python test suite passes on the release commit.
- [ ] Retrieval evaluation passes on the release commit.
- [ ] Frontend JavaScript syntax check passes.
- [ ] Cloudflare Pages reaches the separately hosted API.
- [ ] Persistent storage survives backend restart.
- [ ] Two browser profiles receive isolated workspaces.
- [ ] Keyboard, reduced-motion and mobile checks pass.
