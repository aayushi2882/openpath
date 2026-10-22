import { useState } from 'react';
import { Code, Search, Sparkles, GitPullRequest, ArrowRight, Check } from 'lucide-react';

export default function JourneyVisual() {
  const [activeStage, setActiveStage] = useState(2); // default to step 2/3

  const stages = [
    {
      id: 0,
      step: '01',
      title: 'Your Skills',
      icon: Code,
      badge: 'Input',
      color: '#93C5FD',
      summary: 'Pick what you know: React, Python, Git, HTML, or Docs.',
      snippet: 'skills: ["JavaScript", "React", "CSS"]',
    },
    {
      id: 1,
      step: '02',
      title: 'Real GitHub Issue',
      icon: Search,
      badge: 'Live Data',
      color: 'var(--accent-lime)',
      summary: 'Fetch live open issues with "good first issue" labels.',
      snippet: 'issue #412: "Fix mobile drawer transition"',
    },
    {
      id: 2,
      step: '03',
      title: 'AI Decoding',
      icon: Sparkles,
      badge: 'English / Hinglish',
      color: '#FBBF24',
      summary: 'Demystify jargon, identify files, and clarify expectations.',
      snippet: '💡 "Maintainer expects CSS fix in Header.jsx"',
    },
    {
      id: 3,
      step: '04',
      title: 'Merged PR',
      icon: GitPullRequest,
      badge: 'Success',
      color: '#34D399',
      summary: 'Follow an 8-step roadmap to open your confident Pull Request.',
      snippet: 'git push origin fix/mobile-drawer # merged! 🎉',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#181A1F',
        border: '1px solid #282C35',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-dark)',
      }}
    >
      {/* Decorative Git Grid Pattern in corner */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 10px)',
          gap: '3px',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 28 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              backgroundColor:
                i % 7 === 0 || i % 5 === 0
                  ? 'var(--accent-lime)'
                  : i % 3 === 0
                  ? '#30A14E'
                  : '#21262D',
            }}
          />
        ))}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge badge-dark-lime badge-mono">ONBOARDING PIPELINE</span>
          <span style={{ color: '#6B7280', fontSize: '13px' }}>Click any stage to inspect</span>
        </div>
        <h4 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600 }}>
          From Curiosity to Merged Pull Request
        </h4>
      </div>

      {/* 4 Interactive Pipeline Stages */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
          position: 'relative',
        }}
      >
        {stages.map((stg) => {
          const Icon = stg.icon;
          const isSelected = activeStage === stg.id;
          return (
            <div
              key={stg.id}
              onClick={() => setActiveStage(stg.id)}
              style={{
                backgroundColor: isSelected ? '#22262E' : '#14161A',
                border: `1px solid ${isSelected ? 'var(--accent-lime)' : '#262932'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isSelected ? 'translateY(-2px)' : 'none',
                position: 'relative',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: isSelected ? 'rgba(210, 248, 36, 0.15)' : '#1F2229',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSelected ? 'var(--accent-lime)' : stg.color,
                  }}
                >
                  <Icon size={16} />
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#6B7280',
                    fontWeight: 600,
                  }}
                >
                  STEP {stg.step}
                </span>
              </div>

              <div
                style={{
                  color: isSelected ? '#FFFFFF' : '#D1D5DB',
                  fontSize: '15px',
                  fontWeight: 600,
                  marginBottom: '4px',
                }}
              >
                {stg.title}
              </div>

              <p
                style={{
                  color: '#9CA3AF',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  marginBottom: '10px',
                }}
              >
                {stg.summary}
              </p>

              <div
                style={{
                  backgroundColor: '#0D0E11',
                  border: '1px solid #1E2128',
                  borderRadius: '4px',
                  padding: '6px 8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: isSelected ? 'var(--accent-lime)' : '#9CA3AF',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {stg.snippet}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Detail Callout for selected stage */}
      <div
        style={{
          marginTop: '16px',
          padding: '14px 18px',
          backgroundColor: '#131518',
          border: '1px solid #23262E',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-lime)',
            }}
          />
          <span style={{ color: '#E5E7EB', fontSize: '13px', fontWeight: 500 }}>
            {activeStage === 0 && 'Contribute with whatever you know today. Even simple CSS fixes or typo corrections count.'}
            {activeStage === 1 && 'No mock data. OpenPath searches live open issues tagged by real maintainers.'}
            {activeStage === 2 && 'Our AI explainer breaks down unfamiliar jargon and sets honest expectations before you clone.'}
            {activeStage === 3 && 'A structured 8-step roadmap ensures you follow Git etiquette and submit clean PRs.'}
          </span>
        </div>

        <a
          href="#discover-issues"
          style={{
            color: 'var(--accent-lime)',
            fontSize: '13px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          Try it live <ArrowRight size={14} />
        </a>
      </div>
    </div>
  );
}
