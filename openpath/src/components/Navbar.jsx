import { useState, useEffect } from 'react';
import { GitBranch, Sparkles, AlertCircle, CheckCircle2, Menu, X, ArrowUpRight } from 'lucide-react';
import { getSystemHealth } from '../services/api';

export default function Navbar({ onOpenSetupModal }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [health, setHealth] = useState({
    status: 'checking',
    ai: { configured: false, provider: null },
    github: { tokenConfigured: false },
  });

  useEffect(() => {
    let mounted = true;
    getSystemHealth().then((data) => {
      if (mounted) setHealth(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(17, 18, 21, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #242730',
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px',
        }}
      >
        {/* Logo and Tagline */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: '#FFFFFF',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#1E2129',
              border: '1px solid #2D323E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-lime)',
            }}
          >
            <GitBranch size={18} strokeWidth={2.4} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '18px',
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              }}
            >
              OpenPath
            </span>
          </div>
          <span
            className="badge badge-dark-lime badge-mono"
            style={{ fontSize: '10px', padding: '1px 6px', marginLeft: '4px' }}
          >
            v1.0
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '24px',
          }}
          className="desktop-nav"
        >
          <a
            href="#why-opensource"
            style={{
              color: '#9FA6B2',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.target.style.color = '#9FA6B2')}
          >
            Open Source 101
          </a>
          <a
            href="#discover-issues"
            style={{
              color: '#9FA6B2',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.target.style.color = '#9FA6B2')}
          >
            Find Issues
          </a>
          <a
            href="#roadmap"
            style={{
              color: '#9FA6B2',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.target.style.color = '#9FA6B2')}
          >
            Roadmap
          </a>
          <a
            href="#opportunities"
            style={{
              color: '#9FA6B2',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => (e.target.style.color = '#FFFFFF')}
            onMouseLeave={(e) => (e.target.style.color = '#9FA6B2')}
          >
            Programs
          </a>
        </nav>

        {/* Status Indicator & Primary Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* AI Status Badge */}
          <button
            type="button"
            onClick={onOpenSetupModal}
            className="btn btn-sm"
            style={{
              backgroundColor: health.ai?.configured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
              border: `1px solid ${health.ai?.configured ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
              color: health.ai?.configured ? '#34D399' : '#FBBF24',
              borderRadius: 'var(--radius-full)',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            title="Click to view AI & API configuration status"
          >
            <Sparkles size={13} />
            <span style={{ fontFamily: 'var(--font-mono)' }}>
              {health.ai?.configured
                ? `AI: ${health.ai.provider}`
                : 'AI: Setup Guide'}
            </span>
          </button>

          <a
            href="#discover-issues"
            className="btn btn-primary btn-sm"
            style={{ display: 'none' }}
            id="nav-cta"
          >
            Find My First Issue
          </a>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            style={{ color: '#F4F4F6', display: 'flex' }}
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#16181D',
            borderBottom: '1px solid #2B2F38',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <a
            href="#why-opensource"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#F4F4F6', textDecoration: 'none', fontSize: '15px' }}
          >
            Open Source 101
          </a>
          <a
            href="#discover-issues"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#F4F4F6', textDecoration: 'none', fontSize: '15px' }}
          >
            Find Issues
          </a>
          <a
            href="#roadmap"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#F4F4F6', textDecoration: 'none', fontSize: '15px' }}
          >
            Contribution Roadmap
          </a>
          <a
            href="#opportunities"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: '#F4F4F6', textDecoration: 'none', fontSize: '15px' }}
          >
            Programs & Fellowships
          </a>
          <div style={{ paddingTop: '8px' }}>
            <a
              href="#discover-issues"
              onClick={() => setMobileMenuOpen(false)}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Start Finding Issues
            </a>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          #nav-cta {
            display: inline-flex !important;
          }
          #mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
