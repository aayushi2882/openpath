const DEFAULT_OLLAMA_BASE_URL = 'http://localhost:11434';
const DEFAULT_OLLAMA_MODEL = 'gemma4:e2b';

const stringArray = { type: 'array', items: { type: 'string' } };
const ISSUE_RECOMMENDATION_SCHEMA = {
  type: 'object',
  properties: {
    recommendations: {
      type: 'array',
      maxItems: 3,
      items: {
        type: 'object',
        properties: {
          issueNumber: { type: 'integer' },
          fitReason: { type: 'string' },
          skillsMatch: stringArray,
          missingInformation: stringArray,
        },
        required: ['issueNumber', 'fitReason', 'skillsMatch', 'missingInformation'],
        additionalProperties: false,
      },
    },
  },
  required: ['recommendations'],
  additionalProperties: false,
};

const ISSUE_EXPLANATION_SCHEMA = {
  type: 'object',
  properties: {
    problemSummary: { type: 'string' },
    expectedOutcome: { type: 'string' },
    relevantSkills: stringArray,
    technicalTerms: {
      type: 'array',
      items: { type: 'object', properties: { term: { type: 'string' }, definition: { type: 'string' } }, required: ['term', 'definition'], additionalProperties: false },
    },
    investigationSteps: stringArray,
    clarificationQuestions: stringArray,
    skillReadiness: {
      type: 'object',
      properties: {
        matchingSkills: stringArray,
        skillsToLearn: stringArray,
        difficultyEstimate: { type: 'string' },
        rationale: { type: 'string' },
        disclaimer: { type: 'string' },
      },
      required: ['matchingSkills', 'skillsToLearn', 'difficultyEstimate', 'rationale', 'disclaimer'],
      additionalProperties: false,
    },
    uncertaintyNotes: { type: 'string' },
    contributionRoadmap: {
      type: 'array',
      minItems: 6,
      maxItems: 6,
      items: { type: 'object', properties: { title: { type: 'string' }, details: { type: 'string' } }, required: ['title', 'details'], additionalProperties: false },
    },
  },
  required: ['problemSummary', 'expectedOutcome', 'relevantSkills', 'technicalTerms', 'investigationSteps', 'clarificationQuestions', 'skillReadiness', 'uncertaintyNotes', 'contributionRoadmap'],
  additionalProperties: false,
};

/** Local Ollama is the only inference provider; API credentials are never read. */
export function getAiConfig() {
  const baseUrl = (process.env.OLLAMA_BASE_URL || DEFAULT_OLLAMA_BASE_URL).replace(/\/+$/, '');
  return { configured: true, provider: 'ollama', baseUrl, model: process.env.OLLAMA_MODEL || DEFAULT_OLLAMA_MODEL };
}

export async function getOllamaStatus() {
  const config = getAiConfig();
  try {
    const response = await fetch(`${config.baseUrl}/api/tags`, { signal: AbortSignal.timeout(2500) });
    if (!response.ok) throw new Error(`Ollama returned HTTP ${response.status}.`);
    const payload = await response.json();
    const models = (Array.isArray(payload.models) ? payload.models : []).map((item) => item.name).filter(Boolean);
    const modelInstalled = models.includes(config.model);
    return { configured: modelInstalled, reachable: true, modelInstalled, provider: 'ollama', model: config.model, models,
      message: modelInstalled ? null : `Model ${config.model} is not installed. Run: ollama pull ${config.model}` };
  } catch {
    return { configured: false, reachable: false, modelInstalled: false, provider: 'ollama', model: config.model, models: [],
      message: 'Ollama is unreachable. Start Ollama on this machine, then check the connection again.' };
  }
}

/**
 * Build system and user prompt for issue explanation
 */
