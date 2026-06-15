import { render, screen, fireEvent } from '@testing-library/react';
import ProjectsForm from './ProjectsForm';

const defaultData = [
  { id: 1, name: '', role: '', url: '', startDate: '', endDate: '', bullets: [''] },
];

describe('ProjectsForm', () => {
  test('renders Projects heading', () => {
    render(<ProjectsForm data={defaultData} onChange={() => {}} />);
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  test('renders project fields after expanding', () => {
    render(<ProjectsForm data={defaultData} onChange={() => {}} />);
    const toggle = screen.getByRole('button', { name: /Projects/i });
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText('E-commerce Platform')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Lead Developer')).toBeInTheDocument();
  });

  test('calls onChange when project name is typed', () => {
    const handleChange = jest.fn();
    render(<ProjectsForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByRole('button', { name: /Projects/i });
    fireEvent.click(toggle);
    fireEvent.change(screen.getByPlaceholderText('E-commerce Platform'), {
      target: { value: 'ATS Resume Builder' },
    });
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ name: 'ATS Resume Builder' })])
    );
  });

  test('calls onChange when role is typed', () => {
    const handleChange = jest.fn();
    render(<ProjectsForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByRole('button', { name: /Projects/i });
    fireEvent.click(toggle);
    fireEvent.change(screen.getByPlaceholderText('Lead Developer'), {
      target: { value: 'Full Stack Developer' },
    });
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ role: 'Full Stack Developer' })])
    );
  });

  test('Add Project button adds a new entry', () => {
    const handleChange = jest.fn();
    render(<ProjectsForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByRole('button', { name: /Projects/i });
    fireEvent.click(toggle);
    fireEvent.click(screen.getByText('Add Project'));
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 2 })])
    );
  });

  test('Add bullet adds a new bullet point', () => {
    const handleChange = jest.fn();
    render(<ProjectsForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByRole('button', { name: /Projects/i });
    fireEvent.click(toggle);
    fireEvent.click(screen.getByText('Add bullet'));
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ bullets: expect.arrayContaining(['', '']) }),
      ])
    );
  });

  test('renders URL field', () => {
    render(<ProjectsForm data={defaultData} onChange={() => {}} />);
    const toggle = screen.getByRole('button', { name: /Projects/i });
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText('github.com/user/project')).toBeInTheDocument();
  });

  test('displays existing project name value', () => {
    const data = [{ ...defaultData[0], name: 'My Portfolio' }];
    render(<ProjectsForm data={data} onChange={() => {}} />);
    const toggle = screen.getByRole('button', { name: /Projects/i });
    fireEvent.click(toggle);
    expect(screen.getByDisplayValue('My Portfolio')).toBeInTheDocument();
  });
});
