const checks = [
  {
    id: 'email',
    label: 'Email address present',
    points: 15,
    test: (d) => !!d.personal.email && d.personal.email.includes('@'),
    tip: 'Add a professional email address — ATS systems use it as the primary contact identifier.',
  },
  {
    id: 'phone',
    label: 'Phone number present',
    points: 10,
    test: (d) => !!d.personal.phone,
    tip: 'Include a phone number to pass basic contact completeness checks.',
  },
  {
    id: 'name',
    label: 'Full name present',
    points: 10,
    test: (d) => d.personal.name.trim().split(' ').length >= 2,
    tip: 'Use your full name (first + last) — some ATS systems require both parts.',
  },
  {
    id: 'summary',
    label: 'Professional summary included',
    points: 10,
    test: (d) => d.personal.summary.trim().length > 50,
    tip: 'A summary of 50+ characters greatly improves keyword match rates.',
  },
  {
    id: 'skills',
    label: 'Skills section populated',
    points: 20,
    test: (d) => (d.skills.technical || d.skills.soft || d.skills.languages || d.skills.certifications).trim().length > 10,
    tip: 'Skills are the #1 factor ATS systems parse. Add at least 5 relevant keywords.',
  },
  {
    id: 'experience',
    label: 'Work experience with bullets',
    points: 20,
    test: (d) => d.experience.some(e => e.company && e.role && e.bullets.some(b => b.trim().length > 10)),
    tip: 'Bullet points should include quantified achievements (numbers, % impact, $$).',
  },
  {
    id: 'education',
    label: 'Education section present',
    points: 10,
    test: (d) => d.education.some(e => e.institution && e.degree),
    tip: 'Many ATS filters screen by minimum education level — always include this.',
  },
  {
    id: 'dates',
    label: 'Dates on experience entries',
    points: 5,
    test: (d) => d.experience.some(e => e.startDate),
    tip: 'ATS systems parse employment dates to calculate tenure gaps.',
  },
];

function getScoreColor(score) {
  if (score >= 80) return { ring: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', label: 'Strong' };
  if (score >= 55) return { ring: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700', label: 'Fair' };
  return { ring: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700', label: 'Weak' };
}

export default function ATSChecker({ data }) {
  const results = checks.map(c => ({ ...c, passed: c.test(data) }));
  const score = results.filter(r => r.passed).reduce((sum, r) => sum + r.points, 0);
  const colors = getScoreColor(score);
  const failed = results.filter(r => !r.passed);

  const circumference = 2 * Math.PI * 30;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`rounded-xl border ${colors.border} ${colors.bg} overflow-hidden`}>
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-slate-200 bg-white/60">
        <div className="flex items-center gap-2 mb-0.5">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">ATS Score</span>
        </div>
        <p className="text-xs text-slate-500">Rule-based compatibility check</p>
      </div>

      <div className="px-5 py-4">
        {/* Score ring */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="40" cy="40" r="30" fill="none"
                stroke={score >= 80 ? '#10b981' : score >= 55 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xl font-bold ${colors.ring}`}>{score}</span>
              <span className="text-xs text-slate-400 -mt-0.5">/ 100</span>
            </div>
          </div>
          <div>
            <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
              {colors.label}
            </span>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              {score >= 80 ? 'Your resume is well-optimized for ATS systems.' :
               score >= 55 ? 'Good start — a few improvements will boost your chances.' :
               'Fill in more sections to improve ATS compatibility.'}
            </p>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-1.5">
          {results.map(r => (
            <div key={r.id} className="flex items-start gap-2.5">
              <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${r.passed ? 'bg-emerald-100' : 'bg-slate-100'}`}>
                {r.passed ? (
                  <svg className="w-2.5 h-2.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium ${r.passed ? 'text-slate-700' : 'text-slate-500 line-through'}`}>
                  {r.label}
                </p>
                <span className={`text-xs ${r.passed ? 'text-emerald-600' : 'text-slate-400'}`}>+{r.points} pts</span>
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        {failed.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-200">
            <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Top Improvement Tips</p>
            <div className="space-y-2">
              {failed.slice(0, 3).map(r => (
                <div key={r.id} className="flex gap-2 items-start">
                  <span className="text-amber-500 text-xs mt-0.5 flex-shrink-0">▸</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{r.tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
