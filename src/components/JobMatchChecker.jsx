import { useState, useCallback } from 'react';
import { analyzeMatch, extractTextFromPDF } from '../utils/atsEngine';

const CATEGORY_META = {
  hardSkills: {
    label: 'Technical / Hard Skills',
    color: 'blue',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    pill: 'bg-blue-100 text-blue-700',
  },
  softSkills: {
    label: 'Soft Skills',
    color: 'violet',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    pill: 'bg-violet-100 text-violet-700',
  },
  experience: {
    label: 'Role / Experience',
    color: 'amber',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    pill: 'bg-amber-100 text-amber-700',
  },
  education: {
    label: 'Education',
    color: 'emerald',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    pill: 'bg-emerald-100 text-emerald-700',
  },
};

function ScoreRing({ score, size = 120 }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 75 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Weak Match';
  const labelColor =
    score >= 75 ? 'text-emerald-600' : score >= 50 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox="0 0 120 120" className="-rotate-90">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${labelColor}`}>{score}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <span className={`mt-2 text-sm font-semibold ${labelColor}`}>{label}</span>
    </div>
  );
}

function CategoryBar({ cat, data }) {
  const meta = CATEGORY_META[cat];
  const pct = data.total === 0 ? 100 : Math.round((data.matched / data.total) * 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-slate-600">{meta.label}</span>
        <span className="text-xs text-slate-500">
          {data.matched}/{data.total} keywords
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            backgroundColor: pct >= 75 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444',
          }}
        />
      </div>
    </div>
  );
}

function KeywordPill({ keyword, found }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
        found
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-red-50 text-red-600 border-red-200'
      }`}
    >
      {found ? (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      )}
      {keyword}
    </span>
  );
}

