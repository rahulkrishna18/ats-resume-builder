import FormSection from './FormSection';
import InputField, { TextareaField } from './InputField';

const PersonIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export default function PersonalForm({ data, onChange }) {
  const set = (field) => (val) => onChange({ ...data, [field]: val });

  return (
    <FormSection title="Personal Info" icon={<PersonIcon />} defaultOpen>
      <div className="mt-3">
        <InputField
          label="Full Name"
          value={data.name}
          onChange={set('name')}
          placeholder="Jane Smith"
        />
        <InputField
          label="Professional Title"
          value={data.title}
          onChange={set('title')}
          placeholder="Senior Product Manager"
        />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <InputField
            label="Email"
            value={data.email}
            onChange={set('email')}
            placeholder="jane@company.com"
            type="email"
            small
          />
          <InputField
            label="Phone"
            value={data.phone}
            onChange={set('phone')}
            placeholder="+1 555 000 0000"
            small
          />
        </div>
        <InputField
          label="Location"
          value={data.location}
          onChange={set('location')}
          placeholder="San Francisco, CA"
        />
        <div className="grid grid-cols-2 gap-3 mb-3">
          <InputField
            label="LinkedIn"
            value={data.linkedin}
            onChange={set('linkedin')}
            placeholder="linkedin.com/in/jane"
            small
          />
          <InputField
            label="Website / Portfolio"
            value={data.website}
            onChange={set('website')}
            placeholder="janesmith.dev"
            small
          />
        </div>
        <TextareaField
          label="Professional Summary"
          value={data.summary}
          onChange={set('summary')}
          placeholder="Brief 2-3 sentence overview of your career and key strengths..."
          rows={4}
        />
      </div>
    </FormSection>
  );
}
