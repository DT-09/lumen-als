# VESPER

**Explore without ceilings. Understand the connected. Build independently.**

Vesper is a cross-disciplinary learning environment for autodidacts and independent learners. Start with a question, follow the foundations it needs, connect ideas across fields, investigate evidence, build models and create original work.

It is not a course catalogue or a conventional learning-management system. The core experience is a connected workspace for sustained intellectual work.

## The learning system

- **The Lair** — a focused home for current objectives, active questions and ongoing work.
- **Echolocation** — capture a question, phenomenon or problem from any discipline.
- **Flight Paths** — build editable routes through concepts and prerequisites without imposing a fixed curriculum.
- **Mastery Studio** — develop explanations, test understanding and track confidence.
- **Echo Trails** — examine relationships across disciplines, including where analogies stop being valid.
- **Investigation Chamber** — separate hypotheses, methods, observations, interpretations and limitations.
- **Laboratory** — explore mathematical models and inspect how parameters affect behaviour.
- **Creation Workshop** — turn understanding into projects and original work.
- **Research Archive** — preserve sources, provenance and critical annotations.
- **Field Notes and Recall Practice** — retain discoveries and deliberately reconstruct important ideas.
- **Knowledge Network** — visualise relationships represented by actual workspace records.

The three intended outcomes are **Mastery, Projects and Research**. Learners can move between them rather than being forced through a linear course.

## Technical architecture

The production website is the React, TypeScript and Vite application in `web/`.

- `web/src/core/types.ts` — typed domain model.
- `web/src/core/store.tsx` — local-first workspace state and persistence.
- `web/src/core/engine.ts` — deterministic workspace signals and contextual guidance.
- `web/src/core/knowledgeGraph.ts` — graph construction from explicit saved relationships.
- `web/src/App.tsx` — public website and workspace experience.
- `web/src/styles.css` — visual system and responsive interface.

TypeScript is appropriate for the current engine: its main work is domain modelling, state transitions and graph construction. Rust/WebAssembly is not warranted until profiling identifies a compute-heavy simulation workload.

## Honest capability boundary

The current release is local-first. Workspace records are stored in the browser; they are not synced to a server or shared across devices. ECHO is deterministic local guidance, not a connected generative AI tutor or live research agent. Source annotations are learner-entered and are not independently verified. The Knowledge Network visualises recorded relationships; it does not claim to infer authoritative scientific connections. The Laboratory currently contains a focused illustrative model, not a general-purpose simulation engine.

These limits are explicit product boundaries, not capabilities to imply in marketing.

## Development and validation

```bash
cd web
npm ci
npm run typecheck
npm run build
npm run preview
```

## Production deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md). Cloudflare Pages must use root directory `web`, build command `npm run build`, and output directory `dist`.