function buildPrompts({ issue, repository, language = 'en', userSkills = [], experience = '' }) {
  const isHinglish = language === 'hinglish';

  const systemPrompt = `You are OpenPath's AI mentor for first-time open-source contributors.
Your job is to break down real GitHub issues into actionable, beginner-friendly explanations.
Important principles:
1. Ground your answer ONLY in the provided issue title, description, labels, and repository metadata.
2. Never claim you have executed or inspected unseen repository code. Do not invent repository file paths, setup commands, or technical details. Ask the contributor to search the repository and verify paths/commands.
3. Keep technical terms accurate while explaining unfamiliar jargon clearly.
4. Language mode: ${
    isHinglish
      ? 'Explain in conversational Hinglish (Hindi + English blend commonly spoken in India by developers). Use Hindi sentence structure and common words like "karna hai", "check karo", "maintainer chahte hain ki", but keep technical keywords like "props", "pull request", "repository", "function", "linting", "branch" in English. Make it encouraging and friendly.'
      : 'Explain in clear, simple, encouraging English suitable for a beginner.'
  }
5. You MUST return ONLY a valid JSON object matching the requested schema. Do not include markdown code fence formatting (e.g. no \`\`\`json). Just the raw JSON.`;

  const userSkillsFormatted =
    Array.isArray(userSkills) && userSkills.length > 0 ? userSkills.join(', ') : 'None specified yet';

  const issueLabels = (issue.labels || []).map((l) => (typeof l === 'string' ? l : l.name)).join(', ');

  const userPrompt = `Analyze this GitHub issue for an aspiring contributor:

REPOSITORY: ${repository?.full_name || issue.repo_name || 'Unknown'}
PRIMARY LANGUAGE: ${repository?.language || 'Not specified'}
REPO DESCRIPTION: ${repository?.description || 'N/A'}
REPO TOPICS: ${repository?.topics ? repository.topics.join(', ') : 'None'}

ISSUE NUMBER: #${issue.number || ''}
ISSUE TITLE: ${issue.title}
ISSUE LABELS: ${issueLabels || 'No labels'}
ISSUE URL: ${issue.html_url || ''}

ISSUE BODY:
${(issue.body || issue.body_excerpt) ? (issue.body || issue.body_excerpt).slice(0, 3500) : 'No description provided in issue body.'}

CONTRIBUTOR'S STATED SKILLS:
${userSkillsFormatted}
EXPERIENCE LEVEL:
${experience || 'Not specified'}

Return a valid JSON object with EXACTLY this structure:
{
  "problemSummary": "A concise explanation of what the problem is or what needs to be created.",
  "expectedOutcome": "What the maintainer or project wants to see once this is fixed or implemented.",
  "relevantSkills": ["list", "of", "technologies", "or", "concepts", "involved"],
  "technicalTerms": [
    { "term": "technical word", "definition": "simple explanation" }
  ],
  "investigationSteps": [
    "Step 1: suggested files or directories to inspect or keywords to search in repo",
    "Step 2: what to look for"
  ],
  "clarificationQuestions": [
    "Specific question contributor should ask maintainer before or while working"
  ],
  "skillReadiness": {
    "matchingSkills": ["skills contributor has that are relevant"],
    "skillsToLearn": ["skills needed that contributor didn't list"],
    "difficultyEstimate": "Cautious estimate: Beginner-friendly estimate OR Intermediate estimate OR Advanced estimate",
    "rationale": "Fair rationale explaining why this issue may or may not be a reasonable starting point based on evidence.",
    "disclaimer": "This is an estimate based on the issue description. Repository architecture, build complexity, and undocumented dependencies may differ."
  },
  "uncertaintyNotes": "Explicit statement regarding what is not known without cloning and running the repository.",
  "contributionRoadmap": [
    { "title": "Understand the problem", "details": "..." },
    { "title": "Inspect relevant files", "details": "Search by terms from the issue; do not guess paths." },
    { "title": "Prepare the development environment", "details": "Follow verified repository setup instructions." },
    { "title": "Implement a focused fix", "details": "..." },
    { "title": "Run appropriate tests", "details": "Use tests or checks documented by the repository." },
    { "title": "Prepare the pull request", "details": "..." }
  ]
}`;

  return { systemPrompt, userPrompt };
}

