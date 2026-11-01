# OpenPath Technical Debt and Known Issues

Severity indicates release impact, not estimated effort. Findings are based on repository inspection and the Phase 0 checks recorded in `CURRENT_STATE.md`.

| Severity | Finding | Evidence / impact |
|---|---|---|
| High | No authentication, authorization, or general API rate limiting | `server/src/index.js` enables unrestricted CORS; inference and repository routes have no general rate limits. Website analysis has only a process-local concurrency cap. Blocks a safe multi-user hosted release. |
| High | Website capture is not isolated as a worker/container | `server/src/services/websiteAnalysisService.js` launches Playwright within the API process. URL/DNS/proxy limits exist, but no infrastructure-level egress or OS/container isolation was found. |
| High | Long-running scans are synchronous and unpersisted | `POST /api/website-analysis/analyze` waits for browser capture and model inference. No job ID, durable state, cancellation, or report retrieval exists. |
| High | Kaggle automation and credential lifecycle are absent | `server/src/services/aiService.js` accepts a configured endpoint URL but has no credential storage, Kaggle CLI orchestration, session registry, or managed connect/disconnect lifecycle. |
| Medium | Website AI bypasses the issue-AI provider selection | `getAiFindings()` in `websiteAnalysisService.js` calls Ollama directly. Kaggle readiness does not imply website AI is available. |
| Medium | Backend test suite is not green | 12/13 tests passed. `aiService.test.js` expects `/Start Ollama/`, while `getLocalOllamaStatus()` returns `Local Ollama fallback is unreachable.` This is a genuine test/implementation expectation mismatch; intended UX must be decided before changing either side. |
| Medium | GitHub service has no visible cache or bounded retry/timeout policy | `server/src/services/githubService.js` calls GitHub directly. Rate-limit headers are returned, but no caching, retry backoff, or explicit timeout was found. |
| Medium | No deterministic issue ranking or evidence-backed empty-state fallback | `recommendIssues()` relies on model output for ranking supplied issues. No transparent deterministic fit factors or alternate contribution suggestions were found. |
| Medium | API error handling is inconsistent | Route handlers use differing status/envelope conventions; `src/services/api.js` parses JSON before status checks in several calls. |
| Medium | No frontend/component/E2E test suite | Root scripts have build and lint but no frontend test script. No browser journey tests found. |
| Medium | No CI/deployment/operations baseline | No CI workflow, deployment topology, runbook, backup, rollback, alerting, or incident ownership files found. |
| Low | Lint warning | `src/components/SkillReadinessCard.jsx` imports unused `useEffect`. Do not change as part of setup-only work without a scoped maintenance task. |
| Low | README setup structure is stale | Root `README.md` still says `cd openpath/openpath` and describes the nested app layout. The app now lives at repository root. Artwork links work after restoring `assets/`. |

## Environment limitations observed

- AI status returned a healthy HTTP response but reported local Ollama unreachable; no live inference was verified.
- GitHub calls succeeded without a token, at the unauthenticated 10-request/hour limit shown by GitHub at test time.
- The first sandboxed route-test attempt could not bind a loopback port (`EPERM`); when rerun with local socket access, it passed. This is an environment constraint, not a remaining test failure.
