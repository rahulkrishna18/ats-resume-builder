import { render, screen, fireEvent } from '@testing-library/react';
import ExperienceForm from './ExperienceForm';

const defaultData = [
  { id: 1, company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] },
];

describe('ExperienceForm', () => {
  test('renders Work Experience heading', () => {
    render(<ExperienceForm data={defaultData} onChange={() => {}} />);
    expect(screen.getByText('Work Experience')).toBeInTheDocument();
  });

  test('renders position fields after expanding', () => {
    render(<ExperienceForm data={defaultData} onChange={() => {}} />);
    const toggle = screen.getByRole('button', { name: /Work Experience/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText('Acme Corporation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senior Software Engineer')).toBeInTheDocument();
  });

  test('calls onChange when company is typed', () => {
    const handleChange = jest.fn();
    render(<ExperienceForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByRole('button', { name: /Work Experience/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    fireEvent.change(screen.getByPlaceholderText('Acme Corporation'), {
      target: { value: 'Google' },
    });
    expect(handleChange).toHaveBeenCalled();
  });

  test('Add Position button adds a new entry', () => {
    const handleChange = jest.fn();
    render(<ExperienceForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByRole('button', { name: /Work Experience/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    fireEvent.click(screen.getByText('Add Position'));
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 2 })])
    );
  });

  test('current role checkbox toggles correctly', () => {
    const handleChange = jest.fn();
    render(<ExperienceForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByRole('button', { name: /Work Experience/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ current: true })])
    );
  });

  test('Add bullet adds a new bullet point', () => {
    const handleChange = jest.fn();
    render(<ExperienceForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByRole('button', { name: /Work Experience/i });
    fireEvent.click(toggle);
    fireEvent.click(toggle);
    fireEvent.click(screen.getByText('Add bullet'));
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ bullets: expect.arrayContaining(['', '']) }),
      ])
    );
  });
});
