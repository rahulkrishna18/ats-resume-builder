import FormSection from './FormSection';
import InputField from './InputField';

const CapIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M12 14l9-5-9-5-9 5 9 5z" />
    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
  </svg>
);

export default function EducationForm({ data, onChange }) {
  const updateEntry = (id, field, value) => {
    onChange(data.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const addEntry = () => {
    const newId = Math.max(...data.map(e => e.id), 0) + 1;
    onChange([...data, { id: newId, institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }]);
  };

  const removeEntry = (id) => {
    if (data.length === 1) return;
    onChange(data.filter(e => e.id !== id));
  };

  return (
    <FormSection title="Education" icon={<CapIcon />} defaultOpen={false}>
      <div className="mt-3 space-y-5">
        {data.map((entry, idx) => (
          <div key={entry.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Degree {idx + 1}</span>
              {data.length > 1 && (
                <button onClick={() => removeEntry(entry.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            <InputField label="Institution" value={entry.institution} onChange={v => updateEntry(entry.id, 'institution', v)} placeholder="Massachusetts Institute of Technology" />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <InputField label="Degree" value={entry.degree} onChange={v => updateEntry(entry.id, 'degree', v)} placeholder="Bachelor of Science" small />
              <InputField label="Field of Study" value={entry.field} onChange={v => updateEntry(entry.id, 'field', v)} placeholder="Computer Science" small />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <InputField label="Start Year" value={entry.startDate} onChange={v => updateEntry(entry.id, 'startDate', v)} placeholder="2018" small />
              <InputField label="End Year" value={entry.endDate} onChange={v => updateEntry(entry.id, 'endDate', v)} placeholder="2022" small />
              <InputField label="GPA (opt.)" value={entry.gpa} onChange={v => updateEntry(entry.id, 'gpa', v)} placeholder="3.9" small />
            </div>
          </div>
        ))}
        <button onClick={addEntry}
          className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Education
        </button>
      </div>
    </FormSection>
  );
}
