import express from 'express';
import { getAiConfig, explainIssue } from '../services/aiService.js';

const router = express.Router();

/**
 * GET /api/ai/status
 * Returns whether AI provider is configured and which provider/model is active
 */
router.get('/status', (req, res) => {
  const config = getAiConfig();
  res.json({
    configured: config.configured,
    provider: config.provider || null,
    model: config.model || null,
    message: config.message || null,
  });
});

/**
 * POST /api/ai/explain
 * Request body: { issue: { title, body, labels, repo_name, html_url, number }, repository, language, userSkills }
 */
router.post('/explain', async (req, res) => {
  try {
    const { issue, repository, language = 'en', userSkills = [] } = req.body || {};

    if (!issue || !issue.title) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: "issue" object with at least a "title" is required.',
      });
    }

    const result = await explainIssue({
      issue,
      repository,
      language: language === 'hinglish' ? 'hinglish' : 'en',
      userSkills: Array.isArray(userSkills) ? userSkills : [],
    });

    if (!result.configured) {
      return res.json({
        success: false,
        configured: false,
        message: result.message,
      });
    }

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('[AI Explainer API Error]:', error.message);
    res.status(500).json({
      success: false,
      error: `AI Explanation failed: ${error.message}`,
    });
  }
});

export default router;
