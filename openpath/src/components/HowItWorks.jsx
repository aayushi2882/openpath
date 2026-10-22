import { Search, Brain, Milestone, ArrowRight } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Search Live GitHub Issues',
      desc: 'Filter thousands of real open-source repositories by language (JavaScript, Python, Rust, etc.) and tags like "good first issue" or "documentation". No mock data.',
      icon: Search,
      tag: 'Real-time GitHub REST API',
    },
    {
      num: '02',
      title: 'Decode with AI (English / Hinglish)',
      desc: 'Click any issue to generate a grounded explanation. Understand what problem needs solving, what the maintainer expects, and what technical jargon actually means.',
      icon: Brain,
      tag: 'Configurable AI Model',
    },
    {
      num: '03',
      title: 'Assess Skills & Follow the Roadmap',
      desc: 'Enter your skills to see which match and what to learn. Then complete the interactive 8-step checklist from cloning and branching to opening your Pull Request.',
      icon: Milestone,
      tag: 'Interactive Roadmap',
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{
        padding: '72px 0',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <span className="badge badge-subtle badge-mono" style={{ marginBottom: '12px' }}>
            HOW OPENPATH WORKS
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>
            A structured path from curious to contributor
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            No more wandering blindly through giant codebases. OpenPath replaces guesswork with clarity.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                style={{
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '32px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: '#111215',
                        color: 'var(--accent-lime)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '24px',
                        fontWeight: 700,
                        color: 'var(--border-medium)',
                      }}
                    >
                      {st.num}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      marginBottom: '10px',
                    }}
                  >
                    {st.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5',
                      marginBottom: '20px',
                    }}
                  >
                    {st.desc}
                  </p>
                </div>

                <div>
                  <span
                    className="badge badge-subtle badge-mono"
                    style={{ fontSize: '11px', padding: '4px 8px' }}
                  >
                    {st.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <a href="#discover-issues" className="btn btn-dark">
            Find issues now <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
