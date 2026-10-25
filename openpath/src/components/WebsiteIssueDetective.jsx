import { useState } from 'react';
import { AlertCircle, ArrowLeft, ExternalLink, Eye, LoaderCircle, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { analyzeWebsite } from '../services/api';

function validateInput(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('Enter a valid public website URL, such as https://example.org.');
  }
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP and HTTPS URLs are supported.');
  if (url.username || url.password) throw new Error('Website URLs cannot include a username or password.');
  return url.toString();
}

const severityColors = {
  low: { background: '#ECFDF5', color: '#047857' },
  medium: { background: '#FFFBEB', color: '#B45309' },
  high: { background: '#FEF2F2', color: '#B91C1C' },
};

export default function WebsiteIssueDetective({ onBack }) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setAnalysis(null);
    let normalizedUrl;
    try {
      normalizedUrl = validateInput(websiteUrl);
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    setLoading(true);
    try {
      setAnalysis(await analyzeWebsite(normalizedUrl));
    } catch (requestError) {
      setError(requestError.message || 'Could not analyze this website. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ flex: 1, paddingTop: '42px', paddingBottom: '72px' }}>
      <button type="button" onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: '20px' }}>
        <ArrowLeft size={15} /> Back to OpenPath
      </button>

      <section className="card-light" style={{ maxWidth: '880px', margin: '0 auto 24px' }}>
        <span className="badge badge-subtle badge-mono" style={{ marginBottom: '12px' }}>WEBSITE ISSUE DETECTIVE</span>
        <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', marginBottom: '10px' }}>Look for a contribution opportunity on a website</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          Enter a public website URL. OpenPath captures the visible page and asks a vision model to suggest specific, evidence-backed improvements. No GitHub repository is needed.
        </p>
        <form onSubmit={submit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <label htmlFor="website-analysis-url" style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}>Public website URL</label>
          <input
            id="website-analysis-url"
            type="url"
            inputMode="url"
            autoComplete="url"
            value={websiteUrl}
            onChange={(event) => setWebsiteUrl(event.target.value)}
            placeholder="https://example.org"
            className="input-text"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'website-analysis-error' : 'website-analysis-help'}
            style={{ flex: '1 1 340px' }}
            required
          />
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <LoaderCircle size={16} className="spin" /> : <Search size={16} />}
            {loading ? 'Inspecting website…' : 'Inspect website'}
          </button>
        </form>
        <p id="website-analysis-help" style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '10px' }}>
          Only public HTTP/HTTPS sites are accepted. OpenPath blocks local and private network destinations.
        </p>
        {error && <p id="website-analysis-error" role="alert" style={{ color: '#B91C1C', marginTop: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}><AlertCircle size={17} style={{ flex: '0 0 auto', marginTop: '3px' }} />{error}</p>}
        {loading && <p role="status" style={{ color: 'var(--text-secondary)', marginTop: '14px' }}>Opening the page, collecting evidence, and running the vision review. It may take a minute or more.</p>}
      </section>

      {analysis && (
        <div style={{ maxWidth: '880px', margin: '0 auto', display: 'grid', gap: '20px' }}>
          <section className="card-light" aria-labelledby="website-analysis-result-heading">
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px' }}>
              <div>
                <span className="badge badge-subtle badge-mono" style={{ marginBottom: '10px' }}><Eye size={12} /> CAPTURED PAGE</span>
                <h2 id="website-analysis-result-heading" style={{ fontSize: '22px', marginBottom: '4px' }}>{analysis.title || 'Website analysis'}</h2>
                <a href={analysis.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', fontSize: '13px', overflowWrap: 'anywhere' }}>{analysis.url} <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /></a>
                {analysis.description && <p style={{ color: 'var(--text-secondary)', marginTop: '10px' }}>{analysis.description}</p>}
              </div>
              <span className="badge badge-subtle"><Sparkles size={12} /> Gemma vision review</span>
            </div>
            <img src={analysis.screenshot} alt={`Captured screenshot of ${analysis.url}`} style={{ display: 'block', width: '100%', maxHeight: '520px', objectFit: 'contain', objectPosition: 'top', marginTop: '18px', background: '#F3F4F6', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }} />
          </section>

          <section className="card-light" aria-labelledby="verified-observations-heading">
            <h2 id="verified-observations-heading" style={{ fontSize: '19px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} /> Verified page observations</h2>
            <ul style={{ display: 'grid', gap: '8px', paddingLeft: '20px', color: 'var(--text-secondary)' }}>
              {analysis.verifiedObservations.map((observation, index) => <li key={`${observation.label}-${index}`}><strong style={{ color: 'var(--text-primary)' }}>{observation.label}:</strong> {observation.value}</li>)}
            </ul>
          </section>

          <section aria-labelledby="potential-findings-heading">
            <div style={{ marginBottom: '12px' }}>
              <h2 id="potential-findings-heading" style={{ fontSize: '22px' }}>Potential contribution issues</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>These are AI inferences grounded in this page capture, not confirmed defects. Review before acting; nothing is published automatically.</p>
            </div>
            {analysis.findings.length === 0 ? (
              <div className="card-light" role="status" style={{ color: 'var(--text-secondary)' }}>No specific, well-evidenced potential issues were found on this page. Try a different public page or review its project’s own contribution channels.</div>
            ) : (
              <div style={{ display: 'grid', gap: '14px' }}>
                {analysis.findings.map((finding, index) => (
                  <article className="card-light" key={`${finding.title}-${index}`} style={{ display: 'grid', gap: '10px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ flex: '1 1 280px', fontSize: '17px' }}>{finding.title}</h3>
                      <span className="badge badge-subtle">{finding.category}</span>
                      <span className="badge" style={severityColors[finding.severity]}>{finding.severity} severity</span>
                      <span className="badge badge-subtle">{finding.assessment}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)' }}>{finding.explanation}</p>
                    <p style={{ padding: '10px 12px', borderLeft: '3px solid var(--accent-lime-dim)', background: 'var(--bg-subtle)', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0', fontSize: '13px' }}><strong>Evidence ({finding.evidence.source === 'page_text' ? 'captured page text' : 'screenshot'}):</strong> “{finding.evidence.quote}”</p>
                    <p style={{ fontSize: '13px' }}><strong>Suggested fix:</strong> {finding.suggestedFix}</p>
                  </article>
                ))}
              </div>
            )}
          </section>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '12px' }}>{analysis.notice}</p>
        </div>
      )}
    </main>
  );
}
