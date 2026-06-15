import FormSection from './FormSection';
import InputField from './InputField';

const FolderIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  </svg>
);

export default function ProjectsForm({ data, onChange }) {
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
    onChange([...data, { id: newId, name: '', role: '', url: '', startDate: '', endDate: '', bullets: [''] }]);
  };

  const removeEntry = (id) => {
    if (data.length === 1) return;
    onChange(data.filter(e => e.id !== id));
  };

  return (
    <FormSection title="Projects" icon={<FolderIcon />} defaultOpen={false}>
      <div className="mt-3 space-y-5">
        {data.map((entry, entryIdx) => (
          <div key={entry.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project {entryIdx + 1}</span>
              {data.length > 1 && (
                <button onClick={() => removeEntry(entry.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3 mb-0">
              <InputField label="Project Name" value={entry.name} onChange={v => updateEntry(entry.id, 'name', v)} placeholder="E-commerce Platform" small />
              <InputField label="Your Role" value={entry.role} onChange={v => updateEntry(entry.id, 'role', v)} placeholder="Lead Developer" small />
            </div>
            <div className="mb-3 mt-0">
              <InputField label="URL / Link (optional)" value={entry.url} onChange={v => updateEntry(entry.id, 'url', v)} placeholder="github.com/user/project" />
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <InputField label="Start Date" value={entry.startDate} onChange={v => updateEntry(entry.id, 'startDate', v)} placeholder="Jan 2023" small />
              <InputField label="End Date" value={entry.endDate} onChange={v => updateEntry(entry.id, 'endDate', v)} placeholder="Mar 2023 / Ongoing" small />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-500 mb-2">Description / Impact</label>
              <div className="space-y-2">
                {entry.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <span className="text-blue-400 mt-2.5 text-xs">•</span>
                    <input
                      type="text"
                      value={bullet}
                      onChange={e => updateBullet(entry.id, idx, e.target.value)}
                      placeholder="Built REST API serving 10k+ daily users using Node.js & PostgreSQL..."
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
          Add Project
        </button>
      </div>
    </FormSection>
  );
}
