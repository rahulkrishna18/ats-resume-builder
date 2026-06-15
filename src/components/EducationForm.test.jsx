import { render, screen, fireEvent } from '@testing-library/react';
import EducationForm from './EducationForm';

const defaultData = [
  { id: 1, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
];

describe('EducationForm', () => {
  test('renders Education heading', () => {
    render(<EducationForm data={defaultData} onChange={() => {}} />);
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  test('renders institution field after expanding', () => {
    render(<EducationForm data={defaultData} onChange={() => {}} />);
    const toggle = screen.getByText('Education').closest('button');
    fireEvent.click(toggle);
    expect(
      screen.getByPlaceholderText('Massachusetts Institute of Technology')
    ).toBeInTheDocument();
  });

  test('calls onChange when institution is typed', () => {
    const handleChange = jest.fn();
    render(<EducationForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByText('Education').closest('button');
    fireEvent.click(toggle);
    fireEvent.change(screen.getByPlaceholderText('Massachusetts Institute of Technology'), {
      target: { value: 'Stanford University' },
    });
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ institution: 'Stanford University' })])
    );
  });

  test('calls onChange when degree is typed', () => {
    const handleChange = jest.fn();
    render(<EducationForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByText('Education').closest('button');
    fireEvent.click(toggle);
    fireEvent.change(screen.getByPlaceholderText('Bachelor of Science'), {
      target: { value: 'Master of Science' },
    });
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ degree: 'Master of Science' })])
    );
  });

  test('Add Education button adds a new entry', () => {
    const handleChange = jest.fn();
    render(<EducationForm data={defaultData} onChange={handleChange} />);
    const toggle = screen.getByText('Education').closest('button');
    fireEvent.click(toggle);
    fireEvent.click(screen.getByText('Add Education'));
    expect(handleChange).toHaveBeenCalledWith(
      expect.arrayContaining([expect.objectContaining({ id: 2 })])
    );
  });

  test('remove button hidden when only one entry', () => {
    render(<EducationForm data={defaultData} onChange={() => {}} />);
    const toggle = screen.getByText('Education').closest('button');
    fireEvent.click(toggle);
    expect(screen.queryByTitle('remove')).not.toBeInTheDocument();
  });

  test('displays existing institution value', () => {
    const data = [{ ...defaultData[0], institution: 'MIT' }];
    render(<EducationForm data={data} onChange={() => {}} />);
    const toggle = screen.getByText('Education').closest('button');
    fireEvent.click(toggle);
    expect(screen.getByDisplayValue('MIT')).toBeInTheDocument();
  });

  test('renders GPA field', () => {
    render(<EducationForm data={defaultData} onChange={() => {}} />);
    const toggle = screen.getByText('Education').closest('button');
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText('3.9')).toBeInTheDocument();
  });
});
