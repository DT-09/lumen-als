# LUMEN ALS deployment checklist

## Required configuration

- Run behind HTTPS and set `LUMEN_COOKIE_SECURE=1`.
- Set `LUMEN_SESSION_ISOLATION=1`.
- Mount a persistent writable volume and set `LUMEN_DATA_DIR` to that mount (the included Dockerfile uses `/var/data`).
- Use one application instance unless the platform guarantees all instances share the same persistent filesystem. Per-browser SQLite files on separate instance disks will not replicate between instances.
- Configure the platform or reverse proxy to enforce request-rate and body-size limits. The app caps uploads at 25 MB per file, 50 MB total, and 10 files per request.
- Use a platform backup/retention policy for the workspace directory. Remove abandoned session databases periodically.

## Privacy model and limits

LUMEN ALS uses a random browser cookie to select an isolated SQLite workspace. The cookie is HttpOnly and SameSite=Lax; on HTTPS deployments it must be Secure. The cookie is a bearer identifier: anyone who obtains it may access that workspace. This is not a login system, has no account recovery, and does not sync data across browsers. Clearing browser cookies disconnects the user from their existing workspace.

The default local configuration (`LUMEN_SESSION_ISOLATION=0`) uses one local database and is intended only for local development. Do not expose it to the public internet.

## Smoke test after deployment

1. Open the site in a fresh browser profile and upload the included sample PDF.
2. Ask a question answered in that PDF and verify the displayed page citation.
3. Ask an unrelated question and confirm the app reports insufficient evidence.
4. Generate practice, answer one question, and confirm the explanation includes a source locator.
5. Open the site in a second browser profile. It should show an empty workspace, not the first profile's course data or attempts.
6. Reset the second workspace and verify the first profile remains unchanged.
7. Restart the service and verify each workspace persists. If data disappears, persistent storage is not configured correctly.
