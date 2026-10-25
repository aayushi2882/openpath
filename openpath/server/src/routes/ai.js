import express from 'express';
import { getOllamaStatus, explainIssue, recommendIssues } from '../services/aiService.js';

const router = express.Router();

/**
 * GET /api/ai/status
 * Reports Ollama reachability and whether the configured model is installed
 */
router.get('/status', async (req, res) => {
  res.json(await getOllamaStatus());
});

router.get('/models', async (req, res) => {
  const status = await getOllamaStatus();
  res.status(status.reachable ? 200 : 503).json({ success: status.reachable, models: status.models, model: status.model, message: status.message });
});

/**
 * POST /api/ai/explain
 * Request body: { issue: { title, body, labels, repo_name, html_url, number }, repository, language, userSkills }
 */
router.post('/explain', async (req, res) => {
  try {
    const { issue, repository, language = 'en', userSkills = [], experience = '' } = req.body || {};

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
      experience: typeof experience === 'string' ? experience : '',
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
    res.status(error.status || 502).json({
      success: false,
      error: `AI explanation failed: ${error.message}`,
    });
  }
});

router.post('/recommend', async (req, res) => {
  try {
    const { repository, issues, userSkills, experience } = req.body || {};
    if (!repository?.full_name || !Array.isArray(issues)) {
      return res.status(400).json({ success: false, error: 'Repository details and a list of real issues are required.' });
    }
    if (issues.length === 0) {
      const config = await getOllamaStatus();
      return res.json({
        success: true,
        configured: config.configured,
        recommendations: [],
        message: config.configured ? 'Load open issues before requesting recommendations.' : config.message,
      });
    }

    const result = await recommendIssues({
      repository,
      issues,
      userSkills: Array.isArray(userSkills) ? userSkills : [],
      experience: typeof experience === 'string' ? experience : '',
    });
    res.json({ success: Boolean(result.configured), ...result });
  } catch (error) {
    console.error('[AI Recommendations API Error]:', error.message);
    res.status(error.status || 502).json({ success: false, error: `Issue recommendations failed: ${error.message}` });
  }
});

export default router;
