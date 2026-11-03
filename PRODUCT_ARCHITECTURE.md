# PaceLab product architecture

## Learning loop

`Collect → Connect → Understand → Retrieve → Review`

| Layer | Responsibility | Current implementation |
|---|---|---|
| Collect | Ingest learner-owned material | FastAPI upload routes; PDF, PPTX, DOCX, TXT, MD, SRT and VTT |
| Connect | Surface candidate concepts | Deterministic term extraction and explicit prerequisite patterns |
| Understand | Answer from indexed evidence | BM25 retrieval, query coverage threshold, source excerpts and locators |
| Retrieve | Test recall | Source-derived practice questions; answer keys remain server-side |
| Review | Revisit earlier questions | SQLite review queue with a simple interval ladder |
| Reflect | Show activity and estimates | Topic counters, attempt accuracy and approximate Beta summaries |

## Request path

`Browser → Cloudflare Pages Function → FastAPI → isolated SQLite workspace`

The frontend is static. The Python backend is a separate service. The Pages Function forwards API requests to the configured HTTPS origin.

## Deliberate constraints

PaceLab favours inspectable source evidence over unsupported answers. Heuristic concept extraction, grading and estimates are labelled as such. The system does not claim validated educational efficacy, semantic grading, a generative tutor or a full computer algebra system.
