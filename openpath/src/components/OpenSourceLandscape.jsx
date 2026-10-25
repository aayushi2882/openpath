import { BookOpen, Flag, GitBranch, GitPullRequest, Search, Sparkles } from 'lucide-react';

const platforms = [
  { name: 'programs', className: 'landscape-platform--programs' },
  { name: 'repository', className: 'landscape-platform--repository' },
  { name: 'project', className: 'landscape-platform--project' },
  { name: 'issue', className: 'landscape-platform--issue' },
  { name: 'contribution', className: 'landscape-platform--contribution' },
];

function RepositoryPlatform({ name, className }) {
  return <div className={`landscape-platform ${className}`} aria-hidden="true"><span>{name}</span></div>;
}

function JourneyLandmark({ className, icon: Icon, eyebrow, title }) {
  return (
    <div className={`landscape-landmark ${className}`} aria-hidden="true">
      <span className="landscape-landmark__icon"><Icon size={18} strokeWidth={1.8} /></span>
      <span className="landscape-landmark__copy">
        <span className="landscape-landmark__eyebrow">{eyebrow}</span>
        <span className="landscape-landmark__title">{title}</span>
      </span>
    </div>
  );
}

function ContributionPath() {
  const nodes = [[118, 490], [255, 411], [364, 366], [498, 359], [610, 276], [707, 270], [796, 153]];
  const path = 'M118 490 C186 457 219 441 255 411 S323 351 364 366 S453 421 498 359 S566 251 610 276 S676 336 707 270 S749 189 796 153';

  return (
    <svg className="landscape-route" viewBox="0 0 900 650" preserveAspectRatio="none" aria-hidden="true">
      <path className="landscape-route__underlay" d={path} />
      <path className="landscape-route__line" d={path} />
      <path className="landscape-route__runner" d={path} />
      {nodes.map(([cx, cy]) => <circle className="landscape-route__node" key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />)}
    </svg>
  );
}

export default function OpenSourceLandscape() {
  return (
    <figure className="openpath-hero__visual" aria-label="An illustrated open-source journey, moving from programs through a repository and first issue to a pull request.">
      <div className="landscape-stage" aria-hidden="true">
        <div className="landscape-atmosphere" />
        {platforms.map((platform) => <RepositoryPlatform key={platform.name} {...platform} />)}
        <ContributionPath />

        <div className="landscape-repo landscape-repo--main">
          <span className="landscape-repo__mark"><GitBranch size={17} /></span>
          <span><strong>open-source</strong><small>repository</small></span>
          <span className="landscape-repo__dots">•••</span>
        </div>
        <div className="landscape-repo landscape-repo--files">
          <span className="landscape-file"><i /> README.md</span>
          <span className="landscape-file"><i /> CONTRIBUTING</span>
          <span className="landscape-file"><i /> src / project</span>
        </div>

        <JourneyLandmark className="landmark--programs" icon={Sparkles} eyebrow="START HERE" title={<>Explore<br />programs</>} />
        <JourneyLandmark className="landmark--project" icon={BookOpen} eyebrow="GET CONTEXT" title={<>Understand<br />the project</>} />
        <JourneyLandmark className="landmark--issue" icon={Search} eyebrow="GOOD FIRST STEP" title={<>Find a good<br />first issue</>} />
        <JourneyLandmark className="landmark--pull" icon={GitPullRequest} eyebrow="YOUR FIRST" title={<>Pull request</>} />
        <span className="landscape-terminal landscape-terminal--left">// meaningful<br />// contributions<br />// for a more open world</span>
        <span className="landscape-terminal landscape-terminal--right">git checkout -b first-contribution<br />git push origin main</span>
        <span className="landscape-flag"><Flag size={16} fill="currentColor" /></span>
      </div>
      <figcaption className="sr-only">A conceptual landscape representing the path from discovering open-source programs to submitting a contribution.</figcaption>
    </figure>
  );
}
