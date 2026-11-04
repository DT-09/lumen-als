# BATLAB — Product and Experience Architecture

## Product definition

**BATLAB is a bat-guided STEM exploration and learning environment.**

- **Build:** form a mental, visual or mathematical model.
- **Apply:** manipulate a model, solve a problem or connect ideas to a system.
- **Test:** retrieve knowledge independently and reflect on the evidence.

The bat is an attention guide. It is brief, dismissible and quiet during focus. It is not a reward machine or a chatbot that competes with the task.

## Experience map

| Environment | Purpose | Implemented interaction |
|---|---|---|
| The Roost | Personal home | Goal, route recommendation, subject entry points and local activity |
| Explore STEM | Discovery | Search and browse six STEM domains |
| Focus Chamber | Concentrated study | Explanation, key relation, confidence selection, authored retrieval task |
| Knowledge Terrain | Concept relationships | Starter prerequisite graph, evidence state and cross-domain bridges |
| Discovery Lab | Scientific investigation | Six interactive models across the STEM domains |
| Echo Intelligence | Adaptive reflection | Local evidence summary, uncertainty and recommendation rationale |
| Revisit Queue | Retrieval practice | Due and upcoming local revisit prompts |
| Flight Records | Learning evidence | Attempts, outcomes and JSON export |
| Field Notebook | Learner-owned thinking | Create, inspect and delete notes |
| Settings | Environment control | Bat cues, reduced motion, session goal, export and clear local data |

## BAT attention design

Signals are short, contextual and dismissible:
- Orient — establish the current objective.
- Focus — keep attention on the current model or task.
- Predict — anticipate an outcome before changing a variable.
- Connect — relate the concept to another idea.
- Retrieve — recall before rereading.
- Reflect — inspect the reasoning behind an answer.

Focus mode hides the navigation rail. Audio is off. Reduced-motion preference is respected. There is no camera, microphone, eye tracking, public weakness ranking or streak pressure.

## Learning Flight Engine

Current local inputs:
- selected session goal;
- last explored concept;
- authored prerequisite relationships;
- task attempts and successful checks;
- optional self-reported confidence;
- due revisit timestamps.

Current outputs:
- next concept suggestion;
- prerequisite suggestion after an unsuccessful attempt;
- a short rationale shown to the learner;
- a two-day revisit prompt after a successful check.

The route is deterministic and explainable. Learners can skip it and choose any concept. This is not a comprehensive adaptive intelligence engine.

## Echo Intelligence

Echo must distinguish evidence from inference. Current Echo reports attempts, task outcomes, confidence when supplied, and prerequisite relationships. It does not infer a psychological profile or claim to identify a misconception from one answer. It can state that evidence is insufficient.

Future diagnosis categories may include:
- concept gap;
- prerequisite gap;
- reasoning gap;
- calculation or transcription error;
- incomplete evidence;
- insufficient evidence.

These categories require subject-specific evidence and validation before being presented as reliable diagnoses.

## Verification and simulations

Current concept checks use authored expected answers and simple string matching. They are intentionally narrow. They do not verify full working, proofs, diagrams, code or open responses.

Current Discovery Lab models:
1. Linear function explorer — slope, intercept and input-output behaviour.
2. Simple pendulum — period from length and gravitational acceleration using the small-angle ideal model.
3. Atomic shell explorer — simplified electron-shell visualisation for the first 20 elements; not a quantum orbital model.
4. Cell structure explorer — schematic eukaryotic animal cell; not to scale.
5. Insertion-sort visualiser — stepwise comparison and movement in a small list.
6. Ohm's-law workbench — ideal resistor relationship at constant resistance.

These are teaching models, not research-grade simulations. Assumptions and limitations must remain visible.

## Concept graph

The starter graph contains 18 concepts across six domains and a small set of authored prerequisite edges. It is not a complete curriculum. A production graph needs:
- stable concept identifiers and content versions;
- learning objectives and age/level metadata;
- prerequisite and cross-disciplinary edges with rationale;
- misconception catalogue with evidence requirements;
- explanation variants and worked examples;
- task bank, verification method and evidence threshold;
- references, reviewer identity and review date.

## Data and privacy

The current build is guest-first and local-only. Browser storage contains activity, notes, confidence selections, settings and revisit timestamps. There is no server profile, sync, backup, community, analytics pipeline or billing.

A future multi-user system requires data minimisation, secure authentication, encryption, access controls, retention/deletion rules, age-appropriate privacy design and guardian/consent review where required. Community must be optional and moderated.

## Current implementation and release boundary

Implemented:
- BATLAB branded responsive website shell;
- six STEM subject areas and 18 starter concepts;
- searchable concept library and subject pages;
- focused concept experience and narrow independent checks;
- local activity state, confidence capture and explainable next-step suggestions;
- starter prerequisite map and cross-domain bridges;
- six interactive educational models;
- local revisit queue;
- notebook, flight records and JSON export;
- focus mode, bat cues, reduced motion, guest onboarding and local-data clearing.

Not implemented:
- comprehensive reviewed curriculum;
- robust reasoning, proof, diagram, code or open-response verification;
- validated misconception diagnosis, mastery or retention/transfer measurement;
- complete graph and adaptive route optimisation;
- AI tutor or production-grade autonomous companion;
- secure accounts, sync, backups, guardian controls or multi-user profiles;
- community, moderation, aggregate analytics or billing;
- accessibility audit, broad device/browser QA and validated learning outcomes.

## Acceptance principles

1. A learner can start without an account.
2. Every visible control performs its stated action.
3. Local progress survives reload and can be exported or cleared.
4. Assessment outcomes explain their scope and limitations.
5. Unsupported work is not silently certified.
6. Every simulation states its assumptions and model boundaries.
7. Focus and reduced-motion settings work across the experience.
8. Mobile, keyboard and screen-reader journeys are tested.
9. No learning-efficacy, mastery, diagnosis or accuracy claims without evidence.
10. The bat supports attention; it never competes with learning.
