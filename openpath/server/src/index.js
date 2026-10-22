import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import healthRouter from './routes/health.js';
import issuesRouter from './routes/issues.js';
import aiRouter from './routes/ai.js';
import { getAiConfig } from './services/aiService.js';

// Load environment variables from server/.env if available
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
// Also fall back to root .env if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend Vite dev server (or production URL)
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Request logging (sanitized, zero secret leakage)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Mount API routes
app.use('/api/health', healthRouter);
app.use('/api/issues', issuesRouter);
app.use('/api/ai', aiRouter);

// Global 404 handler for unmatched /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('[Global Server Error]:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start listening
app.listen(PORT, () => {
  const aiConfig = getAiConfig();
  console.log(`====================================================`);
  console.log(`🚀 OpenPath Backend running on http://localhost:${PORT}`);
  console.log(`📡 GitHub Integration: ${process.env.GITHUB_TOKEN ? 'Token Configured (High Rate Limit)' : 'Unauthenticated (Standard Rate Limit)'}`);
  console.log(`🤖 AI Provider: ${aiConfig.configured ? `${aiConfig.provider} (${aiConfig.model})` : 'None (AI features require provider key in .env)'}`);
  console.log(`====================================================`);
});
