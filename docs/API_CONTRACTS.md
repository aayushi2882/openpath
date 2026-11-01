# OpenPath API Contracts (Draft)

**Status:** Draft for backend/frontend review. Existing contracts below describe current code; proposed contracts are targets and are not implemented. Paths and response conventions for new auth/provider/quota endpoints require agreement before implementation.

## Contract conventions to adopt

- JSON request/response bodies for API routes.
- Use a consistent success/error envelope. Existing routes are inconsistent; new routes should not copy that inconsistency.
- Proposed error envelope: `{ "success": false, "error": { "code": "STABLE_CODE", "message": "Safe user-facing message", "details": {} } }`. Omit `details` when there are none. Never include credentials or raw upstream secrets.
- Authenticated endpoints derive user identity from a verified session/token, never a request body field.
- Guest/provider/quota policy is enforced by the backend regardless of client behavior.
- Set request size and provider timeout limits in server configuration; exact limits are operational decisions.

## Existing routes (verified in source)

| Method and path | Current behavior | Request | Current response notes |
|---|---|---|---|
| `GET /api/health` | API health and configured-service flags | None | Current shape is defined in `backend/src/routes/health.js`; do not treat as an authenticated readiness guarantee. |
| `GET /api/ai/status` | Reports current process-configured provider readiness | None | Exposes current provider/model/readiness fields; not scoped to a user and does not configure a provider. |
| `GET /api/ai/models` | Lists models reported by the current provider | None | Current shape includes `success`, `models`, `model`, and `message`; it is process-wide, not user-configured. |
| `POST /api/ai/explain` | Explains a supplied issue using current server AI config | `{ issue, repository?, language?, userSkills?, experience? }` | Validates `issue.title`; returns current structured explanation or configured/error information. The result schema currently includes a six-step roadmap. |
| `POST /api/ai/recommend` | Recommends among real issues supplied by the caller | `{ repository, issues, userSkills?, experience? }` | Requires `repository.full_name` and an issues array. Empty issue list has a special success response. |
| `GET /api/repositories/search` | Searches public GitHub repositories | Query: `q`, `page`, `per_page` | Current response uses `{ success: true, ...data }`; errors vary by route. |
| `GET /api/repositories/:owner/:repo` | Loads public repository workspace metadata/docs | Path: `owner`, `repo` | Current response uses `{ success: true, ...workspace }`. |
| `GET /api/repositories/:owner/:repo/issues` | Searches issues in a public repository | Path plus `q`, `language`, `label`, `sort`, `order`, `page`, `per_page` | Current response uses `{ success: true, ...data }`; GitHub limits/errors are mapped by route. |
| `GET /api/issues/search` | Searches GitHub issues | Query: `q`, `language`, `label`, `sort`, `order`, `page`, `per_page` | Current response uses `{ success: true, ...results }`. |
| `GET /api/issues/details` | Loads a GitHub issue by owner/repo/number | Query: `owner`, `repo`, `issue_number` | Current response is `{ success: true, data }`. |

Source references: `backend/src/index.js` and route modules under `backend/src/routes/`.

## Proposed target contracts — review required

These are endpoint proposals to make implementation concrete, not confirmed route names or payload formats.

### Authentication

| Proposed route | Purpose | Contract points to settle |
|---|---|---|
| `POST /api/auth/signup` | Create account and establish authenticated session | Required fields, validation, duplicate account response, verification and session strategy. |
| `POST /api/auth/login` | Authenticate and establish session | Credential policy, lockout/rate limits, cookie/token strategy, generic failure responses. |
| `POST /api/auth/logout` | End current session | CSRF/session invalidation requirements depend on auth strategy. |
| `GET /api/auth/me` | Return safe authenticated account and onboarding state | No secrets; define what account and onboarding fields are exposed. |

### AI onboarding and configuration

| Proposed route | Purpose | Contract points to settle |
|---|---|---|
| `GET /api/ai/providers` | Return provider/model options supported for the authenticated user | Server-side allowlist; include capability/connection requirements, never credentials. |
| `PUT /api/ai/provider-config` | Select provider/model and submit or reference its connection | Exact payload depends on whether keys are user-supplied, OAuth-based, local, or managed. Must require authentication and protect secrets. |
| `POST /api/ai/provider-config/validate` | Test the selected provider/model connection | Return sanitized readiness and stable error code; define whether config is saved before or after validation. |
| `GET /api/ai/provider-config/status` | Read current user's safe provider/setup status | User-scoped; exclude secrets and sensitive endpoint details. |
| `DELETE /api/ai/provider-config` | Disconnect/remove a user's provider configuration | Confirm fallback behavior, secret deletion, and whether onboarding gate reopens. |

### Personal workspace

Candidate authenticated resource routes for saved repositories/issues/history have not been selected. Define resource ownership, pagination, idempotency, retention/deletion, and response schemas before adding these endpoints. Guests must not access personal workspace routes.

### Guest quotas and inference

- Existing public repository/issue routes remain candidates for guest exploration, with backend-selected result caps and quota policy.
- Existing `POST /api/ai/explain` and `POST /api/ai/recommend` may be extended with guest/auth policy in middleware/service logic. Do not accept a client-selected provider or trusted user identity.
- Proposed quota denial: HTTP `429` with stable code `GUEST_QUOTA_EXCEEDED` and a safe message. Whether to return retry/reset metadata depends on the approved quota window.
- Guest AI uses managed Groq on the server. A request body must not allow guests to choose a provider/model or access registered-user credentials.
- Decide whether guest explanation response omits or limits `contributionRoadmap`; the current response contains six steps.

## Cross-cutting API requirements

- New errors use stable machine-readable codes and safe messages; do not expose provider stack traces or credential-bearing URLs.
- Define status codes for validation, unauthenticated, forbidden, not found, rate limit/quota, provider unavailable, and unexpected errors.
- Document pagination, maximum result counts, field validation, timeouts, and retry semantics for every new route.
- Enforce authorization and user ownership in backend tests, not only UI route guards.
- Add contract tests for guest access, quota rejection, authenticated provider setup, onboarding gating, and workspace isolation.

## Open contract decisions

- Cookie session versus bearer-token auth, CSRF/CORS policy, account verification/recovery.
- Exact provider options and model identifiers.
- Guest identity, quota window, limits, and reset metadata.
- API versioning policy and whether existing endpoints receive a common response-envelope migration.
- Guest roadmap payload policy and registered-user AI request semantics.
- Provider credential submission, persistence, rotation, and deletion protocol.
- Workspace resource routes and persistence model.