export default function JobMatchChecker() {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [resumeFileName, setResumeFileName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [activeSection, setActiveSection] = useState('overview'); // 'overview' | 'matched' | 'missing'
  const [dragOver, setDragOver] = useState(false);

  const processFile = useCallback(async (file) => {
    if (!file) return;
    setError('');
    setLoading(true);
    setResumeFileName(file.name);
    try {
      if (file.type === 'application/pdf') {
        const text = await extractTextFromPDF(file);
        setResumeText(text);
      } else if (file.type === 'text/plain') {
        const text = await file.text();
        setResumeText(text);
      } else {
        setError('Please upload a PDF or plain text (.txt) file.');
        setResumeFileName('');
      }
    } catch (e) {
      setError('Failed to parse the file. Try pasting the resume text instead.');
      setResumeFileName('');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFileDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      processFile(file);
    },
    [processFile]
  );

  const handleAnalyze = () => {
    if (!jobDescription.trim()) {
      setError('Please paste a job description.');
      return;
    }
    if (!resumeText.trim()) {
      setError('Please upload or paste your resume.');
      return;
    }
    setError('');
    const analysis = analyzeMatch(jobDescription, resumeText);
    setResult(analysis);
    setActiveSection('overview');
  };

  const handleReset = () => {
    setResult(null);
    setJobDescription('');
    setResumeText('');
    setResumeFileName('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Job Match ATS Checker</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Upload your resume and paste a job description to see how well your resume matches the
            role — fully in your browser, no data sent anywhere.
          </p>
        </div>

        {!result ? (
          /* Input stage */
          <div className="grid grid-cols-2 gap-6">
            {/* Job Description */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
                <div className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-violet-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Job Description</p>
                  <p className="text-xs text-slate-400">Paste the full JD from any job board</p>
                </div>
              </div>
              <div className="p-4">
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the complete job description here...&#10;&#10;e.g. We are looking for a Senior Software Engineer with 5+ years of experience in Python, React, and AWS. The ideal candidate has strong communication skills and experience with Agile methodologies..."
                  rows={16}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 text-slate-700 resize-none"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-400">{jobDescription.length} characters</span>
                  {jobDescription && (
                    <button
                      onClick={() => setJobDescription('')}
                      className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Resume Input */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-3.5 h-3.5 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">Your Resume</p>
                  <p className="text-xs text-slate-400">Upload PDF or paste plain text</p>
                </div>
              </div>

              {/* Tab switcher */}
              <div className="flex border-b border-slate-100">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/30' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Upload PDF / TXT
                </button>
                <button
                  onClick={() => setActiveTab('paste')}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${activeTab === 'paste' ? 'text-blue-600 border-b-2 border-blue-500 bg-blue-50/30' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  Paste Text
                </button>
              </div>

              <div className="p-4">
                {activeTab === 'upload' ? (
                  <div>
                    <label
                      htmlFor="resume-upload"
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleFileDrop}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-all h-40 ${
                        dragOver
                          ? 'border-blue-400 bg-blue-50'
                          : resumeFileName
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      {loading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                          <span className="text-sm text-slate-500">Parsing PDF...</span>
                        </div>
                      ) : resumeFileName ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-emerald-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <span className="text-sm font-medium text-emerald-700">
                            {resumeFileName}
                          </span>
                          <span className="text-xs text-emerald-600">
                            {resumeText.length.toLocaleString()} characters extracted
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2 px-4 text-center">
                          <svg
                            className="w-8 h-8 text-slate-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          <span className="text-sm text-slate-500">
                            Drag & drop or click to upload
                          </span>
                          <span className="text-xs text-slate-400">
                            PDF or TXT — parsed entirely in your browser
                          </span>
                        </div>
                      )}
                    </label>
                    <input
                      id="resume-upload"
                      type="file"
                      accept=".pdf,.txt"
                      className="hidden"
                      onChange={(e) => processFile(e.target.files[0])}
                    />
                    {resumeFileName && (
                      <button
                        onClick={() => {
                          setResumeFileName('');
                          setResumeText('');
                        }}
                        className="mt-2 text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Remove file
                      </button>
                    )}
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume text here...&#10;&#10;Include your full resume: summary, experience, skills, education, projects..."
                      rows={14}
                      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-300 text-slate-700 resize-none"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-400">{resumeText.length} characters</span>
                      {resumeText && (
                        <button
                          onClick={() => setResumeText('')}
                          className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analyze button + error */}
            <div className="col-span-2 flex flex-col items-center gap-3">
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-2.5 text-sm">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  {error}
                </div>
              )}
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="flex items-center gap-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-xl transition-colors shadow-md shadow-blue-200 text-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Analyze ATS Match
              </button>
              <p className="text-xs text-slate-400 text-center max-w-sm">
                All processing happens in your browser. Your resume and JD never leave your device.
              </p>
            </div>
          </div>
        ) : (
          /* Results stage */
          <div>
            {/* Top actions */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                New Analysis
              </button>
              <span className="text-xs text-slate-400">
                {result.totalKeywords} keywords extracted from JD · {result.matchedKeywords.length}{' '}
                found in resume
              </span>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {/* Left: Score overview */}
              <div className="col-span-1 space-y-4">
                {/* Score card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
                  <ScoreRing score={result.score} />
                  <div className="mt-5 w-full space-y-3">
                    {Object.entries(result.categoryScores).map(
                      ([cat, data]) =>
                        data.total > 0 && <CategoryBar key={cat} cat={cat} data={data} />
                    )}
                  </div>
                </div>

                {/* Quick tips */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wide mb-3">
                    Top Recommendations
                  </p>
                  <div className="space-y-2">
                    {result.score < 40 && (
                      <p className="text-xs text-amber-700 flex gap-1.5">
                        <span className="flex-shrink-0">▸</span>Your resume has very low keyword
                        overlap. Review the job requirements and tailor your experience section
                        directly to the role.
                      </p>
                    )}
                    {result.categoryScores.hardSkills?.total > 0 &&
                      result.categoryScores.hardSkills?.score < 60 && (
                        <p className="text-xs text-amber-700 flex gap-1.5">
                          <span className="flex-shrink-0">▸</span>You're missing key technical
                          skills. Add any relevant tools you've used to your Skills section, even if
                          briefly.
                        </p>
                      )}
                    {result.missingKeywords.length > 0 && (
                      <p className="text-xs text-amber-700 flex gap-1.5">
                        <span className="flex-shrink-0">▸</span>Weave{' '}
                        {Math.min(5, result.missingKeywords.length)} missing keywords naturally into
                        your summary or experience bullet points.
                      </p>
                    )}
                    {result.score >= 75 && (
                      <p className="text-xs text-amber-700 flex gap-1.5">
                        <span className="flex-shrink-0">▸</span>Strong match! Ensure your bullet
                        points quantify achievements with numbers (%, $, team size).
                      </p>
                    )}
                    {result.categoryScores.softSkills?.total > 0 &&
                      result.categoryScores.softSkills?.score < 50 && (
                        <p className="text-xs text-amber-700 flex gap-1.5">
                          <span className="flex-shrink-0">▸</span>Include soft skills mentioned in
                          the JD (e.g. "leadership", "collaboration") in your summary or experience
                          bullets.
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Right: Keyword breakdown */}
              <div className="col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-100">
                  {[
                    { id: 'overview', label: 'By Category' },
                    { id: 'matched', label: `Matched (${result.matchedKeywords.length})` },
                    { id: 'missing', label: `Missing (${result.missingKeywords.length})` },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveSection(tab.id)}
                      className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${
                        activeSection === tab.id
                          ? 'text-blue-600 border-blue-500 bg-blue-50/30'
                          : 'text-slate-500 border-transparent hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-5 overflow-y-auto" style={{ maxHeight: '560px' }}>
                  {activeSection === 'overview' && (
                    <div className="space-y-6">
                      {Object.entries(result.byCategory).map(([cat, items]) => {
                        if (items.length === 0) return null;
                        const meta = CATEGORY_META[cat];
                        const matched = items.filter((r) => r.found).length;
                        return (
                          <div key={cat}>
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className={`text-xs font-bold uppercase tracking-wider ${meta.text}`}
                              >
                                {meta.label}
                              </span>
                              <span className="text-xs text-slate-400">
                                {matched}/{items.length} matched
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {items.map((r) => (
                                <KeywordPill key={r.keyword} keyword={r.keyword} found={r.found} />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeSection === 'matched' && (
                    <div>
                      {result.matchedKeywords.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-slate-400">
                          <svg
                            className="w-10 h-10 mb-3 opacity-40"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                          <p className="text-sm">No keywords matched yet.</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-slate-500 mb-3">
                            These keywords from the JD appear in your resume:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {result.matchedKeywords.map((r) => (
                              <KeywordPill key={r.keyword} keyword={r.keyword} found={true} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {activeSection === 'missing' && (
                    <div>
                      {result.missingKeywords.length === 0 ? (
                        <div className="flex flex-col items-center py-12 text-emerald-500">
                          <svg
                            className="w-10 h-10 mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-sm font-medium">
                            All keywords matched! Perfect score.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs text-slate-500 mb-3">
                            These keywords appear in the JD but are{' '}
                            <span className="font-semibold text-red-600">not found</span> in your
                            resume. Consider adding the relevant ones:
                          </p>
                          <div className="space-y-4">
                            {Object.entries(result.byCategory).map(([cat, items]) => {
                              const missing = items.filter((r) => !r.found);
                              if (missing.length === 0) return null;
                              const meta = CATEGORY_META[cat];
                              return (
                                <div key={cat}>
                                  <p
                                    className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${meta.text}`}
                                  >
                                    {meta.label}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {missing.map((r) => (
                                      <KeywordPill
                                        key={r.keyword}
                                        keyword={r.keyword}
                                        found={false}
                                      />
                                    ))}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
