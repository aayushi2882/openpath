import { ShieldAlert, BookOpen, Layers, MessageSquareDashed } from 'lucide-react';

export default function FrictionPoints() {
  const frictionList = [
    {
      icon: Layers,
      title: 'Monolithic Codebases',
      quote: '“I opened the repository and saw 400 folders. I had no idea which file to touch.”',
      solution: 'Repository context and, when configured, AI guidance can suggest where to investigate. You decide what to inspect.',
    },
    {
      icon: BookOpen,
      title: 'Cryptic Jargon',
      quote: '“The issue said ‘fix hydration mismatch and ensure idempotent cleanup’. What does that mean?”',
      solution: 'When local Ollama is ready, the explainer translates issue details into plain English or Hinglish.',
    },
    {
      icon: ShieldAlert,
      title: 'Imposter Syndrome',
      quote: '“What if I submit a PR and the maintainer thinks my question was stupid?”',
      solution: 'OpenPath surfaces repository guidance when available and helps you form clear questions to confirm with maintainers.',
    },
    {
      icon: MessageSquareDashed,
      title: 'Unclear Next Steps',
      quote: '“I think I fixed the code locally, but how do I test it and submit without breaking git?”',
      solution: 'An interactive contribution roadmap gives you practical steps from setup through pull-request preparation.',
    },
  ];

  return (
    <section
      style={{
        padding: '72px 0',
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        <div style={{ maxWidth: '640px', marginBottom: '44px' }}>
          <span className="badge badge-amber badge-mono" style={{ marginBottom: '12px' }}>
            THE BEGINNER REALITY
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '10px' }}>
            Why so many developers get stuck before their first PR
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Finding a repo with a <code style={{ fontSize: '13px' }}>good first issue</code> tag is easy. Overcoming the four invisible barriers below is what actually matters.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
          }}
        >
          {frictionList.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="card-light"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--text-primary)',
                      marginBottom: '16px',
                    }}
                  >
                    <Icon size={18} />
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p
                    style={{
                      fontStyle: 'italic',
                      fontSize: '13px',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.45',
                      marginBottom: '14px',
                    }}
                  >
                    {item.quote}
                  </p>
                </div>

                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--accent-amber)',
                      fontSize: '14px',
                      lineHeight: '1',
                      marginTop: '2px',
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontSize: '12.5px',
                      color: 'var(--text-primary)',
                      fontWeight: 500,
                    }}
                  >
                    {item.solution}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
