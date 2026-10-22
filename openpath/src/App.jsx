import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FrictionPoints from './components/FrictionPoints';
import HowItWorks from './components/HowItWorks';
import OpenSource101 from './components/OpenSource101';
import IssueDiscovery from './components/IssueDiscovery';
import OpportunitiesSection from './components/OpportunitiesSection';
import Footer from './components/Footer';
import AiExplainerModal from './components/AiExplainerModal';
import SetupModal from './components/SetupModal';

const DEFAULT_USER_SKILLS = ['JavaScript', 'React', 'HTML & CSS', 'Git Basics'];

export default function App() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [setupModalOpen, setSetupModalOpen] = useState(false);

  // Load user skills from localStorage or fallback
  const [userSkills, setUserSkills] = useState(() => {
    try {
      const saved = localStorage.getItem('openpath_user_skills');
      return saved ? JSON.parse(saved) : DEFAULT_USER_SKILLS;
    } catch {
      return DEFAULT_USER_SKILLS;
    }
  });

  const handleUpdateUserSkills = (newSkills) => {
    setUserSkills(newSkills);
    try {
      localStorage.setItem('openpath_user_skills', JSON.stringify(newSkills));
    } catch {
      // ignore
    }
  };

  const handleSelectIssue = (issue) => {
    setSelectedIssue(issue);
  };

  const handleCloseModal = () => {
    setSelectedIssue(null);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation Bar */}
      <Navbar onOpenSetupModal={() => setSetupModalOpen(true)} />

      {/* Main Content Sections */}
      <main style={{ flex: 1 }}>
        {/* Editorial Charcoal Hero Section */}
        <Hero />

        {/* Why Beginners Get Stuck */}
        <FrictionPoints />

        {/* 3-Step Process: How OpenPath Works */}
        <HowItWorks />

        {/* Open Source 101: Primitives & Etiquette */}
        <OpenSource101 />

        {/* Issue Discovery: Live Real-time GitHub Search */}
        <IssueDiscovery
          onSelectIssue={handleSelectIssue}
          selectedIssueId={selectedIssue?.id}
        />

        {/* Curated Opportunities & Programs */}
        <OpportunitiesSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* AI Explainer, Skill Readiness & Roadmap Modal */}
      {selectedIssue && (
        <AiExplainerModal
          issue={selectedIssue}
          onClose={handleCloseModal}
          userSkills={userSkills}
          onUpdateUserSkills={handleUpdateUserSkills}
          onOpenSetupModal={() => {
            setSelectedIssue(null);
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
