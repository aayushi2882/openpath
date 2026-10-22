import { useState } from 'react';
import { GIT_CONCEPTS, ETIQUETTE_TIPS } from '../data/openSourceGuide';
import { BookOpen, FolderGit2, AlertCircle, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';

export default function OpenSource101() {
  const [selectedConcept, setSelectedConcept] = useState(GIT_CONCEPTS[0]);

  return (
    <section
      id="why-opensource"
      style={{
        padding: '72px 0',
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Header with Skip Option */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '40px',
          }}
        >
          <div style={{ maxWidth: '640px' }}>
            <span className="badge badge-lime badge-mono" style={{ marginBottom: '12px' }}>
              OPEN SOURCE 101
            </span>
            <h2 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
              The essential concepts you need to know
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
              Open source is software whose code is freely available for anyone to inspect, modify, and enhance. Here is how modern collaboration works on GitHub.
            </p>
          </div>

          <div>
            <a
              href="#discover-issues"
              className="btn btn-outline btn-sm"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                borderColor: 'var(--border-medium)',
              }}
            >
              Skip guide ➔ Jump to issues
            </a>
          </div>
        </div>

        {/* 4 Pillars of Why Contribute */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '48px',
          }}
        >
          <div className="card-light" style={{ padding: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              🚀 Proof of Work Portfolio
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              A merged PR in a real project proves you can read someone else's code, follow standards, and collaborate.
            </p>
          </div>

          <div className="card-light" style={{ padding: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              🎓 Production Code Quality
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              See how senior engineers structure testing, CI/CD pipelines, documentation, and error handling.
            </p>
          </div>

          <div className="card-light" style={{ padding: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              🌍 Global Developer Network
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              Meet maintainers, fellow contributors, and mentors across timezones and tech stacks.
            </p>
          </div>

          <div className="card-light" style={{ padding: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>
              ❤️ Give Back to Your Tools
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              Fix the minor bugs or outdated documentation in the libraries and frameworks you use every day.
            </p>
          </div>
        </div>

        {/* Visual Concept Explorer */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FolderGit2 size={16} color="var(--text-secondary)" />
              <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>
                GitHub Core Primitives
              </span>
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              Select a term to see simple mental model
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            }}
          >
            {/* List of Concepts */}
            <div
              style={{
                borderRight: '1px solid var(--border-subtle)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              {GIT_CONCEPTS.map((concept) => {
                const isSelected = selectedConcept.id === concept.id;
                return (
                  <button
                    key={concept.id}
                    type="button"
                    onClick={() => setSelectedConcept(concept)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-sm)',
                      border: `1px solid ${isSelected ? 'var(--text-primary)' : 'transparent'}`,
                      backgroundColor: isSelected ? 'var(--bg-canvas)' : 'transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 600,
                          color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        }}
                      >
                        {concept.term}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        {concept.summary}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      color={isSelected ? 'var(--text-primary)' : 'var(--border-medium)'}
                    />
                  </button>
                );
              })}
            </div>

            {/* Selected Detail & Analogy View */}
            <div
              style={{
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#FFFFFF',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <span className="badge badge-subtle badge-mono">{selectedConcept.badge}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    GitHub Terminology
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '24px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '12px',
                  }}
                >
                  {selectedConcept.term}
                </h3>

                <p
                  style={{
                    fontSize: '15px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '24px',
                  }}
                >
                  {selectedConcept.description}
                </p>

                {/* Mental Model Analogy Box */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-canvas)',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 20px',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      color: 'var(--accent-amber)',
                      fontWeight: 600,
                      marginBottom: '6px',
                    }}
                  >
                    💡 Real-World Mental Model
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-primary)',
                      fontStyle: 'italic',
                      lineHeight: '1.45',
                    }}
                  >
                    {selectedConcept.analogy}
                  </div>
                </div>
              </div>

              {/* Contributor Etiquette snippet */}
              <div
                style={{
                  marginTop: '28px',
                  paddingTop: '20px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--text-tertiary)',
                  fontSize: '12.5px',
                }}
              >
                <CheckCircle2 size={16} color="var(--accent-green)" />
                <span>
                  Tip: Always ask politely in the issue thread before you start writing code!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
