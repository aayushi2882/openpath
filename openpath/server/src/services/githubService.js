/**
 * GitHub REST API Service
 * Interacts with GitHub Search & Issues endpoints with rate-limit safety,
 * optional personal access token support, and sanitized response formatting.
 */

const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Returns common request headers including User-Agent and optional authorization
 */
function getHeaders() {
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'OpenPath-App/1.0.0 (+https://github.com/openpath)',
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers['Authorization'] = `Bearer ${token.trim()}`;
  }

  return headers;
}

/**
 * Strip Markdown tags to create clean plain-text excerpts
 */
function createExcerpt(text, maxLength = 240) {
  if (!text) return 'No description provided by author.';
  const cleaned = text
    .replace(/<!--[\s\S]*?-->/g, '') // remove html comments
    .replace(/```[\s\S]*?```/g, '[code snippet]') // replace code blocks
    .replace(/`([^`]+)`/g, '$1') // inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // images
    .replace(/\[([^\]]+)\]\(.*?\)/g, '$1') // links
    .replace(/[#*_~>]/g, '') // formatting
    .replace(/\r?\n+/g, ' ') // collapse newlines
    .trim();

  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.slice(0, maxLength).trim() + '…';
}

/**
 * Extract owner and repo from repository_url: "https://api.github.com/repos/owner/repo"
 */
function parseRepoUrl(repoUrl) {
  if (!repoUrl) return { owner: '', repo: '', fullName: '' };
  const parts = repoUrl.split('/');
  const repo = parts[parts.length - 1] || '';
  const owner = parts[parts.length - 2] || '';
  return {
    owner,
    repo,
    fullName: owner && repo ? `${owner}/${repo}` : '',
  };
}

/**
 * Search GitHub issues with robust query builder
 */
export async function searchIssues({
  q = '',
  language = '',
  label = '',
  sort = 'updated',
  order = 'desc',
  page = 1,
  per_page = 15,
}) {
  // Build GitHub search qualifiers
  const queryParts = ['is:issue', 'is:open'];

  // Handle label filter
  if (label && label.trim().length > 0) {
    // If user provided a specific label, wrap in quotes
    queryParts.push(`label:"${label.trim()}"`);
  } else if (!q && !language) {
    // If completely blank search, default to good first issues so users see immediate real opportunities
    queryParts.push('label:"good first issue"');
  }

  // Handle language filter
  if (language && language.trim().length > 0 && language.toLowerCase() !== 'all') {
    queryParts.push(`language:"${language.trim()}"`);
  }

  // Handle keyword query
  if (q && q.trim().length > 0) {
    queryParts.push(q.trim());
  }

  const queryString = queryParts.join(' ');
  const url = new URL(`${GITHUB_API_BASE}/search/issues`);
  url.searchParams.set('q', queryString);
  url.searchParams.set('sort', sort);
  url.searchParams.set('order', order);
  url.searchParams.set('page', String(Math.max(1, parseInt(page, 10) || 1)));
  url.searchParams.set('per_page', String(Math.min(30, Math.max(1, parseInt(per_page, 10) || 15))));

  const response = await fetch(url.toString(), {
    headers: getHeaders(),
  });

  // Extract rate-limit headers
  const rateLimitLimit = response.headers.get('x-ratelimit-limit');
  const rateLimitRemaining = response.headers.get('x-ratelimit-remaining');
  const rateLimitReset = response.headers.get('x-ratelimit-reset');
  const rateLimitResetDate = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toISOString() : null;

  if (!response.ok) {
    if (response.status === 403 || response.status === 429) {
      const resetTime = rateLimitResetDate ? new Date(rateLimitResetDate).toLocaleTimeString() : 'shortly';
      throw new Error(
        `GitHub API rate limit reached. Resets at ${resetTime}. (Tip: Add a GITHUB_TOKEN in server/.env for up to 5,000 requests/hour)`
      );
    }
    const errorBody = await response.text();
    let message = `GitHub API error: ${response.status} ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed.message) message = `GitHub: ${parsed.message}`;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  const data = await response.json();

  const items = (data.items || []).map((item) => {
    const { owner, repo, fullName } = parseRepoUrl(item.repository_url);
    return {
      id: item.id,
      number: item.number,
      title: item.title,
      state: item.state,
      html_url: item.html_url,
      repository_url: item.repository_url,
      repo_name: fullName,
      repo_owner: owner,
      repo_short_name: repo,
      author: {
        login: item.user?.login || 'anonymous',
        avatar_url: item.user?.avatar_url || '',
        html_url: item.user?.html_url || '',
      },
      labels: (item.labels || []).map((l) => ({
        id: l.id,
        name: l.name,
        color: l.color,
        description: l.description || '',
      })),
      comments_count: item.comments || 0,
      created_at: item.created_at,
      updated_at: item.updated_at,
      body: item.body || '',
      body_excerpt: createExcerpt(item.body),
    };
  });

  return {
    total_count: data.total_count || 0,
    incomplete_results: data.incomplete_results || false,
    page: parseInt(page, 10) || 1,
    per_page: parseInt(per_page, 10) || 15,
    items,
    rate_limit: {
      limit: rateLimitLimit ? parseInt(rateLimitLimit, 10) : null,
      remaining: rateLimitRemaining ? parseInt(rateLimitRemaining, 10) : null,
      reset_at: rateLimitResetDate,
    },
  };
}

/**
 * Fetch issue details and its parent repository metadata for enriched context
 */
export async function getIssueDetails(owner, repo, issueNumber) {
  if (!owner || !repo || !issueNumber) {
    throw new Error('Owner, repo, and issueNumber are required parameters');
  }

  const [issueRes, repoRes] = await Promise.all([
    fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/issues/${issueNumber}`, {
      headers: getHeaders(),
    }),
    fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, {
      headers: getHeaders(),
    }).catch(() => null),
  ]);

  if (!issueRes.ok) {
    if (issueRes.status === 404) {
      throw new Error(`Issue #${issueNumber} not found in ${owner}/${repo}`);
    }
    throw new Error(`GitHub API error: ${issueRes.status} ${issueRes.statusText}`);
  }

  const issueData = await issueRes.json();
  let repoData = null;
  if (repoRes && repoRes.ok) {
    try {
      repoData = await repoRes.json();
    } catch {
      // ignore
    }
  }

  return {
    id: issueData.id,
    number: issueData.number,
    title: issueData.title,
    body: issueData.body || '',
    html_url: issueData.html_url,
    state: issueData.state,
    created_at: issueData.created_at,
    updated_at: issueData.updated_at,
    comments_count: issueData.comments || 0,
    author: {
      login: issueData.user?.login || 'anonymous',
      avatar_url: issueData.user?.avatar_url || '',
      html_url: issueData.user?.html_url || '',
    },
    labels: (issueData.labels || []).map((l) => ({
      id: l.id,
      name: l.name,
      color: l.color,
      description: l.description || '',
    })),
    repository: repoData
      ? {
          full_name: repoData.full_name,
          name: repoData.name,
          owner: repoData.owner?.login,
          description: repoData.description,
          html_url: repoData.html_url,
          stars: repoData.stargazers_count,
          forks: repoData.forks_count,
          open_issues: repoData.open_issues_count,
          language: repoData.language,
          topics: repoData.topics || [],
          license: repoData.license?.name || null,
          default_branch: repoData.default_branch || 'main',
        }
      : {
          full_name: `${owner}/${repo}`,
          name: repo,
          owner,
          html_url: `https://github.com/${owner}/${repo}`,
        },
  };
}
