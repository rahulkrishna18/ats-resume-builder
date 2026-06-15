import { render, screen } from '@testing-library/react';
import ATSChecker from './ATSChecker';

const emptyData = {
  personal: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    summary: '',
  },
  experience: [
    { id: 1, company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] },
  ],
  education: [
    { id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
  ],
  projects: [{ id: 1, name: '', role: '', url: '', startDate: '', endDate: '', bullets: [''] }],
  skills: { technical: '', soft: '', languages: '', certifications: '' },
};

const fullData = {
  personal: {
    name: 'Jane Smith',
    title: 'Software Engineer',
    email: 'jane@example.com',
    phone: '+1 555 000 0000',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/jane',
    website: 'janesmith.dev',
    summary:
      'Experienced software engineer with 5 years of experience building scalable web applications.',
  },
  experience: [
    {
      id: 1,
      company: 'Acme Corp',
      role: 'Senior Engineer',
      startDate: 'Jan 2022',
      endDate: '',
      current: true,
      bullets: ['Led a team of 5 engineers to build a microservices platform'],
    },
  ],
  education: [
    {
      id: 1,
      institution: 'MIT',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2015',
      endDate: '2019',
      gpa: '3.9',
    },
  ],
  projects: [
    {
      id: 1,
      name: 'Portfolio',
      role: 'Developer',
      url: 'github.com',
      startDate: '2023',
      endDate: '2023',
      bullets: ['Built a portfolio site'],
    },
  ],
  skills: {
    technical: 'Python, React, Node.js, AWS, Docker',
    soft: 'Leadership, Communication',
    languages: 'English',
    certifications: 'AWS Solutions Architect',
  },
};

describe('ATSChecker', () => {
  test('renders ATS Score heading', () => {
    render(<ATSChecker data={emptyData} />);
    expect(screen.getByText('ATS Score')).toBeInTheDocument();
  });

  test('shows score out of 100', () => {
    render(<ATSChecker data={emptyData} />);
    expect(screen.getByText('/ 100')).toBeInTheDocument();
  });

  test('shows low score for empty data', () => {
    render(<ATSChecker data={emptyData} />);
    const scoreEl = screen.getByText('/ 100');
    const scoreValue = scoreEl.previousSibling?.textContent;
    expect(Number(scoreValue)).toBeLessThan(50);
  });

  test('shows high score for complete data', () => {
    render(<ATSChecker data={fullData} />);
    const scoreEl = screen.getByText('/ 100');
    const scoreValue = scoreEl.previousSibling?.textContent;
    expect(Number(scoreValue)).toBeGreaterThanOrEqual(70);
  });

  test('renders checklist items', () => {
    render(<ATSChecker data={emptyData} />);
    expect(screen.getByText('Email address present')).toBeInTheDocument();
    expect(screen.getByText('Skills section populated')).toBeInTheDocument();
  });

  test('shows improvement tips when data is incomplete', () => {
    render(<ATSChecker data={emptyData} />);
    expect(screen.getByText('Top Improvement Tips')).toBeInTheDocument();
  });

  test('renders rule-based compatibility check subtitle', () => {
    render(<ATSChecker data={emptyData} />);
    expect(screen.getByText('Rule-based compatibility check')).toBeInTheDocument();
  });
});
