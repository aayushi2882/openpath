# OpenPath Feature Audit

Statuses distinguish code presence from runtime evidence. Full acceptance criteria remain governed by the Master Implementation Plan.

| Feature / journey | Status | Evidence and gap |
|---|---|---|
| Home, open-source learning, and program directory | Implemented; static content | `src/App.jsx`, `src/components/OpenSource101.jsx`, `src/components/OpportunitiesSection.jsx`, and `src/data/`. Build passed; content freshness is not automated. |
| Public GitHub repository input/search | Implemented and runtime-verified | `src/components/RepositoryWorkspace.jsx`; `server/src/services/githubService.js`; live `vitejs/vite` metadata/docs request succeeded. URL validation is client-side plus path checks server-side. |
| Repository issues and pagination | Implemented and runtime-verified | `IssueDiscovery.jsx`; `githubService.js`; public `vitejs/vite` issue query returned real issue data and rate-limit headers. No cache/retry tests. |
| Pull-request filtering | Implemented in code | `searchIssues()` removes records marked as pull requests. No dedicated GitHub-service test found. |
| Skills and experience profile | Partially implemented | `App.jsx` and `RepositoryWorkspace.jsx` use browser `localStorage`; no account or cross-device persistence. |
| Issue recommendations | Partially implemented | `server/src/services/aiService.js` accepts actual supplied issues and filters model output to their issue numbers. No deterministic baseline ranking or live inference verification. |
| Issue explanation and six-step plan | Partially implemented | `explainIssue()` validates required explanation fields; mocked service test covers an Ollama response. Repository file-tree evidence is not supplied. |
| Kaggle/local AI setup and status | Partially implemented | `getAiConfig()` supports a Kaggle endpoint with local fallback; status endpoint is live. Managed credentials/session lifecycle is absent; local Ollama was offline during smoke check. |
| Website issue detective | Partially implemented | `WebsiteIssueDetective.jsx` and `websiteAnalysisService.js` provide single-page capture and AI inferences with URL safety controls. No deterministic check catalog, isolated worker, job progress, cancellation, or saved report. |
| Health/setup UI | Implemented; backend endpoint verified | `routes/health.js`, `SetupModal.jsx`; health returned HTTP 200. UI runtime was not browser-automated. |
| Frontend tests/E2E | Not implemented | No frontend test script or E2E suite found. |
| Authentication, database, history, jobs, CI/deployment | Not implemented | No corresponding implementation or configuration found. |

## Verified user paths

1. `npm run dev` started Vite and Express.
2. Browser root endpoint `http://localhost:5173/` returned HTTP 200.
3. Health and AI status endpoints returned HTTP 200; the AI dependency itself was unavailable.
4. Repository metadata, README/contribution guide, and a real public issue list were fetched for `vitejs/vite`.
5. AI explanation UI and website screenshot capture were not exercised end-to-end with live external providers.
