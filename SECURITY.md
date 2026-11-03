# Security and data handling

## Workspace model

When `PACELAB_SESSION_ISOLATION=1`, the API issues an opaque, HttpOnly, SameSite=Lax cookie. A one-way hash of that cookie selects a separate SQLite database for the browser workspace. The raw cookie is not used as a filename.

This is workspace separation, not authentication. Anyone who obtains a browser's cookie may be able to access that workspace. There is no account recovery, identity verification or cross-device synchronization.

## Deployment requirements

- Serve both the website and API over HTTPS.
- Keep session isolation enabled on public deployments.
- Mount persistent storage at the configured data directory.
- Use host-level rate limits and request-size limits.
- Restrict direct access to the backend where possible.
- Do not commit secrets, API credentials or personal learning data.
- Define a retention and deletion policy before collecting real learner data.

## Uploaded material

Uploaded files are processed by the configured API and indexed in the workspace database. Users should upload only material they have permission to process. Operators should protect the backend volume and backups as user data.

Report suspected vulnerabilities privately to the repository owner.
