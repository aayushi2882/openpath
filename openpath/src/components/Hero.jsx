import { Compass, Eye, Search } from 'lucide-react';
import './Hero.css';
import OpenSourceLandscape from './OpenSourceLandscape';

export default function Hero({ onExplorePrograms, onStartRepository, onWebsiteIssueDetective }) {
  return (
    <section className="openpath-hero" aria-labelledby="openpath-hero-title">
      <div className="container openpath-hero__layout">
        <div className="openpath-hero__copy">
          <h1 id="openpath-hero-title">
            Find your<br />
            way into<br />
            <span>open source.</span>
          </h1>

          <p className="openpath-hero__description">
            From exploring programs to finding the right repository, OpenPath helps you navigate your open-source journey.
          </p>

          <div className="openpath-hero__actions" aria-label="Get started">
            <button type="button" onClick={onStartRepository} className="btn btn-primary btn-lg openpath-hero__action">
              <Search size={16} strokeWidth={2.4} /> Find my first issue
            </button>
            <button type="button" onClick={onExplorePrograms} className="btn btn-dark btn-lg openpath-hero__action openpath-hero__action--secondary">
              <Compass size={16} /> Explore programs
            </button>
            <button type="button" onClick={onWebsiteIssueDetective} className="btn btn-dark btn-lg openpath-hero__action openpath-hero__action--secondary">
              <Eye size={16} /> Inspect a website
            </button>
          </div>

          <p className="openpath-hero__motto">Discover <span>·</span> Understand <span>·</span> Contribute</p>
        </div>

        <OpenSourceLandscape />
      </div>
    </section>
  );
}
