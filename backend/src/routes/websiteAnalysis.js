import express from 'express';
import { analyzeWebsite, resolvePublicAddresses, validateWebsiteUrl } from '../services/websiteAnalysisService.js';

const router = express.Router();
let activeAnalyses = 0;
const MAX_CONCURRENT_ANALYSES = 2;

router.post('/analyze', async (req, res) => {
  const { url } = req.body || {};
  let parsedUrl;
  try {
    parsedUrl = validateWebsiteUrl(url);
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }

  if (activeAnalyses >= MAX_CONCURRENT_ANALYSES) {
    return res.status(429).json({ success: false, error: 'Website analysis is busy. Please try again in a moment.' });
  }

  activeAnalyses += 1;
  try {
    await resolvePublicAddresses(parsedUrl.hostname);
    const result = await analyzeWebsite(url);
    res.json({ success: true, ...result });
  } catch (error) {
    const status = error.status || (/timed out|timeout/i.test(error.message) ? 504 : 502);
    console.error('[Website Analysis API Error]:', error.message);
    res.status(status).json({ success: false, configured: status !== 503, error: error.message });
  } finally {
    activeAnalyses -= 1;
  }
});

export default router;