/**
 * Call the configured local Ollama model and request JSON output.
 */
async function callOllama(config, systemPrompt, userPrompt, responseJsonSchema) {
  let payload;
  try {
    const response = await fetch(`${config.baseUrl}/api/chat`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(300_000),
      body: JSON.stringify({
        model: config.model, stream: false, think: false, format: responseJsonSchema || 'json',
        options: { temperature: 0.3, num_predict: 2200 },
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userPrompt }],
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      const error = new Error(response.status === 404 ? `Ollama model ${config.model} is unavailable. Run: ollama pull ${config.model}` : `Ollama request failed (${response.status})${detail ? `: ${detail.slice(0, 200)}` : '.'}`);
      error.status = response.status === 404 ? 503 : 502;
      throw error;
    }
    payload = await response.json();
  } catch (cause) {
    if (cause.status) throw cause;
    const timedOut = cause.name === 'TimeoutError' || cause.name === 'AbortError';
    const error = new Error(timedOut ? 'Local Ollama inference timed out. Try again or use a smaller model.' : 'Could not connect to local Ollama. Start Ollama and verify OLLAMA_BASE_URL.');
    error.status = timedOut ? 504 : 503;
    throw error;
  }

  const rawText = payload?.message?.content;
  if (!rawText) {
    const error = new Error('Ollama returned an empty response. Please retry with shorter issue details.');
    error.status = 502; throw error;
  }
  return cleanAndParseJson(rawText);
}

/**
 * Strip any markdown wraps and parse JSON safely
 */
function cleanAndParseJson(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  cleaned = cleaned.trim();

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt fallback extraction between first { and last }
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      const extracted = cleaned.substring(firstBrace, lastBrace + 1);
      return JSON.parse(extracted);
    }
    throw new Error(`Failed to parse AI output into JSON: ${err.message}`, { cause: err });
  }
}

/**
 * Main export: explain issue
 */
export async function explainIssue({ issue, repository, language = 'en', userSkills = [], experience = '' }) {
  const config = getAiConfig();

  if (!config.configured) {
    return {
      configured: false,
      provider: null,
      message: config.message,
    };
  }

  const { systemPrompt, userPrompt } = buildPrompts({
    issue,
    repository,
    language,
    userSkills,
    experience,
  });

  let explanation;
  explanation = await callOllama(config, systemPrompt, userPrompt, ISSUE_EXPLANATION_SCHEMA);

  return {
    configured: true,
    provider: config.provider,
    model: config.model,
    language,
    explanation: validateExplanation(explanation),
  };
}

function textOr(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function stringList(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string' && item.trim()).map((item) => item.trim()).slice(0, 12) : [];
}

function validateExplanation(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('AI returned an invalid explanation. Please try again.');
  }
  const readiness = value.skillReadiness && typeof value.skillReadiness === 'object' ? value.skillReadiness : {};
  const technicalTerms = Array.isArray(value.technicalTerms) ? value.technicalTerms
    .filter((item) => item && typeof item.term === 'string' && typeof item.definition === 'string')
    .slice(0, 12).map(({ term, definition }) => ({ term: term.trim(), definition: definition.trim() })) : [];
  const roadmapTitles = [
    'Understand the problem',
    'Inspect relevant files',
    'Prepare the development environment',
    'Implement a focused fix',
    'Run appropriate tests',
    'Prepare the pull request',
  ];
  const contributionRoadmap = Array.isArray(value.contributionRoadmap) && value.contributionRoadmap.length >= roadmapTitles.length
    ? roadmapTitles.map((title, index) => ({ title, details: typeof value.contributionRoadmap[index]?.details === 'string' ? value.contributionRoadmap[index].details.trim() : '' }))
    : [];
  const result = {
    problemSummary: textOr(value.problemSummary),
    expectedOutcome: textOr(value.expectedOutcome),
    relevantSkills: stringList(value.relevantSkills),
    technicalTerms,
    investigationSteps: stringList(value.investigationSteps),
    clarificationQuestions: stringList(value.clarificationQuestions),
    skillReadiness: {
      matchingSkills: stringList(readiness.matchingSkills),
      skillsToLearn: stringList(readiness.skillsToLearn),
      difficultyEstimate: textOr(readiness.difficultyEstimate, 'Difficulty could not be estimated from the supplied issue details.'),
      rationale: textOr(readiness.rationale),
      disclaimer: textOr(readiness.disclaimer, 'This is an estimate based only on the supplied issue and repository information.'),
    },
    uncertaintyNotes: textOr(value.uncertaintyNotes, 'Repository files and setup were not inspected. Verify paths and commands in the repository before contributing.'),
    contributionRoadmap,
  };
  if (!result.problemSummary || !result.expectedOutcome || result.contributionRoadmap.length !== roadmapTitles.length || result.contributionRoadmap.some((step) => !step.details)) {
    throw new Error('AI returned an incomplete explanation or contribution roadmap. Please try again.');
  }
  return result;
}

