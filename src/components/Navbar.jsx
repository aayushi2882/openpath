import { useEffect, useState } from 'react';
import { GitBranch, Sparkles, Menu, X, Compass, Eye } from 'lucide-react';
import { getSystemHealth } from '../services/api';

const navButtonStyle = {
  border: 0,
  background: 'transparent',
  color: '#D1D5DB',
  font: 'inherit',
  fontSize: '13px',
  cursor: 'pointer',
  padding: '8px 4px',
};

export default function Navbar({ onOpenSetupModal, onNavigateHome, onExplorePrograms, onStartRepository, onWebsiteIssueDetective }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [health, setHealth] = useState({ status: 'checking', ai: { configured: false } });

  useEffect(() => {
    let isActive = true;
    getSystemHealth().then((data) => {
      if (isActive) setHealth(data);
    });
    return () => { isActive = false; };
  }, []);

  const navigate = (action) => {
    setMobileMenuOpen(false);
    action?.();
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(17,18,21,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #242730' }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', gap: '16px' }}>
        <button type="button" onClick={() => navigate(onNavigateHome)} aria-label="OpenPath home" style={{ display: 'flex', alignItems: 'center', gap: '9px', border: 0, padding: 0, background: 'none', color: '#fff', cursor: 'pointer', font: 'inherit', fontWeight: 700 }}>
          <GitBranch size={21} color="var(--accent-lime)" />
          <span>OpenPath</span>
          <span className="badge badge-dark-lime badge-mono" style={{ fontSize: '9px', padding: '1px 6px' }}>BETA</span>
        </button>

        <nav aria-label="Main navigation" className="desktop-nav" style={{ display: 'none', alignItems: 'center', gap: '20px' }}>
          <button type="button" style={navButtonStyle} onClick={() => navigate(onNavigateHome)}>How it works</button>
          <button type="button" style={navButtonStyle} onClick={() => navigate(onExplorePrograms)}>Programs</button>
          <button type="button" style={navButtonStyle} onClick={() => navigate(onStartRepository)}>Find my first issue</button>
          <button type="button" style={navButtonStyle} onClick={() => navigate(onWebsiteIssueDetective)}>Inspect a website</button>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button type="button" onClick={onOpenSetupModal} className="btn btn-sm" title="View backend and AI configuration status" style={{ backgroundColor: health.ai?.configured ? 'rgba(16,185,129,.15)' : 'rgba(245,158,11,.15)', border: `1px solid ${health.ai?.configured ? 'rgba(16,185,129,.35)' : 'rgba(245,158,11,.35)'}`, color: health.ai?.configured ? '#34D399' : '#FBBF24', borderRadius: 'var(--radius-full)', padding: '4px 10px', fontSize: '11px' }}>
            <Sparkles size={13} /> {health.ai?.configured ? `AI: ${health.ai.provider}` : 'AI setup'}
          </button>
          <button type="button" className="btn btn-ghost btn-sm mobile-menu-btn" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={mobileMenuOpen} style={{ color: '#F4F4F6' }}>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav aria-label="Mobile navigation" className="mobile-menu">
          <button type="button" onClick={() => navigate(onNavigateHome)}>How it works</button>
          <button type="button" onClick={() => navigate(onExplorePrograms)}><Compass size={16} /> Explore programs</button>
          <button type="button" onClick={() => navigate(onStartRepository)}><GitBranch size={16} /> Find my first issue</button>
          <button type="button" onClick={() => navigate(onWebsiteIssueDetective)}><Eye size={16} /> Website Issue Detective</button>
          <button type="button" onClick={() => navigate(onOpenSetupModal)}><Sparkles size={16} /> AI and API setup</button>
        </nav>
      )}
      <style>{`
        @media (min-width: 860px) { .desktop-nav { display: flex !important; } .mobile-menu-btn { display: none !important; } }
        .mobile-menu { background: #16181D; border-top: 1px solid #2B2F38; padding: 12px 24px 18px; display: grid; gap: 6px; }
        .mobile-menu button { display: flex; align-items: center; gap: 8px; padding: 10px 4px; border: 0; background: none; color: #F4F4F6; font: inherit; text-align: left; cursor: pointer; }
        .desktop-nav button:hover, .mobile-menu button:hover { color: var(--accent-lime); }
      `}</style>
    </header>
  );
}
