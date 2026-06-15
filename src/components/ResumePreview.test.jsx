import { render, screen } from '@testing-library/react';
import ResumePreview from './ResumePreview';
import { createRef } from 'react';

const emptyData = {
  personal: { name: '', title: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
  experience: [{ id: 1, company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] }],
  education: [{ id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }],
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
    summary: 'Experienced engineer with a passion for building great products.',
  },
  experience: [
    {
      id: 1, company: 'Acme Corp', role: 'Senior Engineer',
      startDate: 'Jan 2022', endDate: '', current: true,
      bullets: ['Led migration to microservices reducing latency by 40%'],
    },
  ],
  education: [
    { id: 1, institution: 'MIT', degree: 'Bachelor of Science', field: 'Computer Science', startDate: '2015', endDate: '2019', gpa: '3.9' },
  ],
  projects: [
    { id: 1, name: 'ATS Builder', role: 'Lead Developer', url: 'github.com/user/ats', startDate: 'Jan 2024', endDate: 'Mar 2024', bullets: ['Built ATS resume builder with React'] },
  ],
  skills: {
    technical: 'Python, React, Node.js, AWS',
    soft: 'Leadership, Communication',
    languages: 'English (Native)',
    certifications: 'AWS Solutions Architect',
  },
};

describe('ResumePreview', () => {
  test('renders empty state placeholder when no data', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={emptyData} />);
    expect(screen.getByText(/Start filling the form/i)).toBeInTheDocument();
  });

  test('renders candidate name', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={fullData} />);
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  test('renders professional title', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={fullData} />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  test('renders email in contact line', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={fullData} />);
    expect(screen.getByText(/jane@example.com/)).toBeInTheDocument();
  });

  test('renders professional summary', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={fullData} />);
    expect(screen.getByText(/passion for building great products/i)).toBeInTheDocument();
  });

  test('renders Work Experience section', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={fullData} />);
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
  });

  test('renders Projects section', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={fullData} />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('ATS Builder')).toBeInTheDocument();
  });

  test('renders Education section', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={fullData} />);
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('MIT')).toBeInTheDocument();
  });

  test('renders Skills section', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={fullData} />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText(/Python, React, Node.js, AWS/)).toBeInTheDocument();
  });

  test('renders experience bullet points', () => {
    const ref = createRef();
    render(<ResumePreview ref={ref} data={fullData} />);
    expect(screen.getByText(/Led migration to microservices/)).toBeInTheDocument();
  });
});
