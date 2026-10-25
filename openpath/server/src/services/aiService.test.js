import test from 'node:test';
import assert from 'node:assert/strict';
import { explainIssue, getAiConfig, getOllamaStatus, recommendIssues } from './aiService.js';

const ENV_KEYS = ['OLLAMA_BASE_URL', 'OLLAMA_MODEL'];
function saveEnvironment() { return Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]])); }
function restoreEnvironment(saved) {
  for (const key of ENV_KEYS) saved[key] === undefined ? delete process.env[key] : process.env[key] = saved[key];
}
function ollamaResponse(content) {
  return new Response(JSON.stringify({ message: { content }, done: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

test('defaults to local Ollama with Gemma 4 e2b and reads installed tags', async () => {
  const env = saveEnvironment(); const originalFetch = globalThis.fetch;
  delete process.env.OLLAMA_BASE_URL; delete process.env.OLLAMA_MODEL;
  globalThis.fetch = async (url) => {
    assert.equal(url, 'http://localhost:11434/api/tags');
    return new Response(JSON.stringify({ models: [{ name: 'gemma4:e2b' }, { name: 'llama3.2:latest' }] }));
  };
  try {
    assert.equal(getAiConfig().model, 'gemma4:e2b');
    assert.deepEqual(await getOllamaStatus(), { configured: true, reachable: true, modelInstalled: true, provider: 'ollama', model: 'gemma4:e2b', models: ['gemma4:e2b', 'llama3.2:latest'], message: null });
  } finally { globalThis.fetch = originalFetch; restoreEnvironment(env); }
});

test('reports the configured pull command when the model is not installed', async () => {
  const env = saveEnvironment(); const originalFetch = globalThis.fetch;
  process.env.OLLAMA_MODEL = 'gemma4:e2b';
  globalThis.fetch = async () => Response.json({ models: [{ name: 'llama3.2:latest' }] });
  try {
    const status = await getOllamaStatus();
    assert.equal(status.reachable, true); assert.equal(status.modelInstalled, false); assert.equal(status.configured, false);
    assert.match(status.message, /ollama pull gemma4:e2b/);
  } finally { globalThis.fetch = originalFetch; restoreEnvironment(env); }
});

test('explanation uses Ollama structured JSON and validates the six-step roadmap', async () => {
  const env = saveEnvironment(); const originalFetch = globalThis.fetch;
  process.env.OLLAMA_BASE_URL = 'http://localhost:11434'; process.env.OLLAMA_MODEL = 'gemma4:e2b';
  const roadmap = ['Understand the problem', 'Inspect relevant files', 'Prepare the development environment', 'Implement a focused fix', 'Run appropriate tests', 'Prepare the pull request'].map((title) => ({ title, details: `Verify ${title} using repository documentation.` }));
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'http://localhost:11434/api/chat');
    const request = JSON.parse(options.body);
    assert.equal(request.model, 'gemma4:e2b'); assert.equal(request.stream, false); assert.equal(request.format.type, 'object');
    assert.match(request.messages[1].content, /keyboard navigation/);
    return ollamaResponse(JSON.stringify({ problemSummary: 'The issue asks for improved keyboard navigation.', expectedOutcome: 'Keyboard users can navigate the menu.', contributionRoadmap: roadmap }));
  };
  try {
    const result = await explainIssue({ issue: { number: 37, title: 'Improve keyboard navigation', body: 'The menu cannot be navigated using a keyboard.' }, repository: { full_name: 'example/project', language: 'JavaScript' } });
    assert.equal(result.provider, 'ollama'); assert.equal(result.model, 'gemma4:e2b'); assert.equal(result.explanation.contributionRoadmap.length, 6);
  } finally { globalThis.fetch = originalFetch; restoreEnvironment(env); }
});

test('recommendations contain only supplied issues and skills', async () => {
  const env = saveEnvironment(); const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => {
    const request = JSON.parse(options.body);
    assert.match(request.messages[1].content, /New to open source/);
    return ollamaResponse(JSON.stringify({ recommendations: [{ issueNumber: 37, fitReason: 'Issue evidence mentions keyboard navigation.', skillsMatch: ['JavaScript'], missingInformation: ['Relevant file is unknown.'] }, { issueNumber: 999, fitReason: 'invented', skillsMatch: [], missingInformation: [] }] }));
  };
  try {
    const result = await recommendIssues({ repository: { full_name: 'example/project' }, issues: [{ number: 37, title: 'Keyboard navigation', body: 'Keyboard navigation is broken.' }], userSkills: ['JavaScript'], experience: 'New to open source' });
    assert.deepEqual(result.recommendations.map((item) => item.issueNumber), [37]);
  } finally { globalThis.fetch = originalFetch; restoreEnvironment(env); }
});

test('reports unreachable Ollama and safely rejects malformed model output', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new TypeError('connection refused'); };
  try {
    const status = await getOllamaStatus(); assert.equal(status.reachable, false); assert.match(status.message, /Start Ollama/);
    globalThis.fetch = async () => ollamaResponse('not json');
    await assert.rejects(explainIssue({ issue: { title: 'A real issue' }, repository: { full_name: 'example/project' } }), /parse AI output/);
  } finally { globalThis.fetch = originalFetch; }
});
