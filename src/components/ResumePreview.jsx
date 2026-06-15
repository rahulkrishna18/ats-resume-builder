import { forwardRef } from 'react';

const SectionTitle = ({ children }) => (
  <div className="mb-2">
    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500">{children}</h2>
    <div className="h-px bg-slate-300 mt-1" />
  </div>
);

const ResumePreview = forwardRef(({ data }, ref) => {
  const { personal, experience, education, projects, skills } = data;

  const hasSkills = skills.technical || skills.soft || skills.languages || skills.certifications;
  const hasExperience = experience.some(e => e.company || e.role);
  const hasEducation = education.some(e => e.institution || e.degree);
  const hasProjects = projects && projects.some(p => p.name || p.role);

  return (
    <div
      ref={ref}
      id="resume-preview"
      className="a4-page font-serif"
      style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontSize: '10.5pt', color: '#1a1a2e', lineHeight: 1.45 }}
    >
      {/* Header */}
      <div className="mb-4">
        {personal.name ? (
          <h1 style={{ fontSize: '22pt', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.15 }}>
            {personal.name}
          </h1>
        ) : (
          <h1 style={{ fontSize: '22pt', fontWeight: 700, color: '#cbd5e1' }}>Your Name</h1>
        )}
        {personal.title && (
          <p style={{ fontSize: '11pt', color: '#475569', marginTop: '2px', fontStyle: 'italic' }}>{personal.title}</p>
        )}

        {/* Contact line */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '6px', fontSize: '9pt', color: '#64748b' }}>
          {personal.email && <span>✉ {personal.email}</span>}
          {personal.phone && <span>✆ {personal.phone}</span>}
          {personal.location && <span>⌖ {personal.location}</span>}
          {personal.linkedin && <span>in {personal.linkedin}</span>}
          {personal.website && <span>⬡ {personal.website}</span>}
        </div>
        <div className="h-px bg-slate-800 mt-3" />
      </div>

      {/* Summary */}
      {personal.summary && (
        <div className="mb-4">
          <SectionTitle>Professional Summary</SectionTitle>
          <p style={{ fontSize: '10pt', color: '#334155', lineHeight: 1.6 }}>{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {hasExperience && (
        <div className="mb-4">
          <SectionTitle>Work Experience</SectionTitle>
          <div className="space-y-3">
            {experience.filter(e => e.company || e.role).map((exp) => (
              <div key={exp.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '10.5pt', color: '#0f172a' }}>{exp.role || 'Role'}</p>
                    <p style={{ fontSize: '10pt', color: '#475569', fontStyle: 'italic' }}>{exp.company}</p>
                  </div>
                  <p style={{ fontSize: '9pt', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '12px', marginTop: '1px' }}>
                    {exp.startDate}{exp.startDate && (exp.current || exp.endDate) ? ' – ' : ''}{exp.current ? 'Present' : exp.endDate}
                  </p>
                </div>
                {exp.bullets.filter(b => b.trim()).length > 0 && (
                  <ul style={{ marginTop: '4px', paddingLeft: '14px', listStyleType: 'disc' }}>
                    {exp.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: '9.5pt', color: '#334155', marginBottom: '2px', lineHeight: 1.5 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {hasProjects && (
        <div className="mb-4">
          <SectionTitle>Projects</SectionTitle>
          <div className="space-y-3">
            {projects.filter(p => p.name || p.role).map((proj) => (
              <div key={proj.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '10.5pt', color: '#0f172a' }}>
                      {proj.name}
                      {proj.url && (
                        <span style={{ fontWeight: 400, fontSize: '9pt', color: '#3b82f6', marginLeft: '8px' }}>
                          ⬡ {proj.url}
                        </span>
                      )}
                    </p>
                    {proj.role && (
                      <p style={{ fontSize: '10pt', color: '#475569', fontStyle: 'italic' }}>{proj.role}</p>
                    )}
                  </div>
                  <p style={{ fontSize: '9pt', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '12px', marginTop: '1px' }}>
                    {proj.startDate}{proj.startDate && proj.endDate ? ' – ' : ''}{proj.endDate}
                  </p>
                </div>
                {proj.bullets.filter(b => b.trim()).length > 0 && (
                  <ul style={{ marginTop: '4px', paddingLeft: '14px', listStyleType: 'disc' }}>
                    {proj.bullets.filter(b => b.trim()).map((b, i) => (
                      <li key={i} style={{ fontSize: '9.5pt', color: '#334155', marginBottom: '2px', lineHeight: 1.5 }}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {hasEducation && (
        <div className="mb-4">
          <SectionTitle>Education</SectionTitle>
          <div className="space-y-2">
            {education.filter(e => e.institution || e.degree).map((edu) => (
              <div key={edu.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: '10.5pt', color: '#0f172a' }}>{edu.institution}</p>
                  <p style={{ fontSize: '10pt', color: '#475569', fontStyle: 'italic' }}>
                    {[edu.degree, edu.field].filter(Boolean).join(', ')}
                    {edu.gpa && <span style={{ color: '#64748b' }}> · GPA: {edu.gpa}</span>}
                  </p>
                </div>
                <p style={{ fontSize: '9pt', color: '#64748b', whiteSpace: 'nowrap', marginLeft: '12px', marginTop: '1px' }}>
                  {edu.startDate}{edu.startDate && edu.endDate ? ' – ' : ''}{edu.endDate}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {hasSkills && (
        <div className="mb-4">
          <SectionTitle>Skills</SectionTitle>
          <div className="space-y-1">
            {skills.technical && (
              <p style={{ fontSize: '9.5pt', color: '#334155' }}>
                <span style={{ fontWeight: 700 }}>Technical: </span>{skills.technical}
              </p>
            )}
            {skills.soft && (
              <p style={{ fontSize: '9.5pt', color: '#334155' }}>
                <span style={{ fontWeight: 700 }}>Soft Skills: </span>{skills.soft}
              </p>
            )}
            {skills.languages && (
              <p style={{ fontSize: '9.5pt', color: '#334155' }}>
                <span style={{ fontWeight: 700 }}>Languages: </span>{skills.languages}
              </p>
            )}
            {skills.certifications && (
              <p style={{ fontSize: '9.5pt', color: '#334155' }}>
                <span style={{ fontWeight: 700 }}>Certifications: </span>{skills.certifications}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!personal.name && !hasExperience && !hasEducation && !hasSkills && !hasProjects && (
        <div style={{ textAlign: 'center', paddingTop: '80px', color: '#cbd5e1' }}>
          <p style={{ fontSize: '13pt', fontStyle: 'italic' }}>Start filling the form to see your resume appear here...</p>
        </div>
      )}
    </div>
  );
});

ResumePreview.displayName = 'ResumePreview';
export default ResumePreview;
