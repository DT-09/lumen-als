# VESPER — Product and Experience Architecture

## Product definition

**VESPER is a learner-first STEM learning observatory.** It is designed for curiosity with structure: open exploration, focused study, interactive models and evidence-aware routes.

The name evokes the first star at dusk: a point of orientation in a large field of possibilities. The bat remains the quiet nocturnal companion and attention guide, not the product's entire identity.

**Discover → Build a model → Apply → Test → Reflect → Revisit**

## Experience architecture

| Space | Purpose | Current interaction |
|---|---|---|
| Observatory | Personal home | Session intention, route suggestion, subject portals and local activity |
| Explore | Open discovery | Search and browse six STEM domains |
| Focus Studio | Concentrated learning | Explanation, key relation, confidence reflection and authored retrieval task |
| Concept Atlas | Knowledge structure | Starter prerequisite graph, evidence state and cross-domain bridges |
| Model Lab | Scientific investigation | Six interactive educational models |
| Learning Signals | Adaptive reflection | Local evidence summary, uncertainty and recommendation rationale |
| Recall Queue | Retrieval practice | Local due and upcoming revisit prompts |
| Flight Log | Learning evidence | Attempts, task outcomes and JSON export |
| Field Notes | Learner-owned thinking | Create, inspect and delete notes |
| Settings | Environment control | Bat cues, reduced motion, session goal, export and local-data clearing |

## Identity and interaction principles

- **Nocturnal observatory:** midnight ink, moonlit blue, warm star-metal and quiet ivory; avoid generic neon dashboards.
- **Clarity over spectacle:** visual atmosphere frames the work; it never obscures a concept, control or equation.
- **One meaningful objective:** focused study presents one concept and one task at a time.
- **Learner agency:** recommendations are explainable and optional; all subjects remain browsable.
- **Quiet companion:** bat cues are brief, conditional and dismissible; they become quiet in focus mode.
- **Accessible by default:** keyboard-visible focus, responsive layout and reduced-motion support; audio, camera, microphone and eye tracking are absent.
- **Evidence before claims:** task outcomes are scoped to the task; insufficient evidence is an acceptable state.

## Learning Flight Engine

Current local inputs:
- selected session intention;
- last explored concept;
- authored prerequisite relationships;
- task attempts and successful checks;
- optional self-reported confidence;
- due revisit timestamps.

Current outputs:
- next concept suggestion;
- prerequisite suggestion after an unsuccessful attempt;
- a short explanation of the route rationale;
- a two-day revisit prompt after a successful check.

The route is deterministic and explainable. It is not a comprehensive adaptive intelligence engine or a validated spaced-repetition system.

## Learning Signals

The system must distinguish observation from inference. Current signals report attempts, narrow task outcomes, confidence when supplied and authored prerequisite relationships. It does not infer psychological traits or diagnose misconceptions from one answer.

Future diagnosis categories may include concept gap, prerequisite gap, reasoning gap, calculation/transcription error, incomplete evidence and insufficient evidence. Each requires subject-specific evidence and validation before being presented as reliable.

## Model Lab

Current models:
1. Linear function explorer — slope, intercept and input-output behaviour.
2. Simple pendulum — ideal period from length and gravitational acceleration under the small-angle approximation.
3. Atomic shell explorer — simplified shell visualisation for the first 20 elements; not a quantum orbital model.
4. Cell structure explorer — schematic eukaryotic animal cell; not to scale.
5. Insertion-sort visualiser — stepwise comparison and movement in a small list.
6. Ohm's-law workbench — ideal resistor relationship at constant resistance.

These are teaching models, not research-grade simulations. Assumptions and limitations must remain visible.

## Concept graph and content quality

The starter graph contains 18 authored concepts across six domains and a small set of prerequisite edges. It is not a complete curriculum. A production graph needs stable concept identifiers and versions, learning objectives, level metadata, justified prerequisite and cross-disciplinary edges, misconception catalogues, explanation variants, worked examples, verification methods, evidence thresholds, references and reviewer records.

## Verification

Current checks use authored expected answers and narrow string matching. They do not verify proofs, full working, diagrams, code or open responses. Future verification should be subject-specific:
- deterministic numeric and symbolic checks with units and tolerances;
- dimensional analysis and constraint checks;
- rubrics and reviewer escalation for explanations and proofs;
- isolated execution for code;
- model-based checks for simulation predictions;
- explicit uncertainty when evidence is ambiguous.

AI may help explain or generate practice, but must not be the sole authority for correctness or mastery.

## Data and privacy

The current build is guest-first and local-only. Browser storage contains activity, notes, confidence selections, settings and revisit timestamps. There is no server profile, sync, backup, community, analytics pipeline or billing.

A future multi-user system requires data minimisation, secure authentication, encryption, access controls, retention/deletion rules, age-appropriate privacy design and guardian/consent review where required. Community must be optional and moderated.

## Production roadmap

1. **Content integrity:** expand and review the concept library; add citations, versioning, objectives and misconception-aware tasks.
2. **Learning evidence:** capture working and reasoning; implement deterministic subject-specific verification and honest uncertainty.
3. **Adaptive routes:** build a validated prerequisite graph, confidence calibration and evidence-based revisit scheduling.
4. **Model library:** add reviewed interactive models across all STEM domains with visible assumptions.
5. **Platform services:** design secure optional accounts, sync, backup, export/deletion and age-appropriate controls.
6. **Operational readiness:** accessibility audit, device/browser QA, security review, monitoring, recovery and learning-outcome evaluation.
7. **Community and commerce:** only after moderation, privacy, guardian and billing controls are designed and tested.

## Release boundary

Implemented now: VESPER-branded responsive website, six STEM domains, 18 starter concepts, searchable discovery, focused concept study, narrow checks, local evidence and recommendations, starter concept graph, six interactive models, recall queue, notebook, flight log, export, focus mode, bat cues and guest onboarding.

Not implemented: comprehensive reviewed curriculum, robust reasoning verification, validated mastery or retention/transfer measurement, complete graph optimisation, AI tutor, secure accounts/sync/backups, guardian controls, community/moderation, aggregate analytics or billing.

Do not market unimplemented capabilities as available.
