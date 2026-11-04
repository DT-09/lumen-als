# BATLAB deployment

## Static learner platform

Deploy the `web/` directory to Cloudflare Pages.

| Setting | Value |
|---|---|
| Project | BATLAB |
| Repository | `DT-09/StemBat` |
| Production branch | `main` |
| Root directory | `web` |
| Build command | Leave blank |
| Output directory | `.` |

No environment variables or backend service are required for the current learner experience. It uses hash-based navigation and browser local storage.

## Smoke checks before publishing

1. Open the root URL and confirm BATLAB loads.
2. Navigate to Roost, Explore STEM, each subject, Knowledge Terrain, Discovery Lab, Flight Records, Notebook and Settings.
3. Complete one concept check and confirm its state changes.
4. Reload and confirm local progress persists.
5. Change pendulum length and gravity; confirm the predicted period changes.
6. Save an experiment observation and confirm it appears in the notebook.
7. Export the learning record as JSON.
8. Clear local data and confirm the app returns to its guest state.
9. Test mobile navigation, keyboard focus and reduced-motion preference.

## Important boundary

The old FastAPI assessment-verification service remains as legacy repository code. It is not required by BATLAB and is not linked from the learner interface. Do not expose its old STEMPROOF audit pages as part of the BATLAB product.

The current app is a functional learner-facing foundation, not a production adaptive-learning service. Full prerequisite diagnosis, robust proof verification, spaced retrieval, cloud accounts, analytics, billing and moderated community remain future engineering work. Do not market these as implemented.
