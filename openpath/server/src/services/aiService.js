/**
 * AI Explanation Service
 * Supports multiple configurable providers: Gemini, OpenAI, Groq, and OpenAI-compatible endpoints.
 * Never invents fake AI output when unconfigured; explicitly informs the user.
 */

export function getAiConfig() {
  const provider = (process.env.AI_PROVIDER || '').toLowerCase();
  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;
  const genericKey = process.env.AI_API_KEY;

  if (provider === 'gemini' && geminiKey) {
    return {
      configured: true,
      provider: 'gemini',
      apiKey: geminiKey,
      model: process.env.AI_MODEL || 'gemini-2.5-flash',
    };
  }
  if (provider === 'openai' && openaiKey) {
    return {
      configured: true,
      provider: 'openai',
      apiKey: openaiKey,
      model: process.env.AI_MODEL || 'gpt-4o-mini',
    };
  }
  if (provider === 'groq' && groqKey) {
    return {
      configured: true,
      provider: 'groq',
      apiKey: groqKey,
      model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
    };
  }

  // Auto-detect based on whichever key is present if AI_PROVIDER was not specified
  if (geminiKey) {
    return {
      configured: true,
      provider: 'gemini',
      apiKey: geminiKey,
      model: process.env.AI_MODEL || 'gemini-2.5-flash',
    };
  }
  if (groqKey) {
    return {
      configured: true,
      provider: 'groq',
      apiKey: groqKey,
      model: process.env.AI_MODEL || 'llama-3.3-70b-versatile',
    };
  }
  if (openaiKey) {
    return {
      configured: true,
      provider: 'openai',
      apiKey: openaiKey,
      model: process.env.AI_MODEL || 'gpt-4o-mini',
    };
  }
  if (genericKey) {
    return {
      configured: true,
      provider: 'openai-compatible',
      apiKey: genericKey,
      model: process.env.AI_MODEL || 'default',
      baseUrl: process.env.AI_BASE_URL || 'https://api.openai.com/v1',
    };
  }

  return {
    configured: false,
    provider: null,
    model: null,
    message:
      'AI Provider not configured. Set GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY in server/.env to enable live AI explanations.',
  };
}

/**
 * Build system and user prompt for issue explanation
 */
function buildPrompts({ issue, repository, language = 'en', userSkills = [] }) {
  const isHinglish = language === 'hinglish';

  const systemPrompt = `You are OpenPath's AI mentor for first-time open-source contributors.
Your job is to break down real GitHub issues into actionable, beginner-friendly explanations.
Important principles:
1. Ground your answer ONLY in the provided issue title, description, labels, and repository metadata.
2. Never claim you have executed or inspected unseen repository code. Make uncertainty explicit where the issue is ambiguous.
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
${issue.body ? issue.body.slice(0, 3500) : 'No description provided in issue body.'}

CONTRIBUTOR'S STATED SKILLS:
${userSkillsFormatted}

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
  "uncertaintyNotes": "Explicit statement regarding what is not known without cloning and running the repository."
}`;

  return { systemPrompt, userPrompt };
}

/**
 * Call Gemini API using native fetch
 */
async function callGemini(config, systemPrompt, userPrompt) {
  // Support Gemini v1beta endpoint
  const model = config.model || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: `${systemPrompt}\n\n${userPrompt}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      responseMimeType: 'application/json',
    },
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error('Gemini API returned an empty response candidate');
  }

  return cleanAndParseJson(rawText);
}

/**
 * Call OpenAI or OpenAI-compatible endpoint (including Groq)
 */
async function callOpenAiCompatible(config, systemPrompt, userPrompt) {
  const baseUrl =
    config.provider === 'groq'
      ? 'https://api.groq.com/openai/v1'
      : config.baseUrl || 'https://api.openai.com/v1';

  const url = `${baseUrl}/chat/completions`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`${config.provider.toUpperCase()} API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const rawText = data?.choices?.[0]?.message?.content;
  if (!rawText) {
    throw new Error('AI provider returned an empty completion content');
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
    throw new Error(`Failed to parse AI output into JSON: ${err.message}`);
  }
}

/**
 * Main export: explain issue
 */
export async function explainIssue({ issue, repository, language = 'en', userSkills = [] }) {
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
  });

  let explanation;
  if (config.provider === 'gemini') {
    explanation = await callGemini(config, systemPrompt, userPrompt);
  } else {
    explanation = await callOpenAiCompatible(config, systemPrompt, userPrompt);
  }

  return {
    configured: true,
    provider: config.provider,
    model: config.model,
    language,
    explanation,
  };
}
