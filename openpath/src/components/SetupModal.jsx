import { useState, useEffect } from 'react';
import { X, Sparkles, Key, CheckCircle2, AlertCircle, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { getSystemHealth } from '../services/api';

export default function SetupModal({ isOpen, onClose }) {
  const [health, setHealth] = useState({ status: 'checking', ai: { configured: false } });
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const checkStatus = async () => {
    setLoading(true);
    const data = await getSystemHealth();
    setHealth(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    let isActive = true;
    getSystemHealth().then((data) => {
      if (isActive) setHealth(data);
    });

    return () => {
      isActive = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sampleEnvText = `# OpenPath Configuration (place in server/.env)
PORT=5501

# Recommended: Add GitHub Token to get 5,000 requests/hr (instead of 10/min)
GITHUB_TOKEN=

# Local Ollama model:
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:e2b
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sampleEnvText);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: '0' }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="var(--accent-amber)" />
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>System Health & API Setup</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Health Status Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {/* Backend Health */}
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: health?.status === 'ok' ? '#F0FDF4' : '#FEF2F2',
                border: `1px solid ${health?.status === 'ok' ? '#BBF7D0' : '#FECACA'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                {health?.status === 'ok' ? (
                  <CheckCircle2 size={16} color="#16A34A" />
                ) : (
                  <AlertCircle size={16} color="#DC2626" />
                )}
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Express Backend</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {health?.status === 'checking'
                  ? 'Checking backend…'
                  : health?.status === 'ok'
                  ? `Online (Uptime: ${health.uptime}s)`
                  : 'Offline / unreachable'}
              </div>
            </div>

            {/* AI Provider Status */}
            <div
              style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: health?.ai?.configured ? '#F0FDF4' : '#FFFBEB',
                border: `1px solid ${health?.ai?.configured ? '#BBF7D0' : '#FDE68A'}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                {health?.ai?.configured ? (
                  <CheckCircle2 size={16} color="#16A34A" />
                ) : (
                  <Sparkles size={16} color="#D97706" />
                )}
                <span style={{ fontSize: '13px', fontWeight: 600 }}>AI Explainer</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {health?.status === 'checking'
                  ? 'Checking AI configuration…'
                  : health?.ai?.configured
                  ? `Ready (${health.ai.provider}: ${health.ai.model})`
                  : health?.ai?.message || 'Checking local Ollama…'}
              </div>
            </div>
          </div>

          {health?.ai?.reachable && health.ai.models?.length > 0 && (
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '-12px', marginBottom: '20px' }}>
              Installed Ollama models: {health.ai.models.join(', ')}. Set <code>OLLAMA_MODEL</code> in <code>server/.env</code> to choose the model OpenPath uses.
            </p>
          )}

          <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '8px' }}>
            How to configure your environment:
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px' }}>
            OpenPath uses local Ollama for AI. Start Ollama, then configure <code style={{ fontFamily: 'var(--font-mono)' }}>server/.env</code>:
          </p>

          <div
            style={{
              backgroundColor: '#111215',
              color: '#F4F4F6',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              position: 'relative',
              marginBottom: '20px',
              lineHeight: '1.4',
            }}
          >
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{sampleEnvText}</pre>
            <button
              type="button"
              onClick={copyToClipboard}
              className="btn btn-ghost btn-sm"
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                color: '#E5E7EB',
                backgroundColor: '#1E2128',
                fontSize: '11px',
                padding: '4px 8px',
              }}
            >
              {copiedKey ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
              {copiedKey ? 'Copied' : 'Copy'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-subtle badge-mono">1</span>
              <span>
                Start Ollama locally, then run <code>ollama pull gemma4:e2b</code> if needed.
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-subtle badge-mono">2</span>
              <span>
                Optional: Get a free personal GitHub token from{' '}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-primary)', fontWeight: 600 }}
                >
                  GitHub Settings <ExternalLink size={12} style={{ display: 'inline' }} />
                </a>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-subtle badge-mono">3</span>
              <span>Restart the backend server with <code style={{ fontFamily: 'var(--font-mono)' }}>npm run dev</code>.</span>
            </div>
          </div>
        </div>

        <div
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            onClick={checkStatus}
            disabled={loading}
            className="btn btn-ghost btn-sm"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Re-check Status
          </button>
          <button type="button" onClick={onClose} className="btn btn-dark btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
