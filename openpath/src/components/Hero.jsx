import { ArrowDown, Search, HelpCircle, Terminal, CheckCircle2 } from 'lucide-react';
import JourneyVisual from './JourneyVisual';

export default function Hero() {
  return (
    <section
      style={{
        backgroundColor: '#111215',
        color: '#FFFFFF',
        paddingTop: '64px',
        paddingBottom: '80px',
        borderBottom: '1px solid #22252B',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle background coordinate grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #262932 1px, transparent 0)',
          backgroundSize: '32px 32px',
          opacity: 0.45,
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center', marginBottom: '48px' }}>
          {/* Subtle Tagline Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'rgba(210, 248, 36, 0.1)',
              border: '1px solid rgba(210, 248, 36, 0.28)',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--accent-lime)',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--accent-lime)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              Open Source Onboarding Platform
            </span>
          </div>

          {/* Main Headline */}
          <h1
            style={{
              fontSize: 'clamp(38px, 6vw, 64px)',
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '-0.035em',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}
          >
            Your first open-source contribution{' '}
            <span
              className="font-serif"
              style={{
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--accent-lime)',
              }}
            >
              starts here.
            </span>
          </h1>

          {/* Core Tagline / Subtitle */}
          <p
            style={{
              fontSize: 'clamp(17px, 2.5vw, 20px)',
              color: '#9CA3AF',
              lineHeight: 1.5,
              maxWidth: '680px',
              margin: '0 auto 28px',
              fontWeight: 400,
            }}
          >
            <strong style={{ color: '#F3F4F6', fontWeight: 600 }}>
              From curious beginner to confident contributor.
            </strong>{' '}
            Understand whether a real GitHub issue fits your existing skills, decode unfamiliar jargon in simple English or Hinglish, and get an actionable blueprint to open your first PR.
          </p>

          {/* Differentiator Quote Banner */}
          <div
            style={{
              backgroundColor: '#191B21',
              border: '1px solid #2B2F38',
              borderRadius: 'var(--radius-md)',
              padding: '12px 20px',
              maxWidth: '720px',
              margin: '0 auto 36px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              textAlign: 'left',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                lineHeight: 1,
                color: 'var(--accent-lime)',
                fontFamily: 'var(--font-serif)',
              }}
            >
              “
            </span>
            <p
              style={{
                color: '#D1D5DB',
                fontSize: '13.5px',
                lineHeight: 1.45,
                fontStyle: 'italic',
              }}
            >
              Most tools help you find an issue. OpenPath helps you understand whether it may fit your skills—and how to begin.
            </p>
          </div>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              flexWrap: 'wrap',
            }}
          >
            <a href="#discover-issues" className="btn btn-primary btn-lg">
              <Search size={18} strokeWidth={2.5} />
              Find my first issue
            </a>
            <a href="#how-it-works" className="btn btn-dark btn-lg">
              <HelpCircle size={18} />
              How it works
            </a>
          </div>
        </div>

        {/* Visual Pipeline Showcase */}
        <div style={{ maxWidth: '1020px', margin: '0 auto' }}>
          <JourneyVisual />
        </div>
      </div>
    </section>
  );
}
