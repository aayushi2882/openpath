import express from 'express';
import { getAiConfig } from '../services/aiService.js';

const router = express.Router();

router.get('/', (req, res) => {
  const aiConfig = getAiConfig();
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
    },
    github: {
      tokenConfigured: hasGithubToken,
      rateLimitTier: hasGithubToken ? 'authenticated (high limit)' : 'unauthenticated (standard limit)',
    },
  });
});

export default router;
