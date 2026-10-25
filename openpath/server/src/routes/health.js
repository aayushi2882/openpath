import express from 'express';
import { getOllamaStatus } from '../services/aiService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const aiConfig = await getOllamaStatus();
  const hasGithubToken = Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim().length > 0);

  res.json({
    status: 'ok',
    service: 'openpath-api',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    ai: {
      configured: aiConfig.configured,
      provider: aiConfig.provider || null,
      model: aiConfig.model || null,
      reachable: aiConfig.reachable,
      modelInstalled: aiConfig.modelInstalled,
      models: aiConfig.models,
      message: aiConfig.message,
    },
    github: {
      tokenConfigured: hasGithubToken,
      rateLimitTier: hasGithubToken ? 'authenticated (high limit)' : 'unauthenticated (standard limit)',
    },
  });
});

export default router;
