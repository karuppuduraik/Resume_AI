import React, { useState } from 'react';
import { 
  FaUser, FaFileAlt, FaBriefcase, FaGraduationCap, 
  FaCode, FaCog, FaPlus, FaTrash, FaRobot, FaSpinner 
} from 'react-icons/fa';

const ResumeForm = ({ data, onChange, onAIAssist, aiLoading }) => {
  const [activeTab, setActiveTab] = useState('personal');

  const {
    personalInfo = {},
    summary = '',
    experience = [],
    education = [],
    projects = [],
    skills = [],
    certifications = [],
    languages = [],
  } = data;

  const handlePersonalInfoChange = (field, value) => {
    onChange('personalInfo', { ...personalInfo, [field]: value });
  };

  // Helper to update arrays
  const updateArrayField = (fieldName, index, field, value) => {
    const updated = [...data[fieldName]];
    updated[index] = { ...updated[index], [field]: value };
    onChange(fieldName, updated);
  };

  const addArrayItem = (fieldName, defaultObj) => {
    onChange(fieldName, [...data[fieldName], defaultObj]);
  };

  const removeArrayItem = (fieldName, index) => {
    onChange(fieldName, data[fieldName].filter((_, i) => i !== index));
  };

  const tabs = [
    { id: 'personal', name: 'Personal', icon: <FaUser /> },
    { id: 'summary', name: 'Summary', icon: <FaFileAlt /> },
    { id: 'experience', name: 'Experience', icon: <FaBriefcase /> },
    { id: 'education', name: 'Education', icon: <FaGraduationCap /> },
    { id: 'projects', name: 'Projects', icon: <FaCode /> },
    { id: 'skills', name: 'Skills & Misc', icon: <FaCog /> },
  ];

  return (
    <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl shadow-premium overflow-hidden flex flex-col md:flex-row h-full min-h-[500px]">
      {/* Side Tabs menu */}
      <div className="w-full md:w-48 bg-brandBg-light dark:bg-brandBg-dark/50 border-r border-brandBorder-light dark:border-brandBorder-dark p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap md:whitespace-normal ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-glass'
                : 'text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Inputs Form Body */}
      <div className="flex-1 p-6 overflow-y-auto max-h-[700px]">
        {/* Personal Details */}
        {activeTab === 'personal' && (
          <div className="space-y-4">
            <h3 className="text-base font-bold font-poppins text-brandText-light dark:text-brandText-dark border-b border-brandBorder-light dark:border-brandBorder-dark pb-2 mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="premium-label">Full Name</label>
                <input
                  type="text"
                  value={personalInfo.fullName || ''}
                  onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                  placeholder="John Doe"
                  className="premium-input text-sm"
                />
              </div>
              <div>
                <label className="premium-label">Email Address</label>
                <input
                  type="email"
                  value={personalInfo.email || ''}
                  onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                  placeholder="john.doe@example.com"
                  className="premium-input text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="premium-label">Phone Number</label>
                <input
                  type="text"
                  value={personalInfo.phone || ''}
                  onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="premium-input text-sm"
                />
              </div>
              <div>
                <label className="premium-label">Location / Address</label>
                <input
                  type="text"
                  value={personalInfo.address || ''}
                  onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                  placeholder="San Francisco, CA"
                  className="premium-input text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="premium-label">LinkedIn URL</label>
                <input
                  type="text"
                  value={personalInfo.linkedin || ''}
                  onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                  className="premium-input text-sm"
                />
              </div>
              <div>
                <label className="premium-label">GitHub URL</label>
                <input
                  type="text"
                  value={personalInfo.github || ''}
                  onChange={(e) => handlePersonalInfoChange('github', e.target.value)}
                  placeholder="github.com/username"
                  className="premium-input text-sm"
                />
              </div>
              <div>
                <label className="premium-label">Portfolio URL</label>
                <input
                  type="text"
                  value={personalInfo.portfolio || ''}
                  onChange={(e) => handlePersonalInfoChange('portfolio', e.target.value)}
                  placeholder="portfolio.com"
                  className="premium-input text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-brandBorder-light dark:border-brandBorder-dark pb-2 mb-4">
              <h3 className="text-base font-bold font-poppins text-brandText-light dark:text-brandText-dark">Professional Summary</h3>
              <button
                type="button"
                onClick={() => onAIAssist('summary')}
                disabled={aiLoading === 'summary'}
                className="px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {aiLoading === 'summary' ? <FaSpinner className="animate-spin" /> : <FaRobot />} 
                <span>AI Write Summary</span>
              </button>
            </div>
            <div>
              <textarea
                value={summary}
                onChange={(e) => onChange('summary', e.target.value)}
                rows={8}
                placeholder="Write a brief overview of your key qualifications, skills, and career objective..."
                className="premium-input text-sm font-inter"
              ></textarea>
            </div>
          </div>
        )}

        {/* Experience Section */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-brandBorder-light dark:border-brandBorder-dark pb-2 mb-4">
              <h3 className="text-base font-bold font-poppins text-brandText-light dark:text-brandText-dark">Work Experience</h3>
              <button
                type="button"
                onClick={() => addArrayItem('experience', { company: '', position: '', location: '', startDate: '', endDate: '', current: false, description: '' })}
                className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FaPlus /> Add Role
              </button>
            </div>

            {experience.length === 0 ? (
              <p className="text-xs text-brandTextSecondary-light text-center py-6">No experience blocks added yet.</p>
            ) : (
              experience.map((exp, idx) => (
                <div key={idx} className="p-4 bg-brandBg-light dark:bg-brandBg-dark/30 border border-brandBorder-light dark:border-brandBorder-dark rounded-xl space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => removeArrayItem('experience', idx)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="text-sm" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="premium-label">Company Name</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateArrayField('experience', idx, 'company', e.target.value)}
                        placeholder="e.g. Google"
                        className="premium-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="premium-label">Job Title / Position</label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) => updateArrayField('experience', idx, 'position', e.target.value)}
                        placeholder="e.g. Senior Software Engineer"
                        className="premium-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="premium-label">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateArrayField('experience', idx, 'startDate', e.target.value)}
                        placeholder="e.g. Jan 2022"
                        className="premium-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="premium-label">End Date</label>
                      <input
                        type="text"
                        disabled={exp.current}
                        value={exp.current ? '' : exp.endDate}
                        onChange={(e) => updateArrayField('experience', idx, 'endDate', e.target.value)}
                        placeholder="e.g. Dec 2024"
                        className="premium-input text-xs disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center pt-8">
                      <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-brandText-light dark:text-brandText-dark">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateArrayField('experience', idx, 'current', e.target.checked)}
                          className="rounded text-primary focus:ring-primary"
                        />
                        I currently work here
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="premium-label">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateArrayField('experience', idx, 'location', e.target.value)}
                      placeholder="e.g. New York, NY (Hybrid)"
                      className="premium-input text-xs"
                    />
                  </div>

                  <div>
                    <label className="premium-label">Description & Key Achievements</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateArrayField('experience', idx, 'description', e.target.value)}
                      rows={4}
                      placeholder="• Built high-scale Node services reducing response latency by 30%..."
                      className="premium-input text-xs font-inter"
                    ></textarea>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Education Section */}
        {activeTab === 'education' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-brandBorder-light dark:border-brandBorder-dark pb-2 mb-4">
              <h3 className="text-base font-bold font-poppins text-brandText-light dark:text-brandText-dark">Education History</h3>
              <button
                type="button"
                onClick={() => addArrayItem('education', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', grade: '' })}
                className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FaPlus /> Add School
              </button>
            </div>

            {education.length === 0 ? (
              <p className="text-xs text-brandTextSecondary-light text-center py-6">No education blocks added yet.</p>
            ) : (
              education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-brandBg-light dark:bg-brandBg-dark/30 border border-brandBorder-light dark:border-brandBorder-dark rounded-xl space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => removeArrayItem('education', idx)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="text-sm" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="premium-label">School / University</label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) => updateArrayField('education', idx, 'school', e.target.value)}
                        placeholder="e.g. Stanford University"
                        className="premium-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="premium-label">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateArrayField('education', idx, 'degree', e.target.value)}
                        placeholder="e.g. Bachelor of Science"
                        className="premium-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="premium-label">Field of Study</label>
                      <input
                        type="text"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateArrayField('education', idx, 'fieldOfStudy', e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="premium-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="premium-label">Start Date</label>
                      <input
                        type="text"
                        value={edu.startDate}
                        onChange={(e) => updateArrayField('education', idx, 'startDate', e.target.value)}
                        placeholder="e.g. 2018"
                        className="premium-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="premium-label">End Date</label>
                      <input
                        type="text"
                        value={edu.endDate}
                        onChange={(e) => updateArrayField('education', idx, 'endDate', e.target.value)}
                        placeholder="e.g. 2022"
                        className="premium-input text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Projects Section */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-brandBorder-light dark:border-brandBorder-dark pb-2 mb-4">
              <h3 className="text-base font-bold font-poppins text-brandText-light dark:text-brandText-dark">Key Projects</h3>
              <button
                type="button"
                onClick={() => addArrayItem('projects', { title: '', role: '', technologies: '', link: '', description: '' })}
                className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <FaPlus /> Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <p className="text-xs text-brandTextSecondary-light text-center py-6">No projects added yet.</p>
            ) : (
              projects.map((proj, idx) => (
                <div key={idx} className="p-4 bg-brandBg-light dark:bg-brandBg-dark/30 border border-brandBorder-light dark:border-brandBorder-dark rounded-xl space-y-4 relative">
                  <button
                    type="button"
                    onClick={() => removeArrayItem('projects', idx)}
                    className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  >
                    <FaTrash className="text-sm" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="premium-label">Project Title</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => updateArrayField('projects', idx, 'title', e.target.value)}
                        placeholder="e.g. SaaS Dashboard"
                        className="premium-input text-xs"
                      />
                    </div>
                    <div>
                      <label className="premium-label">Technologies Used</label>
                      <input
                        type="text"
                        value={proj.technologies}
                        onChange={(e) => updateArrayField('projects', idx, 'technologies', e.target.value)}
                        placeholder="e.g. React, Tailwind, Express"
                        className="premium-input text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="premium-label">Project Link / URL</label>
                      <input
                        type="text"
                        value={proj.link}
                        onChange={(e) => updateArrayField('projects', idx, 'link', e.target.value)}
                        placeholder="e.g. https://myproject.com"
                        className="premium-input text-xs"
                      />
                    </div>
                    <div className="flex items-end pb-1.5">
                      <button
                        type="button"
                        onClick={() => onAIAssist('projects', { index: idx, title: proj.title, tech: proj.technologies })}
                        disabled={aiLoading === `projects-${idx}`}
                        className="px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        {aiLoading === `projects-${idx}` ? <FaSpinner className="animate-spin" /> : <FaRobot />} 
                        <span>AI Write Project Bullet Points</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="premium-label">Project Description</label>
                    <textarea
                      value={proj.description}
                      onChange={(e) => updateArrayField('projects', idx, 'description', e.target.value)}
                      rows={3}
                      placeholder="Describe what you built and the impact you generated..."
                      className="premium-input text-xs font-inter"
                    ></textarea>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Skills & Miscellaneous */}
        {activeTab === 'skills' && (
          <div className="space-y-6">
            {/* Skills */}
            <div>
              <div className="flex justify-between items-center border-b border-brandBorder-light dark:border-brandBorder-dark pb-2 mb-4">
                <h3 className="text-base font-bold font-poppins text-brandText-light dark:text-brandText-dark">Skills</h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAIAssist('skills')}
                    disabled={aiLoading === 'skills'}
                    className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {aiLoading === 'skills' ? <FaSpinner className="animate-spin" /> : <FaRobot />}
                    <span>AI Suggest Skills</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => addArrayItem('skills', { name: '', level: 'Intermediate' })}
                    className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <FaPlus /> Add Skill
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {skills.length === 0 ? (
                  <p className="text-xs text-brandTextSecondary-light col-span-2 text-center py-4">No skills added yet.</p>
                ) : (
                  skills.map((skill, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-brandBg-light dark:bg-brandBg-dark/20 p-2.5 rounded-xl border border-brandBorder-light dark:border-brandBorder-dark">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => updateArrayField('skills', idx, 'name', e.target.value)}
                        placeholder="e.g. React"
                        className="premium-input text-xs py-1.5 flex-1"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => updateArrayField('skills', idx, 'level', e.target.value)}
                        className="premium-input text-xs py-1.5 w-28 bg-transparent"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills', idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <div className="flex justify-between items-center border-b border-brandBorder-light dark:border-brandBorder-dark pb-2 mb-4">
                <h3 className="text-base font-bold font-poppins text-brandText-light dark:text-brandText-dark">Certifications</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '', link: '' })}
                  className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <FaPlus /> Add Cert
                </button>
              </div>

              <div className="space-y-4">
                {certifications.length === 0 ? (
                  <p className="text-xs text-brandTextSecondary-light text-center py-4">No certifications added yet.</p>
                ) : (
                  certifications.map((cert, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 bg-brandBg-light dark:bg-brandBg-dark/20 p-3 rounded-xl border border-brandBorder-light dark:border-brandBorder-dark relative">
                      <input
                        type="text"
                        value={cert.name}
                        onChange={(e) => updateArrayField('certifications', idx, 'name', e.target.value)}
                        placeholder="Certification name"
                        className="premium-input text-xs py-1.5 flex-1"
                      />
                      <input
                        type="text"
                        value={cert.issuer}
                        onChange={(e) => updateArrayField('certifications', idx, 'issuer', e.target.value)}
                        placeholder="Issuer (e.g. AWS)"
                        className="premium-input text-xs py-1.5 w-full sm:w-48"
                      />
                      <input
                        type="text"
                        value={cert.date}
                        onChange={(e) => updateArrayField('certifications', idx, 'date', e.target.value)}
                        placeholder="Date issued"
                        className="premium-input text-xs py-1.5 w-full sm:w-28"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem('certifications', idx)}
                        className="text-red-500 hover:text-red-700 self-center"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Languages */}
            <div>
              <div className="flex justify-between items-center border-b border-brandBorder-light dark:border-brandBorder-dark pb-2 mb-4">
                <h3 className="text-base font-bold font-poppins text-brandText-light dark:text-brandText-dark">Languages</h3>
                <button
                  type="button"
                  onClick={() => addArrayItem('languages', { name: '', proficiency: 'Fluent' })}
                  className="px-3 py-1 bg-primary text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <FaPlus /> Add Language
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {languages.length === 0 ? (
                  <p className="text-xs text-brandTextSecondary-light col-span-2 text-center py-4">No languages added yet.</p>
                ) : (
                  languages.map((lang, idx) => (
                    <div key={idx} className="flex gap-2 items-center bg-brandBg-light dark:bg-brandBg-dark/20 p-2.5 rounded-xl border border-brandBorder-light dark:border-brandBorder-dark">
                      <input
                        type="text"
                        value={lang.name}
                        onChange={(e) => updateArrayField('languages', idx, 'name', e.target.value)}
                        placeholder="e.g. Spanish"
                        className="premium-input text-xs py-1.5 flex-1"
                      />
                      <select
                        value={lang.proficiency}
                        onChange={(e) => updateArrayField('languages', idx, 'proficiency', e.target.value)}
                        className="premium-input text-xs py-1.5 w-32 bg-transparent"
                      >
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Professional">Professional</option>
                        <option value="Conversational">Conversational</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => removeArrayItem('languages', idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
