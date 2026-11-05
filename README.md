# VESPER

**Explore without ceilings. Understand the connected. Build independently.**

Vesper is a nocturnal intellectual environment for independent learners. It helps people pursue questions across disciplines, build deep understanding, investigate evidence and create original work without grade-level or curriculum gates.

## Product experience

- **The Lair** — a persistent Batcave-inspired workspace designed around purposeful work, continuity and focus.
- **Echolocation** — capture a question, phenomenon or problem from any discipline or level.
- **Echo Trails** — record meaningful relationships across disciplines, with rationale and limits.
- **Flight Paths** — map concepts and prerequisites as editable routes, never compulsory curricula.
- **Mastery Studio** — build explanations, concepts and understanding checks.
- **Investigation Chamber** — separate hypotheses, observations, interpretations and limitations.
- **Laboratory** — explore mathematical models through interactive parameters.
- **Creation Workshop** — turn understanding into original work.
- **Research Archive** — preserve source provenance and critical annotations.
- **Field Notes** — record discoveries, changes in understanding and unresolved questions.
- **Knowledge Network** — visualise relationships represented by actual workspace records.
- **Recall Practice** — schedule deliberate reconstruction of important concepts.
- **Night Vision** — reduce interface noise and keep the active objective in view.

The product is organised around three outcomes: **Mastery, Projects and Research**. Learners can enter through questions, phenomena, disciplines or existing work, and move freely between exploration and structured investigations.

## Core engine

The browser application uses a typed TypeScript domain model and local-first workspace store.

- `core/types.ts` defines the domain records.
- `core/store.tsx` manages workspace state, migration, persistence and JSON import/export.
- `core/engine.ts` derives workspace signals and contextual next-step guidance.
- `core/knowledgeGraph.ts` constructs a typed graph from saved records and their explicit relationships.

ECHO currently runs as a deterministic, transparent local guidance engine. It reads the learner's workspace and suggests useful next steps. It is **not yet a connected generative AI service**, live research search, source verifier or remote learner model. The graph only draws relationships supported by saved records; it does not invent expert-validated links.

TypeScript is the right core language for this release: the engine is domain logic, state orchestration and graph construction, not a compute-heavy simulation runtime. A Rust/WebAssembly module should be introduced only when a measured numerical or simulation workload justifies the additional build and debugging complexity. The web experience remains React, HTML, CSS and JavaScript/TypeScript.

## Application routes

- `/` — public product website.
- `/workspace` — The Lair.
- `/workspace/questions/:id` — question workbench.
- `/workspace/connections` — Echo Trails.
- `/workspace/knowledge` — Knowledge Network.

The remaining workspace chambers are accessible through the navigation.

## Development

```bash
cd web
npm install
npm run dev
```

Run production checks and build:

```bash
npm run typecheck
npm run build
npm run preview
```

## Cloudflare Pages

- Root directory: `web`
- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

## Data, privacy and current limitations

Workspace records and the active Lair objective are stored in the current browser. This release does not include accounts, cross-device cloud sync, server-side learner profiles, collaboration, billing, a live AI tutor or live research verification. Clearing browser data can erase workspace records. Exported JSON backups are not encrypted; store them carefully.

Source annotations are learner-entered; Vesper does not verify publications. The Model Bench currently contains an illustrative damped-oscillator model, not a general-purpose simulation engine. Concept confidence and recall records are learner-managed signals, not certification or independent proof of mastery.
