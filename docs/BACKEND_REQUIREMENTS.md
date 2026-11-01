# Backend Requirements

**Status:** Product requirements confirmed; implementation and technical design pending.

This document describes the backend responsibilities implied by the guest-first access model. It is a target specification, not a statement that these capabilities exist today.

## Product behavior

- Public repository discovery must work for a guest without account registration.
- Guest access may retrieve public repository metadata and a limited set of relevant good-first issues.
- Guest AI explanations use OpenPath-managed Groq credentials. The browser must never receive provider credentials.
- The backend must enforce guest AI and other configured usage limits. Frontend-only limits do not satisfy this requirement.
- Signup/login remain optional for exploration. Authentication is required before creating or accessing persistent personal workspace data or personal AI configuration.
- Registered users can save and manage repositories, issues, and contribution history, subject to the product's eventual persistence and retention policy.
- AI provider setup occurs after successful authentication and before entry to the full personal workspace. GitHub account linking remains a separate optional integration.

## Required backend capabilities

1. **Access classification:** Safely distinguish guest requests from authenticated-user requests and apply the corresponding authorization and policy. The guest identity/session mechanism is undecided.
2. **Quota enforcement:** Apply configurable quotas at the backend for guest AI calls and any other metered guest operations. Define concurrency behavior, quota window, reset behavior, and abuse controls before implementation.
3. **Provider routing:** Route guest inference to the OpenPath-managed Groq configuration. Route registered-user inference only through the provider configuration belonging to the authenticated user, once supported providers and credential handling are approved.
4. **Provider validation:** Validate a user's selected provider/model and connection before marking AI onboarding complete. Do not leak keys, full provider URLs containing credentials, or raw upstream secrets in status or error responses.
5. **Persistence and ownership:** Persist authenticated user settings and workspace data with user-scoped access checks. No database or authentication system currently exists; storage and migration choices are open.
6. **API safety:** Validate inputs, bound issue/repository payload sizes, apply provider timeouts, normalize errors, and avoid logging secrets or unnecessary user data.
7. **Graceful operation:** Expose safe readiness information for the selected provider and return actionable but non-sensitive errors when a provider is unavailable, a model is unsupported, or a quota is exhausted.

## Existing implementation to preserve

- Express entry point and middleware: `backend/src/index.js`.
- GitHub repository and issue integration: `backend/src/services/githubService.js` and routes under `backend/src/routes/repositories.js` and `backend/src/routes/issues.js`.
- AI explanation/recommendation behavior: `backend/src/services/aiService.js` and `backend/src/routes/ai.js`.
- Existing `/api/health`, `/api/ai/status`, issue, and repository routes are useful foundations. They currently have no authentication or guest quotas and must not be treated as satisfying the new requirements.

## Non-functional requirements

- **Security:** Secret values remain server-side; authenticate and authorize every personal-data operation; rate-limit and validate public inference endpoints; prevent cross-user data access.
- **Privacy:** Minimize stored guest identifiers and usage metadata. Define retention and deletion behavior before storing personal workspace or provider configuration.
- **Reliability:** Provider failures and rate limits must be isolated and represented consistently; an unavailable optional provider should not make public repository browsing unavailable.
- **Observability:** Record operational outcomes and quota decisions without logging prompts or credentials by default. Exact retention and telemetry policy remain open.

## Acceptance criteria for the future implementation

- An unauthenticated user can use the allowed public repository/issue workflow.
- Guest AI requests are routed to Groq using a server-held credential and are rejected by the backend when the configured quota is exceeded.
- A guest cannot create or retrieve a personal dashboard, saved repository/issue history, or personal provider configuration.
- Authenticated users can access only their own persisted workspace and provider configuration.
- Workspace access is gated until the required AI onboarding is successfully completed, except for explicitly defined recovery/settings routes.
- Provider status/errors never return credentials; tests cover authorization, quota boundaries, and cross-user isolation.

## Decisions still required

- Authentication/session mechanism and account recovery requirements.
- Guest identity and anti-abuse strategy, including privacy implications.
- Database/storage choice, migrations, retention, deletion, and backup policy.
- Exact guest quota dimensions, limits, window, reset, and response behavior.
- Whether provider onboarding is a hard gate for all registered users and the recovery path when no provider is available.
- Supported registered-user providers and models; managed versus user-supplied credentials.
- Whether a server-hosted product can support a user's local Ollama instance safely and reliably.
- Whether managed Kaggle inference is feasible for production use.
