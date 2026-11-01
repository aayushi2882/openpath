# AI Provider Requirements

**Status:** Product behavior confirmed; supported provider matrix and connection architecture pending technical validation.

## Guest provider

- Guest inference uses OpenPath-managed Groq API credentials.
- The Groq credential is server-side only. It must not appear in frontend bundles, API responses, browser storage, or logs.
- Guest calls are subject to configurable backend-enforced quotas. The quota policy is specified separately in `GUEST_USAGE_REQUIREMENTS.md`.
- Guest users cannot select a provider, model, endpoint, or credential.
- Guest responses must respect the product's limited-experience policy. In particular, the existing AI explanation returns a full contribution roadmap; whether guests receive a shortened roadmap, a limited number of full roadmaps, or no generated roadmap must be decided before implementation.

## Registered-user provider onboarding

After signup or login, before entering the full workspace, the user must be able to:

1. Read a short explanation of the supported provider choices and their requirements.
2. Select a supported provider and, when supported, a model.
3. Supply or authorize the selected connection through a secure flow.
4. Validate connectivity, credentials, and model availability.
5. See a clear success state or actionable, non-sensitive recovery guidance.
6. Continue to the personal dashboard only after successful setup; define an explicit recovery route for changing a broken configuration.

GitHub account linking is a separate optional connection and must not be presented as an AI provider.

## Candidate providers and feasibility

| Provider/configuration | Current repository evidence | Required validation |
|---|---|---|
| Groq, OpenPath-managed | No Groq integration or Groq credential configuration was found in the current backend. | Select API/model support, secret storage, spend limits, timeout/retry behavior, and operational ownership. Guest calls must use this backend-held configuration. |
| Hosted provider chosen by a registered user | Current AI service has provider selection for Kaggle endpoint and Ollama fallback, not a general user-selectable hosted-provider abstraction. | Choose providers/models and credential flow. Decide whether users supply keys or authorize an account; define secure storage and revocation. |
| Local Ollama | `backend/src/services/aiService.js` calls an Ollama base URL, defaulting to `http://localhost:11434`; this is the API server's localhost. | For a hosted backend, determine how it can reach a user's machine without exposing an unsafe public endpoint. A local backend deployment is a different connection mode and must be designed explicitly. |
| Kaggle GPU inference | Current code can call a configured `KAGGLE_KERNEL_URL` and checks its `/health`; `backend/.env.example` contains Kaggle URL/model settings. | Existing code does not provide per-user setup, credential lifecycle, notebook/session management, or an availability guarantee. Determine feasibility and supported operating model before offering it as a selectable production provider. |

The table records candidates from the product requirements and repository evidence. It does not promise support for a provider or model.

## Security and behavior requirements

- Provider credentials must never be returned to the client. Status endpoints should return only safe fields such as provider identifier, model identifier, readiness, and sanitized error code/message.
- Do not place credentials in query strings, logs, analytics events, or frontend persistence.
- If user credentials are persisted, select an approved secret-management/encryption design, access controls, rotation/revocation behavior, and deletion semantics before implementation.
- Validate provider and model identifiers against a server-side allowlist; do not accept arbitrary URLs without a separate SSRF/security review.
- Apply request timeouts, bounded payloads, and consistent provider error mapping.
- Treat provider output as untrusted input and retain the existing structured-output validation for explanations/recommendations.
- Keep guest and registered-user routing separate so guests cannot override the managed Groq provider with request-body fields.

## Current implementation boundary

`backend/src/services/aiService.js` provides current issue explanation and recommendation behavior, a Kaggle endpoint check, and Ollama behavior/fallback. It is process-environment configured and is not a per-user provider management system. There is no auth, user credential store, Groq integration, provider onboarding API, or per-user model selection today.

## Open technical decisions

- Initial registered-user provider/model allowlist.
- Groq model and service budget controls.
- Secret storage, encryption, rotation, and provider disconnect behavior.
- Provider adapter interface and whether existing Kaggle/Ollama code is wrapped or incrementally refactored.
- User-local Ollama connectivity model.
- Kaggle availability, isolation, and per-user versus shared service model.
- Which safe provider status fields and error codes the UI requires.
