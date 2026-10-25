import { ArrowRight, ExternalLink, Compass } from 'lucide-react';
import { OPPORTUNITIES } from '../data/opportunities';

export default function OpportunitiesSection({ onSelectProgram, onStartRepository, onBack, preview = false, onViewAllPrograms }) {
  const programs = preview ? OPPORTUNITIES.slice(0, 4) : OPPORTUNITIES;

  return (
    <section id="opportunities" aria-labelledby="programs-heading" style={{ padding: preview ? '64px 0' : '48px 0 80px', backgroundColor: 'var(--bg-canvas)', scrollMarginTop: '76px' }}>
      <div className="container">
        {onBack && (
          <button type="button" onClick={onBack} className="btn btn-ghost btn-sm" style={{ marginBottom: '22px' }}>
            ← Back to OpenPath
          </button>
        )}
        <div style={{ maxWidth: '720px', marginBottom: '32px' }}>
          <span className="badge badge-subtle badge-mono" style={{ marginBottom: '12px' }}>PROGRAM DIRECTORY</span>
          {preview ? (
            <h2 id="programs-heading" style={{ fontSize: 'clamp(30px, 4vw, 42px)', marginBottom: '12px' }}>Explore Open-Source Programs</h2>
          ) : (
            <h1 id="programs-heading" style={{ fontSize: 'clamp(30px, 4vw, 42px)', marginBottom: '12px' }}>Explore Open-Source Programs</h1>
          )}
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Programs are optional guidance. Explore an official program or continue straight to any public GitHub repository; current project and participation details live on each program’s official site.
          </p>
          {!preview && onStartRepository && (
            <button type="button" onClick={onStartRepository} className="btn btn-outline" style={{ marginTop: '16px' }}>
              <Compass size={15} /> Skip programs and find an issue in any repository <ArrowRight size={15} />
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '18px' }}>
          {programs.map((program) => (
            <article key={program.id} className="card-light" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)', fontSize: '11px', textTransform: 'uppercase' }}>
                  {program.organization}
                </span>
                <h2 style={{ fontSize: '19px', margin: '8px 0' }}>{program.name}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', lineHeight: 1.55 }}>{program.description}</p>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="badge badge-subtle">{program.focus}</span>
                <a href={program.officialUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  Explore Program <ExternalLink size={13} />
                </a>
              </div>
              <button type="button" onClick={() => onSelectProgram(program)} className="btn btn-dark" style={{ width: '100%' }}>
                <Compass size={15} /> Continue with this program (optional) <ArrowRight size={15} />
              </button>
            </article>
          ))}
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '12px', marginTop: '18px' }}>
          OpenPath does not verify program cycles, deadlines, eligibility, or project participation. Confirm details with the linked organizers.
        </p>
        {preview && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '28px' }}>
            <button type="button" onClick={onViewAllPrograms} className="btn btn-outline">
              View all programs <ArrowRight size={15} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
