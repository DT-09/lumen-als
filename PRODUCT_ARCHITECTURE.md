# BATLAB — Product and Experience Architecture

## Product definition

**BATLAB is a focused STEM discovery environment.**

It combines a bat-inspired attention environment with a scientific laboratory experience. It is built around three actions:

- **B — Build a model:** form a mental and mathematical model of a concept.
- **A — Apply:** manipulate variables, solve problems and connect ideas to real systems.
- **T — Test:** retrieve knowledge, explain reasoning and apply it in a new context.

The bat is a quiet guide. It provides short, contextual cues; it is not a noisy chatbot or a reward machine.

## Learner promise

A learner should be able to enter without creating an account, choose a question, explore an explanation, manipulate a model, attempt a task, inspect the result, save their reasoning and return to the idea later.

The product should help learners move from passive familiarity to independent demonstration.

## Experience map

| Environment | Purpose | Core interaction |
|---|---|---|
| Roost | Personal home | Next useful action, recent work, subject entry points |
| Archives / Explore | Discovery | Search concepts and move between STEM domains |
| Focus Chamber | Concentrated study | One objective, one explanation, one task |
| Knowledge Terrain | Concept relationships | Navigate prerequisites and cross-subject bridges |
| Discovery Lab | Scientific investigation | Change parameters, predict and observe |
| Echo | Adaptive reflection | Explain the evidence behind a recommendation |
| Flight Records | Learning evidence | Inspect attempts and task-level outcomes |
| Field Notebook | Learner-owned thinking | Save notes, explanations and observations |

## BAT attention design

The bat companion is a visual attention guide. Its cues should be brief, contextual and dismissible.

| Cue | Purpose |
|---|---|
| Orient | Establish the current objective |
| Focus | Draw attention to the relevant model or variable |
| Predict | Ask the learner to anticipate an outcome |
| Connect | Reveal a relationship between ideas |
| Retrieve | Encourage recall before rereading |
| Reflect | Ask the learner to inspect their reasoning |

The interface must become quieter during focused work. Audio is off by default. No flashing, streak pressure, countdown urgency, camera, microphone or eye tracking.

## Learning system

The target learning cycle is:

**Discover → Understand → Attempt → Verify → Connect → Revisit**

### Learning Flight Engine

Inputs:
- learner-selected goal or concept;
- attempts and task outcomes;
- stated confidence, when the learner chooses to provide it;
- prerequisite relationships;
- retention and transfer evidence, when available.

Outputs:
- next concept or prerequisite;
- explanation or experiment choice;
- independent check;
- later retrieval activity.

The system must explain why it recommends an activity and allow the learner to skip or change route.

### Echo Intelligence

Echo should distinguish:
- concept gap;
- prerequisite gap;
- reasoning gap;
- calculation or transcription error;
- incomplete evidence;
- insufficient evidence.

It must not turn one wrong answer into a broad claim about ability. Aggregate patterns may eventually help improve content, but must not reveal another learner's identity or work.

### Verification Engine

Use deterministic checks where a reliable formal method exists. Use explicit rubrics and carefully bounded model assistance for open responses. Code execution, diagrams, proofs and scientific simulations require isolated and subject-specific verification. A correct final answer with invalid reasoning must not automatically count as mastery.

### Concept Graph

Each concept should have:
- stable identifier and version;
- subject and topic;
- learning objectives;
- prerequisite edges;
- related cross-disciplinary concepts;
- misconceptions;
- explanation variants;
- tasks and verification method;
- evidence requirements;
- references and review status.

## Data and privacy model

The current implementation is guest-first and local-only. It stores progress, attempts, notes and settings in browser local storage. There is no cloud sync or server-side learner profile.

A future multi-user system should use data minimisation, explicit retention and deletion rules, secure authentication, encryption in transit and at rest, access controls, age-appropriate privacy design and guardian/consent review where required. Community features must be optional and moderated.

## Current implementation

Implemented in the repository:
- BATLAB branded static learner shell and responsive cave-inspired design;
- six STEM subject areas and 18 starter concepts;
- searchable concept library;
- concept explanations, key relationships and authored independent checks;
- local attempt and outcome records;
- simple prerequisite-aware next-step routing;
- Echo view that reports what local evidence supports and what remains uncertain;
- Knowledge Terrain with authored prerequisite labels and cross-subject examples;
- interactive idealised simple-pendulum model;
- notebook, flight records, JSON export and local-data clearing;
- Focus Chamber toggle, bat cues and reduced-motion preference;
- no-signup guest entry.

## Current limitations

This is a functional front-end foundation, not a production adaptive-learning platform. The current concept set is a small starter library, not a complete curriculum. The checks are authored, narrow tasks. The route logic is deterministic and local. The concept graph is partial. The pendulum is one idealised simulation.

Not yet implemented:
- full curriculum coverage and expert-reviewed content;
- a versioned graph with comprehensive prerequisite and cross-domain edges;
- robust diagnosis of misconceptions and reasoning;
- proof, diagram, code and open-response verification;
- spaced retrieval, retention and transfer measurement;
- multi-step experiment authoring and a broad simulation library;
- secure accounts, sync, backup, guardian controls and multi-user profiles;
- aggregate learning analytics with privacy protections;
- optional moderated community;
- tested membership billing and entitlements;
- validated educational outcomes.

Do not market these unimplemented capabilities as available.

## Release acceptance principles

1. A learner can start without signup.
2. Every visible control performs its stated action.
3. Learning progress survives reload and can be exported or cleared.
4. Every assessment outcome explains the task and its limits.
5. Unsupported work is labelled for review, never silently certified.
6. Simulations state their assumptions and model boundaries.
7. Focus and reduced-motion settings work across the experience.
8. Mobile, keyboard and screen-reader journeys are tested.
9. No learning efficacy, mastery, accuracy or diagnosis claims are made without evidence.
10. The bat supports attention; it never competes with learning.
