import express from 'express';
import { getRepositoryWorkspace, searchRepositories, searchRepositoryIssues } from '../services/githubService.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    const data = await searchRepositories({
      query: String(req.query.q || ''),
      page: req.query.page,
      perPage: req.query.per_page,
    });
    res.json({ success: true, ...data });
  } catch (error) {
    console.error('[Repository Search API Error]:', error.message);
    res.status(error.status || 400).json({ success: false, error: error.message });
  }
});

router.get('/:owner/:repo/issues', async (req, res) => {
  const { owner, repo } = req.params;
  if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) {
    return res.status(400).json({ success: false, error: 'Enter a valid GitHub owner and repository name.' });
  }
  try {
    const data = await searchRepositoryIssues(owner, repo, {
      q: String(req.query.q || ''), language: String(req.query.language || ''),
      label: String(req.query.label || ''), sort: String(req.query.sort || 'updated'),
      order: String(req.query.order || 'desc'), page: parseInt(req.query.page, 10) || 1,
      per_page: parseInt(req.query.per_page, 10) || 12,
    });
    res.json({ success: true, ...data });
  } catch (error) {
    console.error(`[Repository Issues API Error] ${owner}/${repo}:`, error.message);
    const isRateLimit = error.status === 403 || error.status === 429 || /rate limit/i.test(error.message);
    res.status(isRateLimit ? 429 : (error.status || 500)).json({ success: false, error: error.message, isRateLimit });
  }
});

router.get('/:owner/:repo', async (req, res) => {
  const { owner, repo } = req.params;
  if (!/^[A-Za-z0-9_.-]+$/.test(owner) || !/^[A-Za-z0-9_.-]+$/.test(repo)) {
    return res.status(400).json({ success: false, error: 'Enter a valid GitHub owner and repository name.' });
  }

  try {
    const workspace = await getRepositoryWorkspace(owner, repo);
    res.json({ success: true, ...workspace });
  } catch (error) {
    console.error(`[Repository API Error] ${owner}/${repo}:`, error.message);
    res.status(error.status || 500).json({
      success: false,
      error: error.status === 404
        ? 'Repository not found, or it is not publicly accessible.'
        : error.message,
    });
  }
});

export default router;
