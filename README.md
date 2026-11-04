# VESPER

**A STEM-centred environment for interdisciplinary learning.**

Vesper helps learners connect STEM concepts with useful ideas from wider disciplines, then turn those connections into understanding, investigation, modelling and original work.

## Product architecture

- **Questions** — capture and refine the questions that drive learning.
- **Connections** — record meaningful relationships across disciplines, with relationship types, rationale and follow-up questions.
- **Learning paths** — map concepts, prerequisites and milestones.
- **Learning studio** — build explanations, notes and understanding checks.
- **Investigations** — separate hypotheses, observations, interpretations and limitations.
- **Model bench** — explore a live mathematical model through parameter controls.
- **Projects** — turn understanding into original work.
- **Resource library** — preserve source provenance and critical annotations.
- **Field journal** — record discoveries and changes in understanding.
- **Knowledge graph** — view the records that make up the learner's knowledge system.
- **Recall practice** — schedule deliberate reconstruction of important concepts.

The website and learner application are separate experiences in one React application: `/` is the public product website and `/workspace` is the learner environment.

## Technology

- React 18 + TypeScript
- Vite build system
- React Router
- Framer Motion for restrained interface transitions
- A typed TypeScript domain model and workspace store
- Browser-local persistence with import/export

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

## Data and product boundaries

Workspace records are stored in the current browser. There is no account service, cross-device cloud sync, server-side learner profile, AI tutor, live research verification, collaboration or billing in this release. Exported JSON backups are not encrypted. Clearing browser data can erase the workspace.

Connections and learning routes are learner-authored records, not expert-validated curricula. Source annotations are user-entered; Vesper does not verify publications. Model Bench currently contains an illustrative damped-oscillator model, not a general-purpose simulation engine. Recall records support learner-managed practice and do not certify mastery.
