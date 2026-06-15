import { render, screen, fireEvent } from '@testing-library/react';
import SkillsForm from './SkillsForm';

const defaultData = {
  technical: '',
  soft: '',
  languages: '',
  certifications: '',
};

describe('SkillsForm', () => {
  test('renders Skills heading', () => {
    render(<SkillsForm data={defaultData} onChange={() => {}} />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });

  test('renders all skill fields after expanding', () => {
    render(<SkillsForm data={defaultData} onChange={() => {}} />);
    const toggle = screen.getByText('Skills').closest('button');
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText(/Python, React, Node.js/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Team Leadership/)).toBeInTheDocument();
  });

  test('calls onChange when technical skills are typed', () => {
    const handleChange = jest.fn();
    render(<SkillsForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByText('Skills').closest('button');
    fireEvent.click(toggle);
    fireEvent.change(screen.getByPlaceholderText(/Python, React, Node.js/), {
      target: { value: 'Python, React, AWS' },
    });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ technical: 'Python, React, AWS' })
    );
  });

  test('calls onChange when soft skills are typed', () => {
    const handleChange = jest.fn();
    render(<SkillsForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByText('Skills').closest('button');
    fireEvent.click(toggle);
    fireEvent.change(screen.getByPlaceholderText(/Team Leadership/), {
      target: { value: 'Leadership, Teamwork' },
    });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ soft: 'Leadership, Teamwork' })
    );
  });

  test('calls onChange when certifications are typed', () => {
    const handleChange = jest.fn();
    render(<SkillsForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByText('Skills').closest('button');
    fireEvent.click(toggle);
    fireEvent.change(screen.getByPlaceholderText(/AWS Solutions Architect/), {
      target: { value: 'AWS Solutions Architect' },
    });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ certifications: 'AWS Solutions Architect' })
    );
  });

  test('displays existing technical skills value', () => {
    const data = { ...defaultData, technical: 'Python, React' };
    render(<SkillsForm data={data} onChange={() => {}} />);
    const toggle = screen.getByText('Skills').closest('button');
    fireEvent.click(toggle);
    expect(screen.getByDisplayValue('Python, React')).toBeInTheDocument();
  });
});
