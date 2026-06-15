import FormSection from './FormSection';
import InputField from './InputField';

const BriefcaseIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default function ExperienceForm({ data, onChange }) {
  const updateEntry = (id, field, value) => {
    onChange(data.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const updateBullet = (id, idx, value) => {
    onChange(data.map(e => {
      if (e.id !== id) return e;
      const bullets = [...e.bullets];
      bullets[idx] = value;
      return { ...e, bullets };
    }));
  };

  const addBullet = (id) => {
    onChange(data.map(e => e.id === id ? { ...e, bullets: [...e.bullets, ''] } : e));
  };

  const removeBullet = (id, idx) => {
    onChange(data.map(e => {
      if (e.id !== id) return e;
      const bullets = e.bullets.filter((_, i) => i !== idx);
      return { ...e, bullets: bullets.length ? bullets : [''] };
    }));
  };

  const addEntry = () => {
    const newId = Math.max(...data.map(e => e.id), 0) + 1;
    onChange([...data, { id: newId, company: '', role: '', startDate: '', endDate: '', current: false, bullets: [''] }]);
  };

  const removeEntry = (id) => {
    if (data.length === 1) return;
    onChange(data.filter(e => e.id !== id));
  };

  return (
    <FormSection title="Work Experience" icon={<BriefcaseIcon />} defaultOpen>
      <div className="mt-3 space-y-5">
        {data.map((entry, entryIdx) => (
          <div key={entry.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Position {entryIdx + 1}</span>
              {data.length > 1 && (
                <button onClick={() => removeEntry(entry.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            <InputField label="Job Title" value={entry.role} onChange={v => updateEntry(entry.id, 'role', v)} placeholder="Senior Software Engineer" />
            <InputField label="Company" value={entry.company} onChange={v => updateEntry(entry.id, 'company', v)} placeholder="Acme Corporation" />
            <div className="grid grid-cols-2 gap-3 mb-3">
              <InputField label="Start Date" value={entry.startDate} onChange={v => updateEntry(entry.id, 'startDate', v)} placeholder="Jan 2022" small />
              <div>
                <InputField label="End Date" value={entry.current ? 'Present' : entry.endDate} onChange={v => updateEntry(entry.id, 'endDate', v)} placeholder="Dec 2024" small />
                <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                  <input type="checkbox" checked={entry.current} onChange={e => updateEntry(entry.id, 'current', e.target.checked)}
                    className="w-3.5 h-3.5 accent-blue-600" />
                  <span className="text-xs text-slate-500">Current role</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Key Achievements / Responsibilities</label>
              <div className="space-y-2">
                {entry.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-blue-400 mt-2.5 text-xs">•</span>
                    <input
                      type="text"
                      value={bullet}
                      onChange={e => updateBullet(entry.id, idx, e.target.value)}
                      placeholder="Led migration to microservices, reducing latency by 40%..."
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 text-slate-700"
                    />
                    <button onClick={() => removeBullet(entry.id, idx)} className="mt-2 text-slate-300 hover:text-red-400 transition-colors flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => addBullet(entry.id)}
                className="mt-2 text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add bullet
              </button>
            </div>
          </div>
        ))}

        <button onClick={addEntry}
          className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-blue-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Position
        </button>
      </div>
    </FormSection>
  );
}
