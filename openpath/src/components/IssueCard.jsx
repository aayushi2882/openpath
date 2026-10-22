import { Sparkles, ExternalLink, MessageSquare, Clock } from 'lucide-react';

/**
 * Format relative date string: "2 days ago", "3 hours ago"
 */
function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Check if a hex color is light or dark to set appropriate text contrast
 */
function getContrastColor(hexColor) {
  if (!hexColor || hexColor.length < 6) return '#333333';
  const r = parseInt(hexColor.substr(0, 2), 16);
  const g = parseInt(hexColor.substr(2, 2), 16);
  const b = parseInt(hexColor.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? '#111827' : '#FFFFFF';
}

export default function IssueCard({ issue, onSelectForExplanation, isSelected }) {
  return (
    <article
      className="card-light"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '22px 24px',
        borderColor: isSelected ? 'var(--text-primary)' : 'var(--border-subtle)',
        borderWidth: isSelected ? '2px' : '1px',
        backgroundColor: isSelected ? '#FAF8F3' : '#FFFFFF',
        position: 'relative',
        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div>
        {/* Repo Name, Issue #, and Age */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-subtle)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              {issue.repo_name || 'Repository'}
            </span>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--text-tertiary)',
              }}
            >
              #{issue.number}
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              {formatRelativeTime(issue.created_at)}
            </span>

            {issue.comments_count > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MessageSquare size={12} />
                {issue.comments_count}
              </span>
            )}
          </div>
        </div>

        {/* Issue Title */}
        <h3
          style={{
            fontSize: '17px',
            fontWeight: 600,
            lineHeight: 1.35,
            color: 'var(--text-primary)',
            marginBottom: '10px',
            wordBreak: 'break-word',
          }}
        >
          {issue.title}
        </h3>

        {/* Excerpt */}
        <p
          style={{
            fontSize: '13.5px',
            color: 'var(--text-secondary)',
            lineHeight: '1.5',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {issue.body_excerpt || 'No description provided by the issue author.'}
        </p>

        {/* Labels */}
        {issue.labels && issue.labels.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '18px',
            }}
          >
            {issue.labels.slice(0, 5).map((label) => {
              const bg = label.color ? `#${label.color}` : '#E5E7EB';
              const textCol = getContrastColor(label.color);
              return (
                <span
                  key={label.id || label.name}
                  className="badge badge-mono"
                  style={{
                    backgroundColor: bg,
                    color: textCol,
                    fontSize: '11px',
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0,0,0,0.06)',
                  }}
                  title={label.description || label.name}
                >
                  {label.name}
                </span>
              );
            })}
            {issue.labels.length > 5 && (
              <span
                className="badge badge-subtle badge-mono"
                style={{ fontSize: '11px', padding: '2px 6px' }}
              >
                +{issue.labels.length - 5}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <button
          type="button"
          onClick={() => onSelectForExplanation(issue)}
          className="btn btn-dark btn-sm"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <Sparkles size={14} color="var(--accent-lime)" />
          Explain & Roadmap
        </button>

        <a
          href={issue.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline btn-sm"
          style={{
            padding: '6px 10px',
            color: 'var(--text-secondary)',
          }}
          title="Open original issue on GitHub (opens in new tab)"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </article>
  );
}
