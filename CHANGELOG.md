# Changelog

## 2.2.0 — Launch reliability and backup hardening
- Validate imported backups against the VESPER product identity and supported schema version.
- Reject backup files above 10 MB and normalise malformed imported records before restoring them.
- Replace unsafe imported record IDs and validate linked question references to prevent malformed backup data from entering route and control attributes.
- Keep only known starter-concept identifiers in restored learning routes.
- Preserve browser download URLs long enough for the browser to begin saving exports.
- Version the offline application cache so clients refresh the updated runtime.
- Add regression assertions for backup validation, imported-state normalisation and export lifecycle.


## 2.0.0 — Self-education system rebuild
- Repositioned VESPER as an independent learning environment for curious, self-directed STEM learners.
- Replaced the observatory/course-led information architecture with learner-owned questions, learning plans, study, investigation, creation and evidence.
- Added the Curiosity Engine, Knowledge Architect, Learning Studio, Knowledge Map, Investigation Lab, Model Bench, Creation Workshop, Resource Library, Field Journal, Recall Practice and Knowledge Intelligence.
- Added interactive linear-function, ideal-pendulum and Ohm's-law models.
- Added browser-local persistence, export, validated backup restore, data clearing and migration of available legacy learner records.
- Added editable learning plans with actionable milestones, editable journal and resource records, investigation deletion, recall review history and a distraction-free study mode.
- Replaced the homepage orbital graphic with a clear independent-learning cycle and a context-aware continue-work panel.
- Corrected simplified electron-shell occupancy for elements 1–20.
- Rebuilt the interface around a restrained graphite, mineral green, ivory and brass design system.
- Updated product architecture, deployment instructions and release boundaries.
- Updated the static validation workflow and legacy shell regression assertion.

## 1.1.0 — Legacy assessment-verifier hardening
- Hardened the legacy FastAPI verifier with production access controls and regression tests.
- The verifier is repository code only; it is not part of the VESPER learner application.
