import { useState, useEffect } from 'react';
import {
  X,
  ExternalLink,
  Sparkles,
  HelpCircle,
  FolderSearch,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  BrainCircuit,
  Milestone,
  RefreshCw,
  Info,
} from 'lucide-react';
import { explainIssueWithAi, getIssueDetails } from '../services/api';
import SkillReadinessCard from './SkillReadinessCard';
import ContributionRoadmap from './ContributionRoadmap';

export default function AiExplainerModal({
  issue,
  onClose,
  userSkills,
  onUpdateUserSkills,
  onOpenSetupModal,
}) {
  const [activeTab, setActiveTab] = useState('explainer'); // 'explainer', 'readiness', 'roadmap'
  const [language, setLanguage] = useState('en'); // 'en' | 'hinglish'

  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);
  const [detailedRepo, setDetailedRepo] = useState(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  // Fetch issue details & trigger AI explanation
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      if (!issue) return;
      setLoading(true);
      setError(null);
      setAiResult(null);

      try {
        // Fetch detailed repo data if available
        let repoData = null;
        if (issue.repo_owner && issue.repo_short_name) {
          try {
            const details = await getIssueDetails(
              issue.repo_owner,
              issue.repo_short_name,
              issue.number
            );
            if (!isCancelled) {
              repoData = details.repository;
              setDetailedRepo(repoData);
            }
          } catch {
            // Non-fatal if details endpoint fails; issue object already contains primary fields
          }
        }

        // Call AI explanation endpoint
        const explanationData = await explainIssueWithAi({
          issue,
          repository: repoData,
          language,
          userSkills,
        });

        if (!isCancelled) {
          setAiResult(explanationData);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || 'Failed to explain issue.');
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isCancelled = true;
    };
  }, [issue, language, userSkills]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!issue) return null;

  const explanation = aiResult?.explanation;

  const copyEnvSnippet = () => {
    navigator.clipboard.writeText(`GEMINI_API_KEY=your_key_here\n# or\nOPENAI_API_KEY=your_key_here`);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge badge-subtle badge-mono" style={{ fontSize: '12px' }}>
                {issue.repo_name}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--text-tertiary)' }}>
                #{issue.number}
              </span>
              {detailedRepo?.stars && (
                <span className="badge badge-subtle badge-mono" style={{ fontSize: '11px' }}>
                  ★ {detailedRepo.stars.toLocaleString()}
                </span>
              )}
            </div>

            <h2
              style={{
                fontSize: '19px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: '1.3',
                marginBottom: '6px',
              }}
            >
              {issue.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12.5px',
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                View original issue on GitHub <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '6px', color: 'var(--text-tertiary)' }}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs & Language Switcher */}
        <div
          style={{
            padding: '8px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          {/* Tab buttons */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('explainer')}
              className="btn btn-sm"
              style={{
                backgroundColor: activeTab === 'explainer' ? 'var(--dark-bg)' : 'transparent',
                color: activeTab === 'explainer' ? '#FFFFFF' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === 'explainer' ? 'var(--dark-bg)' : 'transparent'}`,
              }}
            >
              <Sparkles size={14} color={activeTab === 'explainer' ? 'var(--accent-lime)' : 'currentColor'} />
              AI Explanation
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('readiness')}
              className="btn btn-sm"
              style={{
                backgroundColor: activeTab === 'readiness' ? 'var(--dark-bg)' : 'transparent',
                color: activeTab === 'readiness' ? '#FFFFFF' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === 'readiness' ? 'var(--dark-bg)' : 'transparent'}`,
              }}
            >
              <BrainCircuit size={14} />
              Skill Readiness
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('roadmap')}
              className="btn btn-sm"
              style={{
                backgroundColor: activeTab === 'roadmap' ? 'var(--dark-bg)' : 'transparent',
                color: activeTab === 'roadmap' ? '#FFFFFF' : 'var(--text-secondary)',
                border: `1px solid ${activeTab === 'roadmap' ? 'var(--dark-bg)' : 'transparent'}`,
              }}
            >
              <Milestone size={14} />
              Contribution Checklist
            </button>
          </div>

          {/* Language Toggle: English vs Hinglish */}
          {activeTab === 'explainer' && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '2px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <button
                type="button"
                onClick={() => setLanguage('en')}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: language === 'en' ? '#FFFFFF' : 'transparent',
                  color: language === 'en' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: language === 'en' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                🇬🇧 Simple English
              </button>

              <button
                type="button"
                onClick={() => setLanguage('hinglish')}
                style={{
                  padding: '4px 10px',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: language === 'hinglish' ? '#FFFFFF' : 'transparent',
                  color: language === 'hinglish' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: language === 'hinglish' ? 'var(--shadow-sm)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                🇮🇳 Hinglish
              </button>
            </div>
          )}
        </div>

        {/* Modal Body Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, backgroundColor: 'var(--bg-canvas)' }}>
          {/* TAB 1: AI EXPLAINER */}
          {activeTab === 'explainer' && (
            <div>
              {/* Loading State */}
              {loading && (
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                  <RefreshCw
                    size={28}
                    className="animate-spin"
                    color="var(--text-secondary)"
                    style={{ margin: '0 auto 16px' }}
                  />
                  <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '6px' }}>
                    Analyzing issue with AI...
                  </h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    Reading issue description, labels, and extracting technical keywords ({language === 'hinglish' ? 'Hinglish Mode' : 'Simple English'}).
                  </p>
                </div>
              )}

              {/* Unconfigured Honest State */}
              {!loading && aiResult && !aiResult.configured && (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '32px 24px',
                    textAlign: 'left',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--accent-amber-tint)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-amber)',
                      }}
                    >
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        AI Explanations Require Provider Configuration
                      </h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        OpenPath never substitutes fabricated AI responses.
                      </p>
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      lineHeight: '1.5',
                      marginBottom: '18px',
                    }}
                  >
                    To generate live issue breakdowns in simple English and Hinglish, add an API key in{' '}
                    <code style={{ fontSize: '13px', fontFamily: 'var(--font-mono)' }}>server/.env</code>.
                    You can use Google Gemini (free API key available on Google AI Studio), Groq, or OpenAI.
                  </p>

                  <div
                    style={{
                      backgroundColor: '#111215',
                      color: '#E5E7EB',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      marginBottom: '20px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ color: '#9CA3AF', marginBottom: '6px' }}># In server/.env:</div>
                    <div style={{ color: 'var(--accent-lime)' }}>AI_PROVIDER=gemini</div>
                    <div>GEMINI_API_KEY=your_gemini_key_from_aistudio</div>
                    <div style={{ color: '#6B7280', marginTop: '6px' }}># OR for OpenAI:</div>
                    <div>OPENAI_API_KEY=your_openai_key</div>

                    <button
                      type="button"
                      onClick={copyEnvSnippet}
                      className="btn btn-ghost btn-sm"
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        color: '#D1D5DB',
                        fontSize: '11px',
                        padding: '4px 8px',
                        backgroundColor: '#1F2228',
                      }}
                    >
                      {copiedEnv ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                      {copiedEnv ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      onClick={() => setActiveTab('readiness')}
                      className="btn btn-primary btn-sm"
                    >
                      Check Skill Readiness & Roadmap
                    </button>
                    {onOpenSetupModal && (
                      <button
                        type="button"
                        onClick={onOpenSetupModal}
                        className="btn btn-outline btn-sm"
                      >
                        Open Setup Guide
                      </button>
                    )}
                    <a
                      href="https://aistudio.google.com/app/apikey"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                    >
                      Get Free Gemini Key <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              )}

              {/* Error State */}
              {!loading && error && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    color: '#991B1B',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <AlertCircle size={18} />
                    <h4 style={{ fontSize: '15px', fontWeight: 600 }}>AI Analysis Error</h4>
                  </div>
                  <p style={{ fontSize: '13px', lineHeight: '1.4' }}>{error}</p>
                </div>
              )}

              {/* Success: Live Grounded AI Explanation Content */}
              {!loading && explanation && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Provider & Language pill */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    <span>
                      Grounded explanation powered by <strong>{aiResult.provider}</strong> ({aiResult.model})
                    </span>
                    <span className="badge badge-lime badge-mono" style={{ fontSize: '11px' }}>
                      {language === 'hinglish' ? 'Hinglish Mode' : 'Simple English Mode'}
                    </span>
                  </div>

                  {/* 1. Problem Summary & 2. Expected Outcome */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    {/* Problem Summary */}
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '18px 20px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          marginBottom: '8px',
                        }}
                      >
                        <HelpCircle size={14} color="var(--accent-amber)" />
                        What is Broken or Needed
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        {explanation.problemSummary}
                      </p>
                    </div>

                    {/* Expected Outcome */}
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '18px 20px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          marginBottom: '8px',
                        }}
                      >
                        <CheckCircle2 size={14} color="var(--accent-green)" />
                        What the Maintainer Expects
                      </div>
                      <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
                        {explanation.expectedOutcome}
                      </p>
                    </div>
                  </div>

                  {/* 3. Relevant Skills & Tech */}
                  {explanation.relevantSkills && explanation.relevantSkills.length > 0 && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '18px 20px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          marginBottom: '10px',
                        }}
                      >
                        Relevant Skills & Technologies
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {explanation.relevantSkills.map((sk, idx) => (
                          <span key={idx} className="badge badge-dark-lime badge-mono" style={{ backgroundColor: '#181A1F' }}>
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 4. Jargon Buster / Technical Terms */}
                  {explanation.technicalTerms && explanation.technicalTerms.length > 0 && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '18px 20px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          marginBottom: '12px',
                        }}
                      >
                        <BookOpen size={14} color="var(--accent-blue)" />
                        Jargon Buster: Technical Terms Made Simple
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
                        {explanation.technicalTerms.map((termObj, i) => (
                          <div
                            key={i}
                            style={{
                              backgroundColor: 'var(--bg-canvas)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '10px 14px',
                            }}
                          >
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                              {termObj.term}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              {termObj.definition}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 5. Suggested Investigation Steps */}
                  {explanation.investigationSteps && explanation.investigationSteps.length > 0 && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '18px 20px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          marginBottom: '10px',
                        }}
                      >
                        <FolderSearch size={14} color="var(--accent-lime-dim)" />
                        Suggested Investigation Steps in the Codebase
                      </div>

                      <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {explanation.investigationSteps.map((step, idx) => (
                          <li key={idx} style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: '1.45' }}>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 6. Clarification Questions Before Coding */}
                  {explanation.clarificationQuestions && explanation.clarificationQuestions.length > 0 && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '18px 20px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '11px',
                          color: 'var(--text-tertiary)',
                          textTransform: 'uppercase',
                          fontWeight: 600,
                          marginBottom: '10px',
                        }}
                      >
                        <HelpCircle size={14} color="var(--accent-amber)" />
                        Questions to Ask the Maintainer First
                      </div>

                      <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {explanation.clarificationQuestions.map((q, idx) => (
                          <li key={idx} style={{ fontSize: '13.5px', color: 'var(--text-primary)', lineHeight: '1.45' }}>
                            "{q}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 7. Explicit Uncertainty Note */}
                  {explanation.uncertaintyNotes && (
                    <div
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                      }}
                    >
                      <Info size={16} color="var(--text-tertiary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
                        <strong>Uncertainty Note:</strong> {explanation.uncertaintyNotes}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SKILL READINESS */}
          {activeTab === 'readiness' && (
            <SkillReadinessCard
              issue={issue}
              aiAnalysis={explanation}
              userSkills={userSkills}
              onUpdateUserSkills={onUpdateUserSkills}
            />
          )}

          {/* TAB 3: CONTRIBUTION ROADMAP */}
          {activeTab === 'roadmap' && <ContributionRoadmap issue={issue} />}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
            Press <kbd style={{ padding: '2px 5px', background: '#FFFFFF', border: '1px solid var(--border-medium)', borderRadius: '3px' }}>Esc</kbd> to close
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-sm"
            >
              Open on GitHub <ExternalLink size={13} />
            </a>
            <button type="button" onClick={onClose} className="btn btn-dark btn-sm">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
