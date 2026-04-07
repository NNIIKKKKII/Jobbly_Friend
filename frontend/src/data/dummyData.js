export const dashboardJobs = [
  {
    id: 'frontend-intern-01',
    title: 'Frontend Engineer Intern',
    company: 'Vercel Labs',
    location: 'Remote',
    status: 'Applied',
    coldEmail: false,
    addedAt: '2026-04-01T09:00:00.000Z',
    appliedAt: '2026-04-05T09:00:00.000Z',
    techStack: ['React', 'TypeScript', 'Tailwind'],
    matchScore: 82,
    description:
      'Work with the product engineering team to build polished user interfaces, improve internal tooling, and help ship high-quality frontend features for developer workflows.',
    skillGaps: [
      { label: 'React fundamentals', level: 'strong' },
      { label: 'TypeScript fluency', level: 'strong' },
      { label: 'Testing with Playwright', level: 'gap' },
      { label: 'Design systems experience', level: 'gap' },
    ],
  },
  {
    id: 'backend-fellow-02',
    title: 'Backend Developer Fellow',
    company: 'Supabase',
    location: 'Bengaluru, India',
    status: 'Interview',
    coldEmail: false,
    addedAt: '2026-04-02T09:00:00.000Z',
    appliedAt: '2026-04-03T09:00:00.000Z',
    techStack: ['Python', 'PostgreSQL', 'APIs'],
    matchScore: 76,
    description:
      'Contribute to backend services, improve API reliability, and support developer-facing tooling around database workflows and auth systems.',
    skillGaps: [
      { label: 'Python APIs', level: 'strong' },
      { label: 'SQL schema design', level: 'strong' },
      { label: 'Distributed systems', level: 'gap' },
      { label: 'Go services', level: 'missing' },
    ],
  },
  {
    id: 'ml-assistant-03',
    title: 'ML/AI Student Assistant',
    company: 'OpenAI Research Lab',
    location: 'San Francisco, CA',
    status: 'Discovered',
    coldEmail: true,
    addedAt: '2026-04-03T09:00:00.000Z',
    techStack: ['Python', 'LLMs', 'Evaluation'],
    matchScore: 91,
    description:
      'Help prototype evaluation pipelines, synthesize research findings, and support experimentation for student-facing AI workflows.',
    skillGaps: [
      { label: 'Prompt design', level: 'strong' },
      { label: 'Python scripting', level: 'strong' },
      { label: 'Model evaluation', level: 'strong' },
      { label: 'Fine-tuning workflows', level: 'gap' },
    ],
  },
  {
    id: 'mobile-intern-04',
    title: 'Mobile App Intern',
    company: 'Flutter Forge',
    location: 'Hybrid, Mumbai',
    status: 'Saved',
    coldEmail: false,
    addedAt: '2026-04-06T09:00:00.000Z',
    techStack: ['Flutter', 'Dart', 'Firebase'],
    matchScore: null,
    description:
      'Build and iterate on cross-platform mobile experiences, collaborate with product teams, and support analytics and release workflows.',
    skillGaps: [
      { label: 'Dart syntax', level: 'strong' },
      { label: 'Flutter widgets', level: 'gap' },
      { label: 'CI/CD for mobile', level: 'missing' },
    ],
  },
]

export const reminders = [
  'Follow up on your Vercel Labs application on Friday.',
  'Finish the DSA prep sheet before the Supabase interview mock.',
]

export const adminMetrics = {
  activeStudents: 128,
  applicationsTracked: 842,
  coverLettersGenerated: 311,
}

export const adminUsers = [
  {
    id: 'admin-001',
    name: 'Nadia Admin',
    email: 'admin@jobfriend.dev',
    role: 'admin',
    suspended: false,
    jobCount: 27,
  },
  {
    id: 'student-001',
    name: 'Aarav Patel',
    email: 'aarav@trackjr.dev',
    role: 'student',
    suspended: false,
    jobCount: 8,
  },
  {
    id: 'student-002',
    name: 'Riya Singh',
    email: 'riya@jobfriend.dev',
    role: 'student',
    suspended: true,
    jobCount: 4,
  },
  {
    id: 'mentor-001',
    name: 'Karan Mehta',
    email: 'karan@jobfriend.dev',
    role: 'mentor',
    suspended: false,
    jobCount: 11,
  },
]

export const searchJobs = [
  {
    id: 'search-frontend-01',
    title: 'Junior Frontend Developer',
    company: 'Netlify Studio',
    location: 'Remote',
    salary: '$22/hr',
    techStack: ['React', 'JavaScript', 'CSS'],
    description:
      'Support product teams by shipping landing pages, dashboards, and user-facing improvements.',
  },
  {
    id: 'search-backend-02',
    title: 'Backend Platform Intern',
    company: 'Railway',
    location: 'Remote',
    salary: '$28/hr',
    techStack: ['Node.js', 'PostgreSQL', 'APIs'],
    description:
      'Help maintain backend services and internal tooling used by developer infrastructure teams.',
  },
  {
    id: 'search-ml-03',
    title: 'AI Tools Intern',
    company: 'Scale Forge',
    location: 'Bengaluru, India',
    salary: '$18/hr',
    techStack: ['Python', 'LLMs', 'Prompting'],
    description:
      'Prototype AI-assisted workflows, evaluate outputs, and support lightweight product experiments.',
  },
  {
    id: 'search-mobile-04',
    title: 'Mobile Engineering Trainee',
    company: 'SwiftPath',
    location: 'Hybrid, Pune',
    salary: '$20/hr',
    techStack: ['Flutter', 'Firebase', 'Mobile UI'],
    description:
      'Build new mobile features and assist with QA, testing, and release readiness for the app team.',
  },
]
