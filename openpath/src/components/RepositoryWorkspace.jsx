import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowLeft, ArrowRight, BookOpen, Check, ExternalLink, GitBranch, LoaderCircle, Sparkles, Star } from 'lucide-react';
import IssueDiscovery from './IssueDiscovery';
import { getAiStatus, getRepositoryWorkspace, recommendGithubIssues, searchGithubRepositories } from '../services/api';

const SKILL_PRESETS = ['JavaScript', 'TypeScript', 'React', 'Python', 'HTML & CSS', 'Git', 'Documentation'];
const EXPERIENCE_OPTIONS = ['New to open source', 'Made a few contributions', 'Contribute regularly'];

function loadSavedExperience() {
  try {
    const saved = localStorage.getItem('openpath_user_experience');
    return EXPERIENCE_OPTIONS.includes(saved) ? saved : EXPERIENCE_OPTIONS[0];
  } catch {
    return EXPERIENCE_OPTIONS[0];
  }
}

function parseRepositoryInput(value) {
  const input = value.trim();
  if (!input) throw new Error('Enter a public GitHub repository URL or owner/repository.');
  let url;
  try {
    url = new URL(input.includes('://') ? input : `https://github.com/${input}`);
  } catch {
    throw new Error('That does not look like a valid GitHub repository URL.');
  }
  if (!['https:', 'http:'].includes(url.protocol) || !['github.com', 'www.github.com'].includes(url.hostname.toLowerCase()) || url.username || url.password) {
    throw new Error('Use a repository hosted on github.com.');
  }
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length !== 2 || url.search || url.hash) throw new Error('Enter a repository URL with only its owner and repository name.');
  if (!parts.every((part) => /^[A-Za-z0-9_.-]+$/.test(part))) throw new Error('That does not look like a valid GitHub repository URL.');
  return { owner: parts[0], repo: parts[1].replace(/\.git$/i, '') };
}

