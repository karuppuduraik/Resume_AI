import React from 'react';

export const ModernTemplate = ({ data }) => {
  const { personalInfo = {}, summary = '', education = [], experience = [], projects = [], skills = [], certifications = [], languages = [], achievements = [] } = data;

  return (
    <div className="p-8 bg-white text-gray-800 font-sans leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto shadow-sm">
      {/* Header */}
      <div className="border-b-2 border-primary pb-5 mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 font-poppins">{personalInfo.fullName || 'Your Name'}</h1>
        <p className="text-primary font-medium text-sm mt-1 uppercase tracking-wider">Professional Resume</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-3">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && <a href={personalInfo.linkedin} className="text-primary hover:underline">LinkedIn</a>}
          {personalInfo.github && <a href={personalInfo.github} className="text-primary hover:underline">GitHub</a>}
          {personalInfo.portfolio && <a href={personalInfo.portfolio} className="text-primary hover:underline">Portfolio</a>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Side (Left) */}
        <div className="col-span-2 space-y-6">
          {summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 font-poppins">Summary</h2>
              <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 font-poppins">Professional Experience</h2>
              <div className="space-y-4">
                {experience.map((exp, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900">{exp.position}</h3>
                      <span className="text-gray-500 font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-gray-700 font-semibold mt-0.5">{exp.company} {exp.location && `| ${exp.location}`}</p>
                    <p className="text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 font-poppins">Key Projects</h2>
              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-xs">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-gray-900">{proj.title} {proj.role && `(${proj.role})`}</h3>
                      {proj.link && <a href={proj.link} className="text-primary hover:underline font-medium">Link</a>}
                    </div>
                    {proj.technologies && <p className="text-gray-500 italic mt-0.5">Tech: {proj.technologies}</p>}
                    <p className="text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (Right) */}
        <div className="col-span-1 space-y-6 border-l border-gray-100 pl-6">
          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 font-poppins">Skills</h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-[10px] font-medium">
                    {skill.name} {skill.level && `(${skill.level})`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 font-poppins">Education</h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="text-[11px]">
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.fieldOfStudy}</p>
                    <p className="text-gray-500">{edu.school}</p>
                    <p className="text-gray-400 font-medium">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 font-poppins">Certifications</h2>
              <div className="space-y-2">
                {certifications.map((cert, idx) => (
                  <div key={idx} className="text-[10px]">
                    <h3 className="font-bold text-gray-900">{cert.name}</h3>
                    <p className="text-gray-500">{cert.issuer} {cert.date && `(${cert.date})`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-primary mb-3 font-poppins">Languages</h2>
              <div className="space-y-1">
                {languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between text-[11px]">
                    <span className="font-semibold text-gray-800">{lang.name}</span>
                    <span className="text-gray-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const MinimalTemplate = ({ data }) => {
  const { personalInfo = {}, summary = '', education = [], experience = [], projects = [], skills = [], certifications = [], languages = [], achievements = [] } = data;

  return (
    <div className="p-10 bg-white text-gray-800 font-serif leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto shadow-sm">
      {/* Header */}
      <div className="text-center pb-8 border-b border-gray-200 mb-8">
        <h1 className="text-4xl font-light tracking-wide text-gray-900 uppercase">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-4 text-[11px] text-gray-500 mt-4 font-sans uppercase tracking-wider">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.linkedin && <a href={personalInfo.linkedin} className="underline hover:text-black">LinkedIn</a>}
          {personalInfo.github && <a href={personalInfo.github} className="underline hover:text-black">GitHub</a>}
        </div>
      </div>

      <div className="space-y-8 text-xs font-sans">
        {summary && (
          <div className="grid grid-cols-4 gap-4">
            <span className="col-span-1 font-bold text-gray-900 uppercase tracking-widest text-[10px]">Summary</span>
            <p className="col-span-3 text-gray-700 font-serif leading-relaxed text-xs">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            <span className="col-span-1 font-bold text-gray-900 uppercase tracking-widest text-[10px]">Experience</span>
            <div className="col-span-3 space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline font-serif">
                    <h3 className="font-bold text-sm text-gray-900">{exp.company}</h3>
                    <span className="text-[11px] text-gray-500 font-sans">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-gray-600 font-semibold italic">{exp.position} {exp.location && `— ${exp.location}`}</p>
                  <p className="text-gray-700 font-serif leading-relaxed mt-2 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            <span className="col-span-1 font-bold text-gray-900 uppercase tracking-widest text-[10px]">Projects</span>
            <div className="col-span-3 space-y-5">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline font-serif">
                    <h3 className="font-bold text-gray-900">{proj.title}</h3>
                    {proj.link && <a href={proj.link} className="underline text-[11px] font-sans">Link</a>}
                  </div>
                  {proj.technologies && <p className="text-[11px] text-gray-500">Tech: {proj.technologies}</p>}
                  <p className="text-gray-700 font-serif leading-relaxed whitespace-pre-line">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            <span className="col-span-1 font-bold text-gray-900 uppercase tracking-widest text-[10px]">Skills</span>
            <div className="col-span-3 text-gray-700 font-serif">
              {skills.map(s => s.name).join(', ')}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div className="grid grid-cols-4 gap-4">
            <span className="col-span-1 font-bold text-gray-900 uppercase tracking-widest text-[10px]">Education</span>
            <div className="col-span-3 space-y-4 font-serif">
              {education.map((edu, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-gray-900">{edu.school}</h4>
                    <p className="text-gray-600 font-sans text-[11px] mt-0.5">{edu.degree} inside {edu.fieldOfStudy}</p>
                  </div>
                  <span className="text-[11px] text-gray-500 font-sans">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const OverleafTemplate = ({ data }) => {
  const { personalInfo = {}, summary = '', education = [], experience = [], projects = [], skills = [], certifications = [], languages = [], achievements = [] } = data;

  return (
    <div className="p-8 bg-white text-gray-800 font-sans leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto shadow-sm">
      {/* Overleaf Minimal Header */}
      <div className="flex justify-between items-start border-b border-gray-300 pb-4 mb-5">
        <div>
          <h1 className="text-3xl font-light text-slate-800 tracking-wide font-poppins">{personalInfo.fullName || 'Your Name'}</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">LaTeX Compiled Curriculum Vitae</p>
        </div>
        <div className="text-right text-[10px] text-gray-600 space-y-0.5">
          {personalInfo.email && <p>{personalInfo.email}</p>}
          {personalInfo.phone && <p>{personalInfo.phone}</p>}
          {personalInfo.linkedin && <p>{personalInfo.linkedin}</p>}
          {personalInfo.github && <p>{personalInfo.github}</p>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column (Sidebar 1/3) */}
        <div className="col-span-1 space-y-5">
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-1 mb-2 font-poppins">Education</h2>
              {education.map((edu, idx) => (
                <div key={idx} className="mb-2 text-[10px] leading-tight">
                  <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                  <p className="text-gray-500">{edu.fieldOfStudy}</p>
                  <p className="text-gray-600 font-medium">{edu.school}</p>
                  <p className="text-gray-400 mt-0.5">{edu.startDate} - {edu.endDate}</p>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-1 mb-2 font-poppins">Skills</h2>
              <div className="flex flex-col gap-1 text-[10px]">
                {skills.map((skill, idx) => (
                  <div key={idx} className="flex justify-between border-b border-gray-100 py-0.5">
                    <span className="font-semibold text-gray-800">{skill.name}</span>
                    <span className="text-gray-400 text-[9px]">{skill.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-1 mb-2 font-poppins">Languages</h2>
              <div className="space-y-1 text-[10px]">
                {languages.map((lang, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="font-semibold text-gray-800">{lang.name}</span>
                    <span className="text-gray-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column (Main Panel 2/3) */}
        <div className="col-span-2 space-y-5 border-l border-gray-200 pl-6">
          {summary && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-1 mb-2 font-poppins">Statement</h2>
              <p className="text-[10px] text-gray-700 leading-normal whitespace-pre-line">{summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-1 mb-3 font-poppins">Experience</h2>
              <div className="space-y-3">
                {experience.map((exp, idx) => (
                  <div key={idx} className="text-[10px] leading-tight">
                    <div className="flex justify-between items-baseline font-semibold text-slate-900">
                      <h3 className="font-bold">{exp.position}</h3>
                      <span className="text-[9px] text-gray-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <p className="text-gray-600 font-semibold mt-0.5">{exp.company} {exp.location && `| ${exp.location}`}</p>
                    <p className="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-gray-200 pb-1 mb-3 font-poppins">Selected Projects</h2>
              <div className="space-y-3">
                {projects.map((proj, idx) => (
                  <div key={idx} className="text-[10px] leading-tight">
                    <div className="flex justify-between items-baseline font-semibold text-slate-900">
                      <h3 className="font-bold">{proj.title} {proj.role && `— ${proj.role}`}</h3>
                      {proj.link && <a href={proj.link} className="text-blue-600 hover:underline text-[9px]">Link</a>}
                    </div>
                    {proj.technologies && <p className="text-gray-400 italic text-[9px]">Technologies: {proj.technologies}</p>}
                    <p className="text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{proj.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CorporateTemplate = ({ data }) => {
  const { personalInfo = {}, summary = '', education = [], experience = [], projects = [], skills = [], certifications = [], languages = [], achievements = [] } = data;

  return (
    <div className="p-10 bg-white text-gray-800 font-sans leading-relaxed max-w-[21cm] min-h-[29.7cm] mx-auto shadow-sm">
      {/* Centered Executive Header */}
      <div className="text-center pb-5 border-b-2 border-slate-800 mb-6">
        <h1 className="text-3xl font-bold tracking-wide text-slate-900 uppercase font-poppins">{personalInfo.fullName || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-3 font-medium">
          {personalInfo.email && <span>Email: {personalInfo.email}</span>}
          {personalInfo.phone && <span>Phone: {personalInfo.phone}</span>}
          {personalInfo.address && <span>Address: {personalInfo.address}</span>}
          {personalInfo.linkedin && <a href={personalInfo.linkedin} className="text-blue-800 hover:underline">LinkedIn</a>}
          {personalInfo.github && <a href={personalInfo.github} className="text-blue-800 hover:underline">GitHub</a>}
        </div>
      </div>

      <div className="space-y-6 text-xs">
        {summary && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-poppins">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-poppins">Work History</h2>
            <div className="space-y-4">
              {experience.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline font-semibold text-slate-950">
                    <h3 className="text-sm font-bold">{exp.position}</h3>
                    <span className="text-[11px] text-gray-500 font-medium">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <div className="flex justify-between items-baseline text-slate-700 font-medium italic">
                    <span>{exp.company}</span>
                    {exp.location && <span className="text-[10px] text-gray-500">{exp.location}</span>}
                  </div>
                  <p className="text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-poppins">Key Projects</h2>
            <div className="space-y-4">
              {projects.map((proj, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-baseline font-semibold text-slate-950">
                    <h3 className="text-sm font-bold">{proj.title} {proj.role && `— ${proj.role}`}</h3>
                    {proj.link && <a href={proj.link} className="text-blue-800 hover:underline font-medium text-[11px]">Link</a>}
                  </div>
                  {proj.technologies && <p className="text-slate-500 text-[10px] font-medium">Technologies: {proj.technologies}</p>}
                  <p className="text-gray-600 mt-1.5 leading-relaxed whitespace-pre-line">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-poppins">Education</h2>
              <div className="space-y-3">
                {education.map((edu, idx) => (
                  <div key={idx} className="space-y-0.5">
                    <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                    <p className="text-gray-700 font-medium">{edu.fieldOfStudy}</p>
                    <p className="text-gray-500">{edu.school}</p>
                    <p className="text-[10px] text-gray-400 font-medium">{edu.startDate} - {edu.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills & Misc */}
          <div className="space-y-4">
            {skills.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-poppins">Key Skills</h2>
                <p className="text-gray-700 font-medium leading-relaxed">
                  {skills.map(s => s.name).join(' • ')}
                </p>
              </div>
            )}
            
            {certifications.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-poppins">Certifications</h2>
                <ul className="list-disc pl-4 space-y-1 text-gray-700 font-medium">
                  {certifications.map((cert, idx) => (
                    <li key={idx}>
                      {cert.name} — {cert.issuer} {cert.date && `(${cert.date})`}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

