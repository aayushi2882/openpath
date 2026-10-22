import { GitBranch, Heart, ExternalLink, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        backgroundColor: '#111215',
        color: '#9CA3AF',
        borderTop: '1px solid #22252B',
        padding: '60px 0 36px',
        fontSize: '13.5px',
      }}
    >
      <div className="container">
        {/* Final CTA Banner */}
        <div
          style={{
            backgroundColor: '#181A1F',
            border: '1px solid #282C36',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 32px',
            marginBottom: '56px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span className="badge badge-dark-lime badge-mono" style={{ marginBottom: '16px' }}>
            YOUR FIRST PR AWAITS
          </span>
          <h2
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 600,
              color: '#FFFFFF',
              marginBottom: '12px',
            }}
          >
            Ready to take your first practical step?
          </h2>
          <p
            style={{
              color: '#9CA3AF',
              fontSize: '15px',
              maxWidth: '560px',
              margin: '0 auto 24px',
              lineHeight: '1.5',
            }}
          >
            Pick a beginner-friendly issue, let our AI explain what needs to be changed, and follow the 8-step roadmap to your merged PR.
          </p>

          <a href="#discover-issues" className="btn btn-primary btn-lg">
            Start Finding Issues Now
          </a>
        </div>

        {/* Footer Navigation Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '36px',
            marginBottom: '48px',
          }}
        >
          {/* Brand Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  backgroundColor: '#1F2228',
                  color: 'var(--accent-lime)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GitBranch size={16} />
              </div>
              <span style={{ fontSize: '17px', fontWeight: 700, color: '#FFFFFF' }}>OpenPath</span>
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.5', marginBottom: '14px' }}>
              From curious beginner to confident contributor. Built for students and first-time open-source engineers.
            </p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#4B5563' }}>
              Real GitHub REST API • Configurable AI
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                textTransform: 'uppercase',
                color: '#D1D5DB',
                fontWeight: 600,
                marginBottom: '14px',
              }}
            >
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href="#discover-issues" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  Issue Search
                </a>
              </li>
              <li>
                <a href="#why-opensource" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  Open Source 101
                </a>
              </li>
              <li>
                <a href="#how-it-works" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  How OpenPath Works
                </a>
              </li>
              <li>
                <a href="#opportunities" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  Fellowships & Programs
                </a>
              </li>
            </ul>
          </div>

          {/* Key GitHub Terms */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                textTransform: 'uppercase',
                color: '#D1D5DB',
                fontWeight: 600,
                marginBottom: '14px',
              }}
            >
              Starter Labels
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a href="#discover-issues" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  <code>good first issue</code>
                </a>
              </li>
              <li>
                <a href="#discover-issues" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  <code>help wanted</code>
                </a>
              </li>
              <li>
                <a href="#discover-issues" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  <code>documentation</code>
                </a>
              </li>
              <li>
                <a href="#discover-issues" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
                  <code>hacktoberfest</code>
                </a>
              </li>
            </ul>
          </div>

          {/* External Resources */}
          <div>
            <h4
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                textTransform: 'uppercase',
                color: '#D1D5DB',
                fontWeight: 600,
                marginBottom: '14px',
              }}
            >
              Resources
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li>
                <a
                  href="https://docs.github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#9CA3AF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  GitHub Documentation <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://opensource.guide"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#9CA3AF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Open Source Guides <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a
                  href="https://git-scm.com/book/en/v2"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#9CA3AF', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Pro Git Book <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            borderTop: '1px solid #22252B',
            paddingTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            © {new Date().getFullYear()} OpenPath. Empowering the next generation of open-source contributors.
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="btn btn-ghost btn-sm"
            style={{ color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            Back to top <ArrowUp size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
}
