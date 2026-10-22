import { useState, useEffect } from 'react';
import { CheckSquare, Square, RotateCcw, ExternalLink, Lightbulb, Sparkles } from 'lucide-react';

const ROADMAP_STEPS = [
  {
    id: 1,
    title: '1. Read the repository’s contribution guidelines',
    details:
      'Locate CONTRIBUTING.md or docs/contributing in the repo root. Note branching conventions, code style rules, and commit message formats.',
    tip: 'Many maintainers reject PRs immediately if you missed a required pull request template question.',
  },
  {
    id: 2,
    title: '2. Read the issue and related discussion',
    details:
      'Carefully inspect all maintainer comments. Check if another contributor has already claimed the issue or opened a linked PR.',
    tip: 'If someone commented "I am working on this" 2 days ago, check if they opened a PR before jumping in.',
  },
  {
    id: 3,
    title: '3. Inspect relevant source files',
    details:
      'Search the codebase using grep or GitHub file finder for error messages, component names, or function identifiers mentioned in the issue.',
    tip: 'Do not try to understand the entire repo. Focus strictly on the single component or file path involved.',
  },
  {
    id: 4,
    title: '4. Set up the project using its documented instructions',
    details:
      'Fork the repo to your personal GitHub account. Clone it locally, install dependencies, and run the development server following the README.',
    tip: 'Never guess setup commands. Always follow the README or CONTRIBUTING guide.',
  },
  {
    id: 5,
    title: '5. Understand and reproduce the expected behavior',
    details:
      'Trigger the bug locally or review the desired feature. Confirm that you can see what is currently broken before writing any code.',
    tip: 'If you cannot reproduce the bug, politely ask the author for reproduction steps in the issue thread.',
  },
  {
    id: 6,
    title: '6. Make a small, focused change',
    details:
      'Create a dedicated git branch (e.g., git checkout -b fix/issue-name). Make minimal, cleanly formatted changes without touching unrelated files.',
    tip: 'Resist the urge to reformat whitespace or fix unrelated typos in other files—keep diffs tight.',
  },
  {
    id: 7,
    title: '7. Run relevant tests and linters',
    details:
      'Run existing tests (e.g., npm test, pytest, cargo test) and linting checks to make sure your change did not introduce regressions.',
    tip: 'If possible, add a small unit test that verifies your bug fix works.',
  },
  {
    id: 8,
    title: '8. Prepare a clear pull request',
    details:
      'Push your branch to your fork. Open a Pull Request against the main branch of the original repo. Mention "Fixes #issue_number" in the body.',
    tip: 'Reference the issue number so GitHub automatically links and closes the issue when your PR merges!',
  },
];

export default function ContributionRoadmap({ issue }) {
  const storageKey = `openpath_roadmap_${issue?.id || 'default'}`;

  const [completedSteps, setCompletedSteps] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completedSteps));
    } catch {
      // ignore
    }
  }, [completedSteps, storageKey]);

  const toggleStep = (stepId) => {
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const handleReset = () => {
    setCompletedSteps([]);
  };

  const progressPercent = Math.round((completedSteps.length / ROADMAP_STEPS.length) * 100);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      {/* Header and Progress Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '10px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Actionable Contribution Roadmap
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Follow this practical 8-step blueprint to take this issue to a merged Pull Request.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                color: completedSteps.length === 8 ? 'var(--accent-green)' : 'var(--text-primary)',
              }}
            >
              {completedSteps.length} of {ROADMAP_STEPS.length} Completed ({progressPercent}%)
            </span>
            {completedSteps.length > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '11px', padding: '2px 6px' }}
                title="Reset checklist for this issue"
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar Container */}
        <div
          style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: progressPercent === 100 ? '#10B981' : 'var(--accent-lime-dim)',
              transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>
      </div>

      {/* 8-Step Checklist List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ROADMAP_STEPS.map((step) => {
          const isDone = completedSteps.includes(step.id);
          return (
            <div
              key={step.id}
              onClick={() => toggleStep(step.id)}
              style={{
                backgroundColor: isDone ? '#F9FBF7' : 'var(--bg-canvas)',
                border: `1px solid ${isDone ? '#86EFAC' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ marginTop: '2px', color: isDone ? '#16A34A' : 'var(--border-strong)' }}>
                  {isDone ? <CheckSquare size={18} /> : <Square size={18} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: isDone ? '#166534' : 'var(--text-primary)',
                      textDecoration: isDone ? 'line-through' : 'none',
                      marginBottom: '4px',
                    }}
                  >
                    {step.title}
                  </div>

                  <p
                    style={{
                      fontSize: '13px',
                      color: isDone ? '#15803D' : 'var(--text-secondary)',
                      lineHeight: '1.45',
                      marginBottom: '8px',
                    }}
                  >
                    {step.details}
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11.5px',
                      color: 'var(--text-tertiary)',
                      fontStyle: 'italic',
                    }}
                  >
                    <Lightbulb size={13} color="var(--accent-amber)" />
                    <span>{step.tip}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {progressPercent === 100 && (
        <div
          style={{
            marginTop: '20px',
            padding: '16px',
            backgroundColor: '#F0FDF4',
            border: '1px solid #86EFAC',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
          }}
        >
          <span style={{ fontSize: '20px' }}>🎉</span>
          <h4 style={{ fontSize: '15px', fontWeight: 600, color: '#166534', margin: '4px 0' }}>
            All Steps Completed!
          </h4>
          <p style={{ fontSize: '13px', color: '#15803D' }}>
            You are ready to open your Pull Request or wait for maintainer feedback. Be proud of taking this first step!
          </p>
        </div>
      )}
    </div>
  );
}
