import { useState } from 'react';
import { BookOpen, GitBranch, Search, Sparkles, ArrowRight } from 'lucide-react';

const stages = [
  { title: 'Choose a program', icon: BookOpen, tag: 'Official entry points', copy: 'Explore initiatives and follow their official project links.' },
  { title: 'Select a repository', icon: GitBranch, tag: 'Your project', copy: 'Bring a public GitHub repository you want to explore.' },
  { title: 'Browse real issues', icon: Search, tag: 'Live GitHub data', copy: 'Read open issues and onboarding documents from that repository.' },
  { title: 'Plan a contribution', icon: Sparkles, tag: 'AI when configured', copy: 'Get transparent issue guidance and follow a practical roadmap.' },
];

export default function JourneyVisual() {
  const [activeStage, setActiveStage] = useState(0);
  const selected = stages[activeStage];
  const SelectedIcon = selected.icon;

  return (
    <section aria-label="The OpenPath journey" style={{ backgroundColor: '#181A1F', border: '1px solid #282C35', borderRadius: 'var(--radius-lg)', padding: '28px 24px', boxShadow: 'var(--shadow-dark)' }}>
      <div style={{ marginBottom: '18px' }}>
        <span className="badge badge-dark-lime badge-mono" style={{ marginBottom: '8px' }}>A GUIDED OPEN-SOURCE JOURNEY</span>
        <h2 style={{ color: '#FFFFFF', fontSize: '18px' }}>From choosing a path to preparing a contribution</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: '10px' }}>
        {stages.map((stage, index) => {
          const Icon = stage.icon;
          const active = activeStage === index;
          return (
            <button key={stage.title} type="button" onClick={() => setActiveStage(index)} aria-pressed={active} style={{ textAlign: 'left', minHeight: '120px', cursor: 'pointer', background: active ? '#22262E' : '#14161A', color: '#F4F4F6', border: `1px solid ${active ? 'var(--accent-lime)' : '#262932'}`, borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}><Icon size={17} color={active ? 'var(--accent-lime)' : '#9FA6B2'} /><span className="font-mono" style={{ color: '#8B929E', fontSize: '10px' }}>STEP 0{index + 1}</span></span>
              <strong style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>{stage.title}</strong>
              <span style={{ color: '#9FA6B2', fontSize: '11px' }}>{stage.tag}</span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite" style={{ marginTop: '12px', padding: '13px 15px', background: '#131518', border: '1px solid #23262E', borderRadius: 'var(--radius-md)', display: 'flex', gap: '10px', alignItems: 'center', color: '#D1D5DB', fontSize: '13px' }}>
        <SelectedIcon size={16} color="var(--accent-lime)" />
        <span style={{ flex: 1 }}>{selected.copy}</span>
        <ArrowRight size={14} color="var(--accent-lime)" />
      </div>
    </section>
  );
}
