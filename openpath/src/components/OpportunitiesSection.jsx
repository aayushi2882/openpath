import { OPPORTUNITIES } from '../data/opportunities';
import { Award, ExternalLink, Calendar, CheckCircle, Tag } from 'lucide-react';

export default function OpportunitiesSection() {
  return (
    <section
      id="opportunities"
      style={{
        padding: '72px 0',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Header */}
        <div style={{ maxWidth: '680px', marginBottom: '40px' }}>
          <span className="badge badge-subtle badge-mono" style={{ marginBottom: '12px' }}>
            DIRECTORY & EVENTS
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Verified Open-Source Programs & Fellowships
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Curated directory of legitimate mentorship initiatives and hackathons. Always check official links for current application cycles and eligibility.
          </p>
        </div>

        {/* Opportunities Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {OPPORTUNITIES.map((opp) => (
            <article
              key={opp.id}
              style={{
                backgroundColor: 'var(--bg-canvas)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.2s ease, transform 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-medium)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.transform = 'none';
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                    }}
                  >
                    {opp.organization}
                  </span>
                  <span className="badge badge-subtle badge-mono" style={{ fontSize: '11px' }}>
                    {opp.difficulty}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    marginBottom: '6px',
                  }}
                >
                  {opp.name}
                </h3>

                <p
                  style={{
                    fontSize: '13.5px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    marginBottom: '16px',
                  }}
                >
                  {opp.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
                  {opp.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="badge badge-subtle"
                      style={{ fontSize: '11px', padding: '2px 8px' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Metadata items */}
                <div
                  style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={13} color="var(--text-tertiary)" />
                    <span>{opp.typicalTimeline}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={13} color="var(--accent-amber)" />
                    <span>{opp.stipend}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={opp.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  backgroundColor: '#FFFFFF',
                }}
              >
                Visit Official Website <ExternalLink size={13} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
