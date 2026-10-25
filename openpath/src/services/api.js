/**
 * OpenPath API Client
 * Clean abstraction for backend communication with error handling and rate limit detection.
 */

// Leave this empty by default so Vite proxies /api to the configured backend port.
// Set VITE_API_BASE_URL to use a direct backend URL (CORS is enabled by the API).
const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

/**
 * Fetch system health and integration status
 */
export async function getSystemHealth() {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`Health check failed (${res.status})`);
    return await res.json();
  } catch (err) {
    return {
      status: 'offline',
      error: err.message,
      ai: { configured: false },
      github: { tokenConfigured: false },
    };
  }
}

/**
 * Get AI provider configuration status
 */
export async function getAiStatus() {
  try {
    const res = await fetch(`${BASE_URL}/api/ai/status`);
    if (!res.ok) throw new Error(`AI status check failed (${res.status})`);
    return await res.json();
  } catch {
    return {
      configured: false,
      provider: null,
      message: 'Backend AI endpoint is unreachable. Make sure the OpenPath server is running.',
    };
  }
}

/**
 * Search real GitHub issues
 */
export async function searchGithubIssues({
  q = '',
  language = '',
  label = '',
  sort = 'updated',
  order = 'desc',
  page = 1,
  per_page = 15,
}) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (language && language !== 'all') params.set('language', language);
  if (label && label !== 'all') params.set('label', label);
  if (sort) params.set('sort', sort);
  if (order) params.set('order', order);
  if (page) params.set('page', String(page));
  if (per_page) params.set('per_page', String(per_page));

  const res = await fetch(`${BASE_URL}/api/issues/search?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || !data.success) {
    const error = new Error(data.error || `GitHub search failed with status ${res.status}`);
    error.isRateLimit = Boolean(data.isRateLimit);
    throw error;
  }

  return data;
}

/** Search open issues scoped to one repository. */
export async function searchRepositoryIssues(owner, repo, options = {}) {
  const params = new URLSearchParams();
  const { q = '', language = '', label = '', sort = 'updated', order = 'desc', page = 1, per_page = 12 } = options;
  if (q) params.set('q', q);
  if (language && language !== 'all') params.set('language', language);
  if (label && label !== 'all') params.set('label', label);
  params.set('sort', sort);
  params.set('order', order);
  params.set('page', String(page));
  params.set('per_page', String(per_page));
  const path = `/api/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?${params}`;
  const res = await fetch(`${BASE_URL}${path}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    const error = new Error(data.error || `GitHub issue search failed (${res.status})`);
    error.isRateLimit = Boolean(data.isRateLimit);
    throw error;
  }
  return data;
}

/**
 * Fetch issue details and repo metadata
 */
export async function getIssueDetails(owner, repo, issueNumber) {
  const params = new URLSearchParams({
    owner,
    repo,
    issue_number: String(issueNumber),
  });

  const res = await fetch(`${BASE_URL}/api/issues/details?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to fetch issue details');
  }

  return data.data;
}

/** Load public repository metadata, README, and contribution guidelines. */
export async function getRepositoryWorkspace(owner, repo) {
  const res = await fetch(`${BASE_URL}/api/repositories/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || `Could not load ${owner}/${repo}`);
  }
  return data;
}

/** Search real public repositories to let contributors browse before choosing. */
export async function searchGithubRepositories({ query, page = 1, perPage = 8 }) {
  const params = new URLSearchParams({ q: query, page: String(page), per_page: String(perPage) });
  const res = await fetch(`${BASE_URL}/api/repositories/search?${params.toString()}`);
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data.error || `Repository search failed (${res.status})`);
  return data;
}

/** Analyze a public website without requiring a GitHub repository. */
export async function analyzeWebsite(url) {
  const res = await fetch(`${BASE_URL}/api/website-analysis/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    const error = new Error(data.error || `Website analysis failed (${res.status})`);
    error.status = res.status;
    throw error;
  }
  return data;
}

/** Ask the configured AI provider to rank actual issues from this repository. */
export async function recommendGithubIssues({ repository, issues, userSkills, experience }) {
  const res = await fetch(`${BASE_URL}/api/ai/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repository, issues, userSkills, experience }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Issue analysis failed (${res.status})`);
  return data;
}

/**
 * Request AI explanation for a selected issue
 */
export async function explainIssueWithAi({
  issue,
  repository,
  language = 'en',
  userSkills = [],
  experience = '',
}) {
  const res = await fetch(`${BASE_URL}/api/ai/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      issue,
      repository,
      language,
      userSkills,
      experience,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || `AI explanation request failed (${res.status})`);
  }

  return data;
}
