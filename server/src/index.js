import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

import healthRouter from './routes/health.js';
import issuesRouter from './routes/issues.js';
import repositoriesRouter from './routes/repositories.js';
import aiRouter from './routes/ai.js';
import websiteAnalysisRouter from './routes/websiteAnalysis.js';
import { getAiConfig } from './services/aiService.js';

// Load server/.env before reading PORT so the server's setting is authoritative.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
// Also fall back to root .env if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const app = express();
const PORT = Number.parseInt(process.env.PORT || '5501', 10);
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`[OpenPath API] Invalid PORT value: ${process.env.PORT}. Set PORT to a number from 1 to 65535.`);
  process.exit(1);
}

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
app.use('/api/repositories', repositoriesRouter);
app.use('/api/ai', aiRouter);
app.use('/api/website-analysis', websiteAnalysisRouter);

// Global 404 handler for unmatched /api routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error('[Global Server Error]:', err.message);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start listening and report common local development conflicts clearly.
const server = createServer(app);
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`[OpenPath API] Port ${PORT} is already in use. Another process may be listening there.`);
    console.error('[OpenPath API] Stop or reconfigure that process, or set PORT in .env and keep Vite\'s proxy pointed at the same port.');
  } else {
    console.error(`[OpenPath API] Failed to start on port ${PORT}: ${error.message}`);
  }
  process.exitCode = 1;
});

server.listen(PORT, () => {
  const aiConfig = getAiConfig();
  console.log(`====================================================`);
  console.log(`🚀 OpenPath Backend running on http://localhost:${PORT}`);
  console.log(`📡 GitHub Integration: ${process.env.GITHUB_TOKEN ? 'Token Configured (High Rate Limit)' : 'Unauthenticated (Standard Rate Limit)'}`);
  console.log(`🤖 Local AI: ${aiConfig.provider} (${aiConfig.model}); readiness is verified by GET /api/ai/status`);
  console.log(`====================================================`);
});