/** Rank only the real issues supplied by the repository search. */
export async function recommendIssues({ repository, issues, userSkills = [], experience = '' }) {
  const config = getAiConfig();
  if (!config.configured) {
    return { configured: false, message: getAiConfig().message, recommendations: [] };
  }

  const issueEvidence = issues.slice(0, 20).map((issue) => ({
    number: issue.number,
    title: issue.title,
    labels: (issue.labels || []).map((label) => label.name),
    description: (issue.body || issue.body_excerpt || '').slice(0, 1000),
    url: issue.html_url,
  }));
  const systemPrompt = 'You help beginners evaluate real open-source issues. Use only the supplied repository and issue evidence. Never infer unseen codebase details or guarantee suitability. Return only valid JSON.';
  const userPrompt = `Review these actual open issues from ${repository.full_name} for a contributor. Rank by evidence in the description and fit to stated skills and experience; labels are only signals.
Repository language: ${repository.language || 'not provided'}
Repository description: ${repository.description || 'not provided'}
Repository topics: ${(repository.topics || []).join(', ') || 'not provided'}
Contributor skills: ${userSkills.join(', ') || 'not provided'}
Experience: ${experience || 'not provided'}
Issues: ${JSON.stringify(issueEvidence)}

Return JSON with a "recommendations" array containing at most 3 entries. Each entry must use an exact issue number from the supplied data and include "issueNumber", "fitReason" grounded in the title/body/labels (at most two concise sentences), "skillsMatch" (array containing only stated contributor skills), and "missingInformation" (at most two concise items describing what cannot be determined from this data). Prefer issues where evidence aligns with stated skills and experience; do not treat labels as proof of beginner suitability. Do not create issue numbers, repository paths, or technical claims not present in the input. Keep the entire response concise.`;

  const rawRecommendations = await callOllama(config, systemPrompt, userPrompt, ISSUE_RECOMMENDATION_SCHEMA);
  if (!rawRecommendations || !Array.isArray(rawRecommendations.recommendations)) {
    throw new Error('AI returned an invalid recommendation response. Please try again.');
  }
  const issuesByNumber = new Map(issues.map((issue) => [Number(issue.number), issue]));
  const recommendations = rawRecommendations.recommendations
    .filter((item) => issuesByNumber.has(Number(item.issueNumber)) && typeof item.fitReason === 'string' && item.fitReason.trim())
    .slice(0, 3)
    .map((item) => ({
      issueNumber: Number(item.issueNumber),
      fitReason: item.fitReason,
      skillsMatch: Array.isArray(item.skillsMatch) ? item.skillsMatch
        .filter((skill) => typeof skill === 'string' && userSkills.some((userSkill) => userSkill.toLowerCase() === skill.toLowerCase())) : [],
      missingInformation: Array.isArray(item.missingInformation)
        ? item.missingInformation.filter((detail) => typeof detail === 'string')
        : [],
    }));

  return { configured: true, provider: config.provider, model: config.model, recommendations };
}
