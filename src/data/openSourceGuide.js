/**
 * Open Source 101 Guide Data
 * Bite-sized, visual concepts for first-time contributors.
 */

export const GIT_CONCEPTS = [
  {
    id: 'repo',
    term: 'Repository (Repo)',
    badge: 'Structure',
    summary: 'The project’s complete home folder on GitHub.',
    description:
      'Contains all source files, documentation, version history, issues, pull requests, and automation workflows.',
    analogy: 'Think of it as a shared Google Drive folder that tracks every edit ever made in human history.',
  },
  {
    id: 'issue',
    term: 'Issue',
    badge: 'Communication',
    summary: 'A public task, bug report, or feature proposal.',
    description:
      'Where conversations happen. Maintainers and users discuss problems, paste error logs, and assign contributors.',
    analogy: 'A sticky note on a public corkboard: "The signup button is broken on Safari. Can someone fix it?"',
  },
  {
    id: 'fork',
    term: 'Fork',
    badge: 'Workspace',
    summary: 'Your independent copy of the repository on your own GitHub account.',
    description:
      'Because you cannot push directly to popular repositories without admin permissions, you fork it into your account so you can experiment safely.',
    analogy: 'Taking a photocopy of a textbook chapter so you can highlight and take your own notes on it.',
  },
  {
    id: 'branch',
    term: 'Branch',
    badge: 'Git Primitive',
    summary: 'An isolated timeline where you can make changes without breaking the main code.',
    description:
      'Always create a new branch like `fix/login-button` or `docs/fix-typo`. Never commit directly to your fork’s `main` branch.',
    analogy: 'A parallel universe where you test an experiment before deciding to merge it back into reality.',
  },
  {
    id: 'commit',
    term: 'Commit',
    badge: 'Git Primitive',
    summary: 'A saved snapshot of the changes you made, accompanied by a descriptive message.',
    description:
      'Like a game save point. Each commit has a unique hash and a message explaining what changed.',
    analogy: 'Saving your document with a note: "Updated header padding and fixed typo in README".',
  },
  {
    id: 'pr',
    term: 'Pull Request (PR)',
    badge: 'Collaboration',
    summary: 'A formal request to merge your changes into the original project.',
    description:
      'Maintainers will review your code, run automated tests (CI), and may suggest minor adjustments before approving.',
    analogy: 'Submitting your completed essay to your teacher or editor for feedback and publishing.',
  },
];

export const ETIQUETTE_TIPS = [
  {
    title: 'Ask Before Coding',
    desc: 'Check if another contributor is already working on the issue. Leave a brief comment: "Hi! I’d love to work on this issue if it’s still open."',
  },
  {
    title: 'Keep PRs Small & Focused',
    desc: 'Solve only what the issue asks for. Do not reformat the entire codebase or change unrelated files in the same pull request.',
  },
  {
    title: 'Always Link the Issue',
    desc: 'Write "Fixes #issue_number" in your Pull Request description so GitHub automatically links and closes the issue when merged.',
  },
  {
    title: 'Feedback Is Normal & Kind',
    desc: 'Code review comments are not a test score—they are how maintainers keep high-traffic software stable. Welcome suggestions with curiosity.',
  },
];
