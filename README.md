# VESPER

**Learn what is known. Investigate what is uncertain. Discover what follows.**

Vesper is an adaptive environment for independent discovery and interdisciplinary learning. A learner can begin with a question, a subject, or a challenge; form a hypothesis; learn the concepts needed to reason; research sources; test predictions; revise explanations; and derive a qualified answer.

It is not a fixed course catalogue or a conventional learning-management system. The learner controls the route. Vesper provides structure, curated foundations, transparent recommendations, and tools for investigation.

## The experience

- **The Lair** — the learner's home base: active inquiries, learning activity, and a view of ongoing work.
- **Echolocation** — begin with a question, subject, or challenge from any discipline.
- **Flight Paths** — editable stages for framing, learning, hypothesising, investigating, adapting, and deriving.
- **Learn** — a dedicated learning area with searchable lessons, explanations, worked examples, misconception checks, practical activities, short knowledge checks with explanatory feedback, lesson progress, and interactive models.
- **Inquiry-linked learning** — record concepts, explanations, and self-reported understanding inside each investigation.
- **Investigate** — prediction and observation records, plus an interactive model bench for echo ranging, waveforms, and exponential sensitivity.
- **Research** — source annotations and a framework for evaluating authority, method, scope, inference, and corroboration.
- **Derive** — write an answer, connect evidence to claims, record limitations, and identify the next question.
- **Roost Network** — review concepts and disciplines recorded across inquiries.
- **Learner Model** — a transparent profile derived from recorded interests, concepts, evidence, inquiry history, route decisions, and creations.

The nine-stage discovery framework is Wonder → Question → Hypothesise → Research → Learn → Investigate → Adapt → Derive → Extend. It describes the logic of inquiry, not a compulsory sequence. The learning loop is intentionally non-linear. A learner can move between stages and add their own route steps.

## Adaptive behaviour

The first release uses a transparent, deterministic local rule engine. It recommends a next action based on the current inquiry state, such as forming a hypothesis, building conceptual foundations, gathering evidence, or synthesising a conclusion. Recommendations do not automatically redirect the learner or claim to evaluate scientific correctness.

## Content and research boundaries

The initial lesson library includes authored material on:
- Echolocation and sound-based sensing
- Deterministic chaos and sensitivity
- Aerodynamic lift
- Rayleigh scattering and the blue sky
- Sound, harmonics, and timbre

Learners can add their own concepts, sources, observations, and explanations. Source records are learner-entered; Vesper does not currently browse the web, independently verify sources, generate open-ended research, or certify conclusions. The model bench contains simplified teaching models, not a general-purpose scientific simulator.

## Data and privacy

The discovery workspace and lesson-completion progress are stored locally in the browser. Inquiry records use their own versioned storage key; lesson progress uses a separate local key. Export/import backup is available in the top bar. The previous local workspace remains accessible at `/workspace`; its records are not overwritten by the new discovery workspace.

There is no account system, cloud sync, collaboration service, or server-side learner profile in this release.

## Visual identity

The interface uses a nocturnal editorial system: obsidian `#0B0D10`, graphite `#15191F`, slate `#202630`, warm ivory `#F0EBDD`, ash `#A7A99F`, champagne `#C8A96E`, twilight blue `#7189A8`, and sage `#829887`. Typography pairs DM Serif Display for editorial headings, Manrope for interface and reading text, and IBM Plex Mono for technical labels. The original bat emblem is a V-shaped SVG mark. Motion is restrained and respects reduced-motion preferences.

## Technical architecture

- React + TypeScript + Vite
- React Router
- CSS design system, responsive layouts, and reduced-motion support
- Deterministic client-side inquiry and recommendation logic
- Browser local storage for discovery records
- Cloudflare Pages deployment

Core files:
- `web/src/VesperApp.tsx` — new discovery experience
- `web/src/learning-library.ts` — curated teaching modules
- `web/src/ModelBench.tsx` — interactive scientific models
- `web/src/vesper-experience.css` — new visual system
- `web/src/App.tsx` — preserved previous workspace
- `web/src/core/` — previous workspace data and graph engine

## Development

```bash
cd web
npm ci
npm run typecheck
npm run build
npm run preview
```

GitHub Actions runs type-checking and a production build for changes under `web/`.

## Cloudflare Pages

- Repository: `DT-09/Vesper`
- Production branch: `main`
- Root directory: `web`
- Build command: `npm run build`
- Build output directory: `dist`
- Node.js: 20 or newer

A successful GitHub commit does not prove that Cloudflare has published it. Verify the production deployment and test the live routes after the build completes.
