import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { createServer } from 'node:http';
import websiteAnalysisRouter from '../routes/websiteAnalysis.js';
import {
  analyzeWebsite,
  cleanFindings,
  getAiFindings,
  isPublicAddress,
  resolvePublicAddresses,
  validateWebsiteUrl,
} from './websiteAnalysisService.js';

test('accepts public HTTP and HTTPS URLs and drops fragments', () => {
  assert.equal(validateWebsiteUrl('https://example.org/docs#section').href, 'https://example.org/docs');
  assert.equal(validateWebsiteUrl('http://example.org:80/').href, 'http://example.org/');
});

test('rejects non-web protocols, credentials, nonstandard ports, and local hostnames', () => {
  for (const value of [
    'file:///etc/passwd',
    'ftp://example.org',
    'https://user:pass@example.org',
    'https://example.org:8443',
    'http://localhost',
    'http://service.internal',
  ]) assert.throws(() => validateWebsiteUrl(value));
});

test('blocks private, loopback, link-local, and reserved IP ranges', async () => {
  for (const address of ['127.0.0.1', '10.0.0.1', '172.16.4.2', '192.168.1.1', '169.254.169.254', '::1', 'fd00::1', 'fe80::1', '::ffff:127.0.0.1']) {
    assert.equal(isPublicAddress(address), false, `${address} should be non-public`);
    await assert.rejects(resolvePublicAddresses(address));
  }
  assert.equal(isPublicAddress('8.8.8.8'), true);
});

test('rejects a DNS name if any resolved address points to an internal network', async () => {
  const originalLookup = (await import('node:dns/promises')).default.lookup;
  const dns = (await import('node:dns/promises')).default;
  dns.lookup = async () => [{ address: '8.8.8.8', family: 4 }, { address: '10.0.0.1', family: 4 }];
  try {
    await assert.rejects(resolvePublicAddresses('mixed-answer.example'));
  } finally {
    dns.lookup = originalLookup;
  }
});

test('returns only evidence-backed, non-absence claims and labels findings as inferences', () => {
  const capture = {
    title: 'Example page', description: '', pageText: 'Sign up now for updates.',
    headings: [{ text: 'Example page' }], links: [], buttons: [],
  };
  const findings = cleanFindings([
    { title: 'Clarify the call to action', category: 'usability', severity: 'low', evidence: { source: 'page_text', quote: 'Sign up now for updates.' }, explanation: 'The call to action does not say what updates contain.', suggestedFix: 'Add a short description of the updates.' },
    { title: 'Missing privacy policy', category: 'content', severity: 'high', evidence: { source: 'screenshot', quote: 'No privacy link is visible.' }, explanation: 'The page lacks a privacy policy.', suggestedFix: 'Add a privacy policy.' },
    { title: 'Invented quote', category: 'content', severity: 'low', evidence: { source: 'page_text', quote: 'Pay $100 now.' }, explanation: 'This may confuse visitors.', suggestedFix: 'Explain the price.' },
  ], capture);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].assessment, 'AI inference');
});

test('sends screenshot image input to the configured local Ollama model', async () => {
  const originalFetch = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options, body: JSON.parse(options.body) };
    return Response.json({ message: { content: JSON.stringify({ findings: [] }) } });
  };
  try {
    await getAiFindings({
      url: 'https://example.org/', status: 200, screenshot: Buffer.from('jpeg-bytes').toString('base64'),
      title: 'Example', description: '', headings: [], links: [], buttons: [], images: [], pageText: 'Example page',
    });
    assert.equal(request.url, 'http://localhost:11434/api/chat');
    assert.equal(request.body.model, 'gemma4:e2b');
    assert.deepEqual(request.body.messages[1].images, [Buffer.from('jpeg-bytes').toString('base64')]);
    assert.equal(request.body.stream, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('rejects private IP website targets before attempting capture or inference', async () => {
  await assert.rejects(analyzeWebsite('http://127.0.0.1'), /private, local, or reserved/);
});

test('website analysis route rejects unsafe URLs', async () => {
  const app = express();
  app.use(express.json());
  app.use('/api/website-analysis', websiteAnalysisRouter);
  const server = createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const endpoint = `http://127.0.0.1:${server.address().port}/api/website-analysis/analyze`;
  try {
    const privateResponse = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: 'http://127.0.0.1' }) });
    assert.equal(privateResponse.status, 400);
    assert.match((await privateResponse.json()).error, /private, local, or reserved/);

  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
