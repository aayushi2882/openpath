import express from 'express';
import { searchIssues, getIssueDetails } from '../services/githubService.js';

const router = express.Router();

/**
 * GET /api/issues/search
 * Query params: q, language, label, sort, order, page, per_page
 */
router.get('/search', async (req, res) => {
  try {
    const {
      q = '',
      language = '',
      label = '',
      sort = 'updated',
      order = 'desc',
      page = '1',
      per_page = '15',
    } = req.query;

    const results = await searchIssues({
      q: String(q),
      language: String(language),
      label: String(label),
      sort: String(sort),
      order: String(order),
      page: parseInt(page, 10) || 1,
      per_page: parseInt(per_page, 10) || 15,
    });

    res.json({
      success: true,
      ...results,
    });
  } catch (error) {
    console.error('[Issues API Error]:', error.message);
    const isRateLimit = error.message.toLowerCase().includes('rate limit');
    res.status(isRateLimit ? 429 : 500).json({
      success: false,
      error: error.message,
      isRateLimit,
    });
  }
});

/**
 * GET /api/issues/details
 * Query params: owner, repo, issue_number
 */
router.get('/details', async (req, res) => {
  try {
    const { owner, repo, issue_number } = req.query;

    if (!owner || !repo || !issue_number) {
      return res.status(400).json({
        success: false,
        error: 'Missing required query parameters: owner, repo, issue_number',
      });
    }

    const details = await getIssueDetails(String(owner), String(repo), String(issue_number));

    res.json({
      success: true,
      data: details,
    });
  } catch (error) {
    console.error('[Issue Details API Error]:', error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
