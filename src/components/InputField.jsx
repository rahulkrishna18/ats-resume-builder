export default function InputField({ label, value, onChange, placeholder, type = 'text', small = false }) {
  return (
    <div className={small ? '' : 'mb-3'}>
      {label && (
        <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 text-slate-700"
      />
    </div>
  );
}

export function TextareaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
      )}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 text-slate-700 resize-none"
      />
    </div>
  );
}