export default function RepositoryWorkspace({
  program,
  userSkills,
  onUpdateUserSkills,
  onSelectIssue,
  onBack,
  onOpenSetupModal,
}) {
  const [repoInput, setRepoInput] = useState('');
  const [workspace, setWorkspace] = useState(null);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState('');
  const [issues, setIssues] = useState([]);
  const [experience, setExperience] = useState(loadSavedExperience);
  const [aiStatus, setAiStatus] = useState({ loading: true, configured: false });
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [recommendationError, setRecommendationError] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [customSkill, setCustomSkill] = useState('');
  const [repositoryQuery, setRepositoryQuery] = useState('');
  const [repositoryResults, setRepositoryResults] = useState([]);
  const [repositorySearchLoading, setRepositorySearchLoading] = useState(false);
  const [repositorySearchError, setRepositorySearchError] = useState('');
  const [repositorySearchSubmitted, setRepositorySearchSubmitted] = useState(false);

  useEffect(() => {
    let active = true;
    getAiStatus().then((status) => {
      if (active) setAiStatus({ loading: false, ...status });
    });
    return () => { active = false; };
  }, []);

  const recommendedIssues = useMemo(() => {
    if (!recommendations) return [];
    const byNumber = new Map(issues.map((issue) => [Number(issue.number), issue]));
    return recommendations.map((recommendation) => ({
      ...recommendation,
      issue: byNumber.get(Number(recommendation.issueNumber)),
    })).filter((recommendation) => recommendation.issue);
  }, [issues, recommendations]);

  const loadRepository = async (target) => {
    setRecommendations(null);
    setRecommendationError('');
    setRepoLoading(true);
    setWorkspace(null);
    setIssues([]);
    try {
      const data = await getRepositoryWorkspace(target.owner, target.repo);
      setWorkspace(data);
      setRepoInput(data.repository.html_url);
    } catch (error) {
      setRepoError(error.message || 'Could not load this repository.');
    } finally {
      setRepoLoading(false);
    }
  };

  const inspectRepository = async (event) => {
    event.preventDefault();
    setRepoError('');
    try {
      await loadRepository(parseRepositoryInput(repoInput));
    } catch (error) {
      setRepoError(error.message);
    }
  };

  const browseRepositories = async (event) => {
    event.preventDefault();
    setRepositorySearchSubmitted(true);
    setRepositorySearchError('');
    setRepositorySearchLoading(true);
    try {
      const data = await searchGithubRepositories({ query: repositoryQuery });
      setRepositoryResults(data.items || []);
    } catch (error) {
      setRepositorySearchError(error.message || 'Could not search GitHub repositories.');
      setRepositoryResults([]);
    } finally {
      setRepositorySearchLoading(false);
    }
  };

  const addSkill = (skill) => {
    const value = skill.trim();
    if (value && !userSkills.some((item) => item.toLowerCase() === value.toLowerCase())) {
      onUpdateUserSkills([...userSkills, value]);
    }
    setCustomSkill('');
  };

  const updateExperience = (value) => {
    setExperience(value);
    try {
      localStorage.setItem('openpath_user_experience', value);
    } catch (error) {
      console.warn('Could not save OpenPath experience to local storage.', error);
    }
  };

  const requestRecommendations = async () => {
    if (!workspace || issues.length === 0) return;
    setRecommendationLoading(true);
    setRecommendationError('');
    setRecommendations(null);
    try {
      const result = await recommendGithubIssues({
        repository: workspace.repository,
        issues,
        userSkills,
        experience,
      });
      if (!result.configured) {
        setRecommendationError(result.message || 'Start Ollama and install the configured model to request recommendations.');
      } else {
        setRecommendations(result.recommendations || []);
      }
    } catch (error) {
      setRecommendationError(error.message || 'Issue analysis failed.');
    } finally {
      setRecommendationLoading(false);
    }
  };

  return (
    <main style={{ flex: 1, padding: '38px 0 72px', background: 'var(--bg-canvas)' }}>
      <div className="container">
        <button type="button" onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: '22px' }}>
          <ArrowLeft size={15} /> {program ? 'Back to programs' : 'Back to OpenPath'}
        </button>
        <div style={{ maxWidth: '760px', marginBottom: '28px' }}>
          <span className="badge badge-subtle badge-mono" style={{ marginBottom: '10px' }}>PROJECT SELECTION · REPOSITORY WORKSPACE</span>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '10px' }}>Start with a repository</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            {program ? <>Optional program context: <strong>{program.name}</strong>. You can still search for or paste any public GitHub repository. OpenPath does not verify whether a repository participates in this program; check the official program site.</> : 'Start with any public GitHub repository URL or search for a repository. OpenPath will load real metadata, available onboarding docs, and open issues.'}
          </p>
        </div>

        <section aria-labelledby="skills-heading" className="card-light" style={{ maxWidth: '800px', marginBottom: '22px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <h2 id="skills-heading" style={{ fontSize: '20px', marginBottom: '4px' }}>What have you worked with?</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Set your skills and experience before choosing a repository. You can update them at any time.</p>
            </div>
            <label style={{ display: 'grid', gap: '5px', fontSize: '12px', color: 'var(--text-secondary)' }}>
              Experience
              <select value={experience} onChange={(event) => updateExperience(event.target.value)} className="select-custom" style={{ minWidth: '210px' }}>
                {EXPERIENCE_OPTIONS.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', margin: '16px 0 12px' }}>
            {userSkills.map((skill) => <button type="button" key={skill} onClick={() => onUpdateUserSkills(userSkills.filter((item) => item !== skill))} className="badge badge-lime" aria-label={`Remove ${skill}`} title="Remove skill">{skill} ×</button>)}
            {SKILL_PRESETS.filter((skill) => !userSkills.some((item) => item.toLowerCase() === skill.toLowerCase())).map((skill) => <button type="button" key={skill} onClick={() => addSkill(skill)} className="btn btn-outline btn-sm">+ {skill}</button>)}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); addSkill(customSkill); }} style={{ display: 'flex', gap: '8px', maxWidth: '460px' }}>
            <label htmlFor="custom-skill" className="sr-only">Add a skill</label>
            <input id="custom-skill" value={customSkill} onChange={(event) => setCustomSkill(event.target.value)} className="input-text" placeholder="Add another skill" />
            <button type="submit" className="btn btn-outline btn-sm" disabled={!customSkill.trim()}>Add</button>
          </form>
        </section>

        <section aria-labelledby="repository-search-heading" className="card-light" style={{ maxWidth: '800px', marginBottom: '22px' }}>
          <h2 id="repository-search-heading" style={{ fontSize: '18px', marginBottom: '6px' }}>Browse GitHub repositories</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '14px' }}>Search real public repositories by name, topic, or language. These results come from GitHub and are not program-participation listings.</p>
          <form onSubmit={browseRepositories} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            <label htmlFor="repository-search" className="sr-only">Search repositories by topic, language, or name</label>
            <input id="repository-search" value={repositoryQuery} onChange={(event) => setRepositoryQuery(event.target.value)} className="input-text" placeholder="e.g. React, Python CLI, accessibility" style={{ flex: '1 1 320px' }} />
            <button type="submit" className="btn btn-outline" disabled={repositorySearchLoading || !repositoryQuery.trim()}>
              {repositorySearchLoading ? <LoaderCircle size={15} className="animate-spin" /> : <GitBranch size={15} />}
              {repositorySearchLoading ? 'Searching…' : 'Search repositories'}
            </button>
          </form>
          {repositorySearchError && <p role="alert" style={{ color: '#B91C1C', fontSize: '13px', marginTop: '12px' }}>{repositorySearchError}</p>}
          {repositorySearchSubmitted && !repositorySearchLoading && !repositorySearchError && repositoryResults.length === 0 && <p role="status" style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '12px' }}>No public repositories matched that search. Try another topic or language.</p>}
          {repositoryResults.length > 0 && (
            <div aria-label="GitHub repository search results" style={{ display: 'grid', gap: '10px', marginTop: '16px' }}>
              {repositoryResults.map((repository) => (
                <article key={repository.id} style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', gap: '14px', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: '1 1 320px' }}>
                    <h3 style={{ fontSize: '15px', marginBottom: '3px' }}>{repository.full_name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{repository.description || 'No description provided.'}</p>
                    <p style={{ color: 'var(--text-tertiary)', fontSize: '11px', marginTop: '5px' }}>{repository.language || 'Language not specified'} · {repository.stars.toLocaleString()} stars · {repository.open_issues.toLocaleString()} open issues</p>
                  </div>
                  <button type="button" className="btn btn-dark btn-sm" disabled={repoLoading} onClick={() => { setRepoInput(repository.html_url); setRepoError(''); setRepositoryResults([]); setRepositorySearchSubmitted(false); loadRepository({ owner: repository.owner, repo: repository.name }); }}>
                    Select repository <ArrowRight size={14} />
                  </button>
                </article>
              ))}
              <p style={{ color: 'var(--text-tertiary)', fontSize: '11px' }}>Select a result to load its repository context and real issue list below.</p>
            </div>
          )}
        </section>

        <form onSubmit={inspectRepository} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', maxWidth: '800px', marginBottom: '20px' }}>
          <label htmlFor="repository-url" className="sr-only">GitHub repository URL</label>
          <input id="repository-url" value={repoInput} onChange={(event) => setRepoInput(event.target.value)} className="input-text" placeholder="https://github.com/owner/repository" autoComplete="url" style={{ flex: '1 1 360px' }} />
          <button type="submit" className="btn btn-primary" disabled={repoLoading}>
            {repoLoading ? <LoaderCircle size={16} className="animate-spin" /> : <GitBranch size={16} />}
            {repoLoading ? 'Loading repository…' : 'Open repository'}
          </button>
        </form>
        {repoError && <p role="alert" style={{ color: '#B91C1C', marginBottom: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}><AlertCircle size={16} />{repoError}</p>}

        {workspace && (
          <>
            <section aria-labelledby="repo-summary" className="card-light" style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-between' }}>
              <div style={{ flex: '1 1 340px' }}>
                <span className="badge badge-dark-lime badge-mono" style={{ marginBottom: '10px' }}>{workspace.repository.language || 'Language not specified'}</span>
                <h2 id="repo-summary" style={{ fontSize: '24px', marginBottom: '6px' }}>{workspace.repository.full_name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{workspace.repository.description || 'This repository has no published description.'}</p>
                {workspace.repository.topics.length > 0 && <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '12px' }}>{workspace.repository.topics.slice(0, 8).map((topic) => <span key={topic} className="badge badge-subtle">{topic}</span>)}</div>}
              </div>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'inline-flex', gap: '5px', alignItems: 'center' }}><Star size={15} />{workspace.repository.stars.toLocaleString()} stars</span>
                <span>{workspace.repository.open_issues.toLocaleString()} open issues</span>
                <a href={workspace.repository.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">GitHub repository <ExternalLink size={13} /></a>
              </div>
            </section>

            <section aria-label="Repository onboarding documents" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '14px', marginBottom: '28px' }}>
              <DocumentCard title="Contribution guidelines" icon={<Check size={16} />} document={workspace.contributingGuide} emptyText="No CONTRIBUTING.md was found in the usual repository locations." />
              <DocumentCard title="Repository README" icon={<BookOpen size={16} />} document={workspace.readme} emptyText="No README was found in the usual repository locations." />
            </section>

            <section aria-labelledby="recommendations-controls-heading" className="card-light" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h2 id="recommendations-controls-heading" style={{ fontSize: '20px', marginBottom: '4px' }}>Issue recommendations</h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Use your selected repository, open issues, skills, and experience for the next step.</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '18px' }}>
                <button type="button" className="btn btn-dark" onClick={requestRecommendations} disabled={!aiStatus.configured || !issues.length || recommendationLoading}>
                  {recommendationLoading ? <LoaderCircle size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  {recommendationLoading ? 'Reviewing issues…' : 'Recommend issues with AI'}
                </button>
                {aiStatus.loading && <span role="status" style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>Checking AI configuration…</span>}
                {!aiStatus.loading && !aiStatus.configured && <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>AI is not configured. Repository browsing and issue search still work.</span>}
              </div>
              {!aiStatus.loading && !aiStatus.configured && <button type="button" onClick={onOpenSetupModal} className="btn btn-ghost btn-sm" style={{ marginTop: '4px' }}>View AI setup instructions</button>}
              {recommendationError && <p role="alert" style={{ color: '#B91C1C', fontSize: '13px', marginTop: '12px' }}>{recommendationError}</p>}
              {recommendations && <p role="status" style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '10px' }}>Suggestions compare the supplied issue text, labels, and your stated experience. They are estimates; repository code and maintainer context may change the fit.</p>}
            </section>

            {recommendations && (
              <section aria-labelledby="recommendations-heading" style={{ marginBottom: '30px' }}>
                <h2 id="recommendations-heading" style={{ fontSize: '22px', marginBottom: '14px' }}>A few issues to consider</h2>
                {recommendedIssues.length === 0 ? (
                  <p role="status" style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>The AI did not identify a supported recommendation from this issue set. Browse the issues below or adjust your skills.</p>
                ) : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {recommendedIssues.map(({ issue, fitReason, skillsMatch, missingInformation }) => (
                    <article key={issue.id} className="card-light" style={{ display: 'grid', gap: '10px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px' }}>
                        <div><span className="badge badge-subtle badge-mono">#{issue.number}</span><h3 style={{ display: 'inline', marginLeft: '8px', fontSize: '16px' }}>{issue.title}</h3></div>
                        <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">Original issue <ExternalLink size={13} /></a>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}><strong>Why it may fit:</strong> {fitReason}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}><strong>Skills mentioned:</strong> {skillsMatch.length ? skillsMatch.join(', ') : 'No direct skill match was returned.'}</p>
                      <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}><strong>Still unknown:</strong> {missingInformation.length ? missingInformation.join('; ') : 'The supplied issue text does not reveal maintainer expectations or repository setup complexity.'}</p>
                      <button type="button" onClick={() => onSelectIssue(issue, workspace.repository, experience)} className="btn btn-dark btn-sm" style={{ justifySelf: 'start' }}>Understand this issue <ArrowRight size={14} /></button>
                    </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            <IssueDiscovery
              key={workspace.repository.full_name}
              repository={workspace.repository}
              onIssuesLoaded={setIssues}
              onSelectIssue={(issue) => onSelectIssue(issue, workspace.repository, experience)}
            />
          </>
        )}
      </div>
    </main>
  );
}

function DocumentCard({ title, icon, document, emptyText }) {
  return (
    <details className="card-light" style={{ padding: '0' }}>
      <summary style={{ padding: '16px 18px', display: 'flex', gap: '8px', alignItems: 'center', cursor: 'pointer', fontWeight: 600, listStyle: 'none' }}>
        {icon} {title} {document ? <span className="badge badge-lime" style={{ marginLeft: 'auto' }}>{document.path}</span> : <span className="badge badge-subtle" style={{ marginLeft: 'auto' }}>Not found</span>}
      </summary>
      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '14px 18px' }}>
        {document ? <>
          <a href={document.url} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm" style={{ marginBottom: '8px' }}>View on GitHub <ExternalLink size={12} /></a>
          <pre style={{ maxHeight: '220px', overflow: 'auto', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>{document.content || 'This document could not be decoded for preview.'}</pre>
        </> : <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{emptyText}</p>}
      </div>
    </details>
  );
}
