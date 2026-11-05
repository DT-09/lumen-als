# VESPER

**Follow curiosity. Derive understanding.**

Vesper is an adaptive environment for independent discovery and interdisciplinary learning. A learner can begin with a question, a subject, or a challenge; form a hypothesis; learn the concepts needed to reason; research sources; test predictions; revise explanations; and derive a qualified answer.

It is not a fixed course catalogue or a conventional learning-management system. The learner controls the route. Vesper provides structure, curated foundations, transparent recommendations, and tools for investigation.

## The experience

- **The Roost** — active inquiries, learning activity, and a view of the learner's work.
- **Echolocation** — begin with a question, subject, or challenge from any discipline.
- **Flight Paths** — editable stages for framing, learning, hypothesising, investigating, adapting, and deriving.
- **Learn** — five curated interdisciplinary field guides, plus learner-authored concepts and explanations.
- **Investigate** — prediction and observation records, plus an interactive model bench for echo ranging, waveforms, and exponential sensitivity.
- **Research** — source annotations and a framework for evaluating authority, method, scope, inference, and corroboration.
- **Derive** — write an answer, connect evidence to claims, record limitations, and identify the next question.
- **Roost Network** — review concepts and disciplines recorded across inquiries.

The learning loop is intentionally non-linear. A learner can move between stages and add their own route steps.

## Adaptive behaviour

The first release uses a transparent, deterministic local rule engine. It recommends a next action based on the current inquiry state, such as forming a hypothesis, building conceptual foundations, gathering evidence, or synthesising a conclusion. Recommendations do not automatically redirect the learner or claim to evaluate scientific correctness.

## Content and research boundaries

The initial field guide includes authored material on:
- Echolocation and sound-based sensing
- Deterministic chaos and sensitivity
- Aerodynamic lift
- Rayleigh scattering and the blue sky
- Sound, harmonics, and timbre

Learners can add their own concepts, sources, observations, and explanations. Source records are learner-entered; Vesper does not currently browse the web, independently verify sources, generate open-ended research, or certify conclusions. The model bench contains simplified teaching models, not a general-purpose scientific simulator.

## Data and privacy

The new discovery workspace is stored locally in the browser under its own versioned storage key. Export/import backup is available in the top bar. The previous local workspace remains accessible at `/workspace`; its records are not overwritten by the new discovery workspace.

There is no account system, cloud sync, collaboration service, or server-side learner profile in this release.

## Technical architecture

- React + TypeScript + Vite
- React Router
- CSS design system and responsive layouts
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
