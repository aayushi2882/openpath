import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Plus, X, BrainCircuit, ShieldAlert } from 'lucide-react';

const COMMON_PRESETS = [
  'JavaScript',
  'TypeScript',
  'React',
  'Python',
  'HTML & CSS',
  'Git Basics',
  'Node.js',
  'Documentation',
  'Docker',
  'Go',
  'Rust',
  'Java',
];

export default function SkillReadinessCard({
  issue,
  aiAnalysis,
  userSkills,
  onUpdateUserSkills,
}) {
  const [customSkill, setCustomSkill] = useState('');

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !userSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      const updated = [...userSkills, trimmed];
      onUpdateUserSkills(updated);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updated = userSkills.filter((s) => s !== skillToRemove);
    onUpdateUserSkills(updated);
  };

  // Derive matches and gaps either from AI analysis or heuristics on issue labels/text
  const issueSkillsLower = (
    aiAnalysis?.relevantSkills ||
    issue?.labels?.map((l) => l.name) ||
    []
  ).map((s) => s.toLowerCase());

  const matching = userSkills.filter((userSk) =>
    issueSkillsLower.some(
      (issSk) =>
        issSk.includes(userSk.toLowerCase()) || userSk.toLowerCase().includes(issSk)
    )
  );

  const skillsToLearn = (aiAnalysis?.relevantSkills || []).filter(
    (reqSk) =>
      !userSkills.some(
        (userSk) =>
          userSk.toLowerCase().includes(reqSk.toLowerCase()) ||
          reqSk.toLowerCase().includes(userSk.toLowerCase())
      )
  );

  // Difficulty estimate
  const difficulty =
    aiAnalysis?.skillReadiness?.difficultyEstimate ||
    (issue?.labels?.some((l) => l.name.toLowerCase().includes('good first'))
      ? 'Cautious Estimate: Beginner-friendly'
      : 'Cautious Estimate: Moderate / Intermediate');

  const rationale =
    aiAnalysis?.skillReadiness?.rationale ||
    (matching.length > 0
      ? `You have skills (${matching.join(', ')}) that align with this issue's technology stack.`
      : 'You have not added matching skills yet. You can still tackle this by learning the basics or improving documentation.');

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit size={18} color="var(--accent-amber)" />
          <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Skill Readiness Assessment
          </h3>
        </div>
        <span className="badge badge-amber badge-mono" style={{ fontSize: '11px' }}>
          Cautionary Estimate
        </span>
      </div>

      {/* User Skills Selector */}
      <div style={{ marginBottom: '22px' }}>
        <label
          style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            marginBottom: '8px',
          }}
        >
          Your Stated Skills (Saved locally):
        </label>

        {/* Selected Skill Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
          {userSkills.map((sk) => (
            <span
              key={sk}
              className="badge badge-subtle"
              style={{
                fontSize: '12px',
                padding: '4px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                border: '1px solid var(--border-medium)',
              }}
            >
              {sk}
              <button
                type="button"
                onClick={() => handleRemoveSkill(sk)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-tertiary)',
                  display: 'flex',
                  padding: 0,
                }}
                aria-label={`Remove ${sk}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}

          {userSkills.length === 0 && (
            <span style={{ fontSize: '12px', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
              No skills selected yet. Click any preset below or type your own.
            </span>
          )}
        </div>

        {/* Preset Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {COMMON_PRESETS.filter((p) => !userSkills.includes(p))
            .slice(0, 8)
            .map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAddSkill(preset)}
                className="btn btn-ghost btn-sm"
                style={{
                  fontSize: '11.5px',
                  padding: '2px 8px',
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px dashed var(--border-medium)',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                + {preset}
              </button>
            ))}
        </div>

        {/* Add custom skill input */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="input-text"
            placeholder="Add another skill (e.g. Tailwind, Docker, C++)..."
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill(customSkill);
                setCustomSkill('');
              }
            }}
            style={{ fontSize: '13px', padding: '8px 12px' }}
          />
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => {
              handleAddSkill(customSkill);
              setCustomSkill('');
            }}
            disabled={!customSkill.trim()}
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '20px',
        }}
      >
        {/* Matching Skills */}
        <div
          style={{
            backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#166534',
              marginBottom: '6px',
            }}
          >
            <CheckCircle2 size={16} color="#16A34A" />
            Relevant Skills You Have
          </div>
          <p style={{ fontSize: '12.5px', color: '#15803D', lineHeight: '1.4' }}>
            {matching.length > 0 ? matching.join(', ') : 'None of your listed skills explicitly matched the issue tags.'}
          </p>
        </div>

        {/* Skills to Learn */}
        <div
          style={{
            backgroundColor: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#1E40AF',
              marginBottom: '6px',
            }}
          >
            <AlertCircle size={16} color="#2563EB" />
            Skills You May Need to Learn
          </div>
          <p style={{ fontSize: '12.5px', color: '#1D4ED8', lineHeight: '1.4' }}>
            {skillsToLearn.length > 0
              ? skillsToLearn.join(', ')
              : 'No major new technical requirements identified from the issue description.'}
          </p>
        </div>
      </div>

      {/* Difficulty & Rationale */}
      <div
        style={{
          backgroundColor: 'var(--bg-canvas)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
            Estimated Complexity:
          </span>
          <span className="badge badge-amber badge-mono" style={{ fontSize: '11px' }}>
            {difficulty}
          </span>
        </div>

        <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>
          {rationale}
        </p>
      </div>

      {/* Honest Cautionary Note */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px',
          fontSize: '12px',
          color: 'var(--text-tertiary)',
          lineHeight: '1.4',
        }}
      >
        <ShieldAlert size={15} color="var(--accent-amber)" style={{ flexShrink: 0, marginTop: '1px' }} />
        <span>
          <strong>Explicit Note:</strong> This is a cautious estimate based purely on the issue description. We do not claim guaranteed success; repository configuration and CI test suites may require extra setup time.
        </span>
      </div>
    </div>
  );
}
