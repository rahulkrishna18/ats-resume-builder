import { render, screen, fireEvent } from '@testing-library/react';
import PersonalForm from './PersonalForm';

const defaultData = {
  name: '',
  title: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  website: '',
  summary: '',
};

describe('PersonalForm', () => {
  test('renders Personal Info section heading', () => {
    render(<PersonalForm data={defaultData} onChange={() => {}} />);
    expect(screen.getByText('Personal Info')).toBeInTheDocument();
  });

  test('renders all input fields', () => {
    render(<PersonalForm data={defaultData} onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('jane@company.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('+1 555 000 0000')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('San Francisco, CA')).toBeInTheDocument();
  });

  test('calls onChange when name is typed', () => {
    const handleChange = jest.fn();
    render(<PersonalForm data={defaultData} onChange={handleChange} />);
    fireEvent.change(screen.getByPlaceholderText('Jane Smith'), {
      target: { value: 'John Doe' },
    });
    expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({ name: 'John Doe' }));
  });

  test('calls onChange when email is typed', () => {
    const handleChange = jest.fn();
    render(<PersonalForm data={defaultData} onChange={handleChange} />);
    fireEvent.change(screen.getByPlaceholderText('jane@company.com'), {
      target: { value: 'john@example.com' },
    });
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'john@example.com' })
    );
  });

  test('displays existing values in inputs', () => {
    const data = { ...defaultData, name: 'Jane Smith', email: 'jane@example.com' };
    render(<PersonalForm data={data} onChange={() => {}} />);
    expect(screen.getByDisplayValue('Jane Smith')).toBeInTheDocument();
    expect(screen.getByDisplayValue('jane@example.com')).toBeInTheDocument();
  });

  test('section collapses and expands on click', () => {
    render(<PersonalForm data={defaultData} onChange={() => {}} />);
    const toggle = screen.getByRole('button', { name: /Personal Info/i });
    fireEvent.click(toggle);
    expect(screen.queryByPlaceholderText('Jane Smith')).not.toBeInTheDocument();
    fireEvent.click(toggle);
    expect(screen.getByPlaceholderText('Jane Smith')).toBeInTheDocument();
  });
});
