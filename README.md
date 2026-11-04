# BATLAB

**Build. Apply. Test. A bat-guided STEM discovery environment.**

BATLAB is a learner-first environment for exploring mathematics, physics, chemistry, biology, computer science and engineering. The bat is a quiet companion and attention cue. It is not a chatbot that interrupts the learner.

The product is organised around a learning cycle:

**Discover → Understand → Attempt → Verify → Connect → Revisit**

The objective is not lesson completion. It is to help learners build connected understanding and demonstrate what they can do independently.

## Current learner experience

- **The Roost:** personal learning home with a next-step prompt, subject entry points and local activity summary.
- **Explore STEM:** searchable concept library across six STEM domains.
- **Focus Chamber:** one concept, explanation, key relationship, independent retrieval check and optional notebook save.
- **Knowledge Terrain:** navigable concept map with evidence states: not assessed, developing and demonstrated.
- **Discovery Lab:** interactive simple-pendulum model with adjustable length and gravitational acceleration, predicted period and observation notes.
- **Flight Records:** local history of attempts and successful checks, with JSON export.
- **Field Notebook:** learner-authored notes and experiment observations.
- **Environment settings:** optional bat cues, reduced motion and local-data controls.
- **Guest-first use:** no signup wall; learning activity is stored in browser local storage.

## Adaptive behaviour and honest boundaries

The current build has a deterministic, local learning-state foundation. It records attempts and successful checks, changes concept status and uses that state to inform the learner's next action. This is a functional starting point, not yet the full adaptive intelligence system described in the product vision.

The following are **not yet implemented** and must not be represented as live capabilities:

- prerequisite-aware diagnosis across the full STEM concept graph;
- misconception classification and confidence calibration;
- robust proof, diagram, code and open-response verification;
- long-term spaced retrieval and transfer measurement;
- aggregate learning-pattern analysis;
- server-side accounts, cloud sync, guardian controls or multi-user community;
- production membership billing and entitlements;
- a conversational AI tutor or a production-grade bat agent;
- a broad, independently reviewed curriculum or a validated learning-efficacy study.

The starter checks are narrow, authored exercises. A successful response is evidence for that task only, not a certificate of mastery or a validated measure of ability. The pendulum uses the small-angle ideal model and states its assumptions.

## Run locally

The learner experience is static and can run without a backend:

```bash
cd web
python -m http.server 8080
```

Open `http://localhost:8080`. The app uses hash-based navigation and browser local storage. No build step is required.

## Deploy

Deploy the `web/` directory as a static Cloudflare Pages project:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Root directory | `web` |
| Build command | None |
| Output directory | `.` |

The primary learner experience does not require the legacy FastAPI service. The existing assessment-verification API and its old STEMPROOF routes remain in the repository as legacy code, are not linked from BATLAB, and are not part of the learner product. Do not deploy or expose those routes as BATLAB capabilities.

## Data and privacy

The current learner app stores notes, attempts, completion flags and settings in the browser's local storage. It does not send learner activity to a server. Data can be exported as JSON or cleared in Settings. Clearing site data in the browser also removes local progress. There is no cloud backup in this build.

For use by minors, any future account, analytics, community, synchronisation or payment feature requires age-appropriate privacy design, data minimisation, guardian/consent review where required, secure access controls and clear retention/deletion rules. No camera, microphone or eye tracking is used.

## Engineering direction

The intended next architecture is a versioned STEM concept graph, a deterministic subject-specific verification library, an evidence-based route engine, a retention scheduler, a simulation registry and an optional secure sync service. AI may assist with explanations, but it must not be the sole authority for scientific correctness or mastery decisions.

The product should remain focused: the bat signals only when useful, the study environment stays quiet, and the learner remains in control.
