import FormSection from './FormSection';
import { TextareaField } from './InputField';

const StarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

export default function SkillsForm({ data, onChange }) {
  const set = (field) => (val) => onChange({ ...data, [field]: val });

  return (
    <FormSection title="Skills" icon={<StarIcon />} defaultOpen={false}>
      <div className="mt-3">
        <TextareaField
          label="Technical Skills"
          value={data.technical}
          onChange={set('technical')}
          placeholder="Python, React, Node.js, PostgreSQL, Docker, AWS, REST APIs..."
          rows={2}
        />
        <TextareaField
          label="Soft Skills"
          value={data.soft}
          onChange={set('soft')}
          placeholder="Team Leadership, Strategic Planning, Cross-functional Collaboration..."
          rows={2}
        />
        <div className="grid grid-cols-2 gap-3">
          <TextareaField
            label="Languages"
            value={data.languages}
            onChange={set('languages')}
            placeholder="English (Native), Spanish (Fluent)..."
            rows={2}
          />
          <TextareaField
            label="Certifications"
            value={data.certifications}
            onChange={set('certifications')}
            placeholder="AWS Solutions Architect, PMP, CISSP..."
            rows={2}
          />
        </div>
      </div>
    </FormSection>
  );
}
