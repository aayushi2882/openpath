# Guest Usage Requirements

**Status:** Guest capabilities and restrictions confirmed; numeric limits and identity policy pending.

## Guest capabilities

- Explore without signup or login.
- Submit a public GitHub repository URL and view public repository metadata.
- Discover a limited number of relevant good-first issues.
- Request limited AI issue explanations through the OpenPath-managed Groq provider.
- View basic contribution recommendations.

## Guest restrictions

- No persistent personal repository dashboard.
- No saved issue history or contribution history.
- No personal AI provider or model configuration.
- No unlimited AI-generated contribution roadmaps.
- No bypass of guest policy by changing client-side state, request body fields, or calling API routes directly.

The precise guest roadmap experience is unresolved: the current explanation schema includes a six-step contribution roadmap. Product must decide whether guests receive a reduced roadmap, a capped number of full roadmaps, or an explanation without that section.

## Backend enforcement

- Enforce all guest quotas and capability restrictions in Express/backend services. UI counters are informational only.
- Apply the same policy to every route that can consume GitHub or AI resources, including alternate issue/repository endpoints; do not protect only the primary UI path.
- Do not trust a client-supplied role, user ID, provider, remaining quota, or reset time.
- Return a stable quota error code and safe guidance when a request is denied. Exact response status and reset metadata await the quota-window decision.
- Make limits configurable by operation and environment without exposing internal service credentials.
- Ensure unauthenticated requests cannot use personal-workspace routes or another user's data.

## Quota policy fields to decide

No numeric quota is set by this requirements document. Before implementation, product/engineering must choose:

| Dimension | Decision needed |
|---|---|
| Operations counted | AI explanations, recommendations, issue/repository searches, or some combination. |
| Limit | Allowed requests/items per operation. |
| Window and reset | Fixed or rolling window, duration, and reset semantics. |
| Concurrent use | Whether parallel requests consume quota at admission, completion, or both. |
| Guest identity | Anonymous session/cookie, privacy-preserving token, IP-derived signals, or another strategy. Avoid relying on IP alone without assessing shared networks and privacy. |
| Abuse response | Per-identity throttling, global spend cap, provider outage behavior, and any escalation/challenge policy. |
| User transition | Whether anonymous history or quota state transfers after signup. Product requirement currently promises no persistent guest dashboard/history; transfer behavior remains undecided. |
| Response shape | Stable error code, retry guidance, and whether a reset timestamp is exposed. |

## Privacy and security

- Collect the minimum data needed to apply quotas and protect the service.
- Document any guest identifier persistence, expiry, and deletion behavior.
- Never log provider credentials; avoid logging issue prompt contents unless an approved privacy policy requires it.
- Apply quotas before expensive provider calls and validate payload sizes before processing.
- Add tests for exact quota boundaries, concurrent requests, identity spoofing, provider override attempts, and cross-user authorization.

## Existing behavior

The current backend has no authentication, account model, guest identity, or configurable guest quota system. Current `/api/ai/explain` and `/api/ai/recommend` call the process-configured AI service without guest-specific metering. Repository and issue routes call GitHub directly. These are foundations to extend, not existing guest controls.
