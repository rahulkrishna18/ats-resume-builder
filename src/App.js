import { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PersonalForm from './components/PersonalForm';
import ExperienceForm from './components/ExperienceForm';
import EducationForm from './components/EducationForm';
import ProjectsForm from './components/ProjectsForm';
import SkillsForm from './components/SkillsForm';
import ResumePreview from './components/ResumePreview';
import ATSChecker from './components/ATSChecker';
import JobMatchChecker from './components/JobMatchChecker';
import { initialData } from './initialData';

const NAV_TABS = [
  {
    id: 'builder',
    label: 'Resume Builder',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 'checker',
    label: 'Job Match Checker',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('builder');
  const [resumeData, setResumeData] = useState(initialData);
  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: resumeData.personal.name ? `${resumeData.personal.name} - Resume` : 'Resume',
    pageStyle: `
      @page { size: A4; margin: 0; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        #resume-preview {
          width: 210mm !important;
          min-height: 297mm !important;
          padding: 15mm 18mm !important;
          box-shadow: none !important;
          margin: 0 !important;
        }
      }
    `,
  });

  const setPersonal = (val) => setResumeData(d => ({ ...d, personal: val }));
  const setExperience = (val) => setResumeData(d => ({ ...d, experience: val }));
  const setEducation = (val) => setResumeData(d => ({ ...d, education: val }));
  const setProjects = (val) => setResumeData(d => ({ ...d, projects: val }));
  const setSkills = (val) => setResumeData(d => ({ ...d, skills: val }));

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo + tabs */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="font-bold text-slate-800 text-base tracking-tight">ResumeATS</span>
            </div>

            {/* Nav tabs */}
            <nav className="flex items-center gap-1">
              {NAV_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === 'checker' && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                      activeTab === tab.id ? 'bg-blue-500 text-blue-100' : 'bg-emerald-100 text-emerald-700'
                    }`}>New</span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Right actions — only show on builder tab */}
          {activeTab === 'builder' && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setResumeData(initialData)}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                Clear All
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Tab content */}
      {activeTab === 'builder' ? (
        <div className="max-w-[1600px] mx-auto px-4 py-6 flex gap-6 items-start">

          {/* LEFT: Form panel */}
          <div className="w-[380px] flex-shrink-0 space-y-0">
            <PersonalForm data={resumeData.personal} onChange={setPersonal} />
            <ExperienceForm data={resumeData.experience} onChange={setExperience} />
            <ProjectsForm data={resumeData.projects} onChange={setProjects} />
            <EducationForm data={resumeData.education} onChange={setEducation} />
            <SkillsForm data={resumeData.skills} onChange={setSkills} />
          </div>

          {/* CENTER: A4 Preview */}
          <div className="flex-1 flex flex-col items-center min-w-0">
            <div className="mb-3 flex items-center justify-between w-full max-w-[794px]">
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Live Preview — A4</p>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
            <div className="overflow-auto w-full flex justify-center">
              <div style={{ transform: 'scale(0.92)', transformOrigin: 'top center' }}>
                <ResumePreview ref={printRef} data={resumeData} />
              </div>
            </div>
          </div>

          {/* RIGHT: ATS Checker */}
          <div className="w-[300px] flex-shrink-0 sticky top-20">
            <ATSChecker data={resumeData} />
          </div>
        </div>
      ) : (
        <JobMatchChecker />
      )}
    </div>
  );
}
