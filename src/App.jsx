import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FrictionPoints from './components/FrictionPoints';
import HowItWorks from './components/HowItWorks';
import OpenSource101 from './components/OpenSource101';
import OpportunitiesSection from './components/OpportunitiesSection';
import RepositoryWorkspace from './components/RepositoryWorkspace';
import WebsiteIssueDetective from './components/WebsiteIssueDetective';
import Footer from './components/Footer';
import AiExplainerModal from './components/AiExplainerModal';
import SetupModal from './components/SetupModal';

const DEFAULT_USER_SKILLS = ['JavaScript', 'React', 'HTML & CSS', 'Git Basics'];

export default function App() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [setupModalOpen, setSetupModalOpen] = useState(false);
  const [journey, setJourney] = useState('home');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [repositoryReturnTo, setRepositoryReturnTo] = useState('home');
  const [explanationRepository, setExplanationRepository] = useState(null);
  const [explanationExperience, setExplanationExperience] = useState('New to open source');

  const startRepositoryWorkspace = (returnTo = 'home') => {
    setSelectedProgram(null);
    setRepositoryReturnTo(returnTo);
    setJourney('repository');
  };

  const selectProgram = (program, returnTo = 'programs') => {
    setSelectedProgram(program);
    setRepositoryReturnTo(returnTo);
    setJourney('repository');
  };

  // Load user skills from localStorage or fallback
  const [userSkills, setUserSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('openpath_user_skills');
      const parsed = saved ? JSON.parse(saved) : DEFAULT_USER_SKILLS;
      return Array.isArray(parsed) ? parsed.filter((skill) => typeof skill === 'string' && skill.trim()) : DEFAULT_USER_SKILLS;
    } catch (error) {
      console.warn('Could not load saved OpenPath skills; using defaults.', error);
      return DEFAULT_USER_SKILLS;
    }
  });

  const handleUpdateUserSkills = (newSkills) => {
    setUserSkills(newSkills);
    try {
      localStorage.setItem('openpath_user_skills', JSON.stringify(newSkills));
    } catch (error) {
      console.warn('Could not save OpenPath skills to local storage.', error);
    }
  };

  const handleSelectIssue = (issue, repository = null, experience = 'New to open source') => {
    setSelectedIssue(issue);
    setExplanationRepository(repository);
    setExplanationExperience(experience);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
    setExplanationRepository(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation Bar */}
      <Navbar
        onOpenSetupModal={() => setSetupModalOpen(true)}
        onNavigateHome={() => setJourney('home')}
        onExplorePrograms={() => setJourney('programs')}
        onStartRepository={() => startRepositoryWorkspace(journey === 'programs' ? 'programs' : 'home')}
        onWebsiteIssueDetective={() => setJourney('website-analysis')}
      />

      {journey === 'home' && (
        <>
          <Hero
            onExplorePrograms={() => setJourney('programs')}
            onStartRepository={() => startRepositoryWorkspace()}
            onWebsiteIssueDetective={() => setJourney('website-analysis')}
          />
          <OpportunitiesSection
            preview
            onViewAllPrograms={() => setJourney('programs')}
            onSelectProgram={(program) => selectProgram(program)}
            onStartRepository={() => startRepositoryWorkspace('programs')}
          />
          <FrictionPoints />
          <HowItWorks onStartRepository={() => startRepositoryWorkspace()} />
          <OpenSource101 onExplorePrograms={() => setJourney('programs')} />
        </>
      )}

      {journey === 'programs' && (
        <OpportunitiesSection
          onBack={() => setJourney('home')}
          onSelectProgram={(program) => selectProgram(program)}
          onStartRepository={() => startRepositoryWorkspace('programs')}
        />
      )}

      {journey === 'repository' && (
        <RepositoryWorkspace
          program={selectedProgram}
          userSkills={userSkills}
          onUpdateUserSkills={handleUpdateUserSkills}
          onSelectIssue={handleSelectIssue}
          onBack={() => setJourney(repositoryReturnTo)}
          onOpenSetupModal={() => setSetupModalOpen(true)}
        />
      )}

      {journey === 'website-analysis' && (
        <WebsiteIssueDetective onBack={() => setJourney('home')} />
      )}

      {/* Footer */}
      <Footer
        onNavigateHome={() => setJourney('home')}
        onExplorePrograms={() => setJourney('programs')}
        onStartRepository={() => startRepositoryWorkspace(journey === 'programs' ? 'programs' : 'home')}
      />

      {/* AI Explainer, Skill Readiness & Roadmap Modal */}
      {selectedIssue && (
        <AiExplainerModal
          issue={selectedIssue}
          repository={explanationRepository}
          experience={explanationExperience}
          onClose={handleCloseModal}
          userSkills={userSkills}
          onUpdateUserSkills={handleUpdateUserSkills}
          onOpenSetupModal={() => {
            setSelectedIssue(null);
            setExplanationRepository(null);
            setSetupModalOpen(true);
          }}
        />
      )}

      {/* Setup & Health Check Modal */}
      <SetupModal
        isOpen={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
      />
    </div>
  );
}
