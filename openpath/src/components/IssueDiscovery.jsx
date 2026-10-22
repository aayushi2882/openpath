import { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { searchGithubIssues } from '../services/api';
import IssueCard from './IssueCard';

const LANGUAGES = [
  { id: 'all', label: 'All Languages' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'html', label: 'HTML / CSS' },
  { id: 'rust', label: 'Rust' },
  { id: 'go', label: 'Go' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
];

const LABELS = [
  { id: 'good first issue', label: 'good first issue' },
  { id: 'help wanted', label: 'help wanted' },
  { id: 'documentation', label: 'documentation' },
  { id: 'beginner', label: 'beginner' },
  { id: 'hacktoberfest', label: 'hacktoberfest' },
];

const QUICK_PICKS = [
  { name: '✨ First Timers', label: 'good first issue', lang: 'all', q: '' },
  { name: '⚛️ React & UI', label: 'good first issue', lang: 'javascript', q: 'react' },
  { name: '🐍 Python Bugs', label: 'good first issue', lang: 'python', q: '' },
  { name: '📘 Docs & Typos', label: 'documentation', lang: 'all', q: 'typo' },
  { name: '🦀 Rust Helpers', label: 'good first issue', lang: 'rust', q: '' },
];

export default function IssueDiscovery({ onSelectIssue, selectedIssueId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedLabel, setSelectedLabel] = useState('good first issue');
  const [sortOrder, setSortOrder] = useState('updated');
  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to page 1 on new query
    }, 450);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const [refreshCount, setRefreshCount] = useState(0);

  const handleRefresh = () => {
    setRefreshCount((c) => c + 1);
  };

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    searchGithubIssues({
      q: debouncedSearch,
      language: selectedLanguage,
      label: selectedLabel,
      sort: sortOrder,
      page: currentPage,
      per_page: 12,
    })
      .then((data) => {
        if (!isCancelled) {
          setIssues(data.items || []);
          setTotalCount(data.total_count || 0);
          setRateLimitInfo(data.rate_limit || null);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          console.error('Issue search error:', err);
          setError({
            message: err.message || 'Could not fetch issues from GitHub.',
            isRateLimit: Boolean(err.isRateLimit),
          });
          setIssues([]);
        }
      })
      .finally(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [debouncedSearch, selectedLanguage, selectedLabel, sortOrder, currentPage, refreshCount]);

  const handleQuickPick = (pick) => {
    setSelectedLabel(pick.label);
    setSelectedLanguage(pick.lang);
    setSearchTerm(pick.q);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('all');
    setSelectedLabel('good first issue');
    setSortOrder('updated');
    setCurrentPage(1);
  };

  return (
    <section
      id="discover-issues"
      style={{
        padding: '72px 0',
        backgroundColor: 'var(--bg-canvas)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div style={{ maxWidth: '720px', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <span className="badge badge-dark-lime badge-mono" style={{ backgroundColor: '#181A1F' }}>
              LIVE GITHUB REPOSITORIES
            </span>
            {rateLimitInfo?.remaining !== null && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                }}
              >
                API requests left: {rateLimitInfo.remaining} / {rateLimitInfo.limit || 60}
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Find your next open-source contribution
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Real public GitHub issues with beginner-friendly labels. Select any issue to translate technical jargon into understandable steps.
          </p>
        </div>

        {/* Quick Pick Presets */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontWeight: 600 }}>
            Quick Picks:
          </span>
          {QUICK_PICKS.map((pick, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleQuickPick(pick)}
              className="btn btn-outline btn-sm"
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                backgroundColor:
                  selectedLabel === pick.label &&
                  selectedLanguage === pick.lang &&
                  searchTerm === pick.q
                    ? 'var(--bg-subtle)'
                    : '#FFFFFF',
                borderColor:
                  selectedLabel === pick.label &&
                  selectedLanguage === pick.lang &&
                  searchTerm === pick.q
                    ? 'var(--text-primary)'
                    : 'var(--border-subtle)',
              }}
            >
              {pick.name}
            </button>
          ))}
        </div>

        {/* Main Search & Filter Control Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-sm)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            alignItems: 'center',
          }}
        >
          {/* Keyword Search */}
          <div style={{ position: 'relative', gridColumn: 'span 2' }} className="search-input-col">
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
              }}
            />
            <input
              type="text"
              className="input-text"
              placeholder="Search by keywords (e.g. login, docs, dark mode, bug)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Language Selector */}
          <div>
            <select
              className="select-custom"
              value={selectedLanguage}
              onChange={(e) => {
                setSelectedLanguage(e.target.value);
                setCurrentPage(1);
              }}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Label Selector */}
          <div>
            <select
              className="select-custom"
              value={selectedLabel}
              onChange={(e) => {
                setSelectedLabel(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Any Label</option>
              {LABELS.map((lbl) => (
                <option key={lbl.id} value={lbl.id}>
                  label: {lbl.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div>
            <select
              className="select-custom"
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="updated">Recently Updated</option>
              <option value="created">Newly Created</option>
              <option value="comments">Comments Activity</option>
            </select>
          </div>
        </div>

        {/* Results Metadata Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          <div>
            {loading ? (
              <span>Querying GitHub REST API...</span>
            ) : (
              <span>
                Found <strong style={{ color: 'var(--text-primary)' }}>{totalCount.toLocaleString()}</strong> live open issues on GitHub
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="btn btn-ghost btn-sm"
            style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Error / Rate Limit Banner */}
        {error && (
          <div
            style={{
              backgroundColor: error.isRateLimit ? '#FFFBEB' : '#FEF2F2',
              border: `1px solid ${error.isRateLimit ? '#FDE68A' : '#FECACA'}`,
              borderRadius: 'var(--radius-md)',
              padding: '18px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '14px',
            }}
          >
            <AlertTriangle
              size={20}
              color={error.isRateLimit ? '#D97706' : '#DC2626'}
              style={{ flexShrink: 0, marginTop: '2px' }}
            />
            <div>
              <h4
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: error.isRateLimit ? '#92400E' : '#991B1B',
                  marginBottom: '4px',
                }}
              >
                {error.isRateLimit ? 'GitHub API Rate Limit' : 'Search Request Failed'}
              </h4>
              <p
                style={{
                  fontSize: '13px',
                  color: error.isRateLimit ? '#B45309' : '#B91C1C',
                  lineHeight: '1.45',
                  marginBottom: '10px',
                }}
              >
                {error.message}
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="btn btn-outline btn-sm"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: error.isRateLimit ? '#F59E0B' : '#EF4444',
                    fontSize: '12px',
                  }}
                >
                  Retry Search
                </button>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: '12px' }}
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Skeletons */}
        {loading && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
            }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="card-light"
                style={{ height: '240px', display: 'flex', flexDirection: 'column', gap: '14px' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div className="skeleton" style={{ width: '120px', height: '18px' }} />
                  <div className="skeleton" style={{ width: '60px', height: '18px' }} />
                </div>
                <div className="skeleton" style={{ width: '85%', height: '22px' }} />
                <div className="skeleton" style={{ width: '100%', height: '48px' }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div className="skeleton" style={{ width: '60px', height: '18px' }} />
                  <div className="skeleton" style={{ width: '80px', height: '18px' }} />
                </div>
                <div className="skeleton" style={{ width: '100%', height: '32px', marginTop: 'auto' }} />
              </div>
            ))}
          </div>
        )}

        {/* Issue Cards Grid */}
        {!loading && !error && issues.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px',
              marginBottom: '36px',
            }}
          >
            {issues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                isSelected={selectedIssueId === issue.id}
                onSelectForExplanation={onSelectIssue}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && issues.length === 0 && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px dashed var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '60px 24px',
              textAlign: 'center',
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: 'var(--text-secondary)',
              }}
            >
              <Search size={22} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
              No matching issues found
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Try broadening your keyword query or switching the language filter to "All Languages".
            </p>
            <button type="button" onClick={handleResetFilters} className="btn btn-dark btn-sm">
              Reset Filters to Defaults
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {!loading && !error && issues.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '32px',
            }}
          >
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                padding: '0 8px',
              }}
            >
              Page {currentPage}
            </span>

            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={issues.length < 12}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 768px) {
          .search-input-col {
            grid-column: span 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
