import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import PDFDownloadBtn from '../components/PDFDownloadBtn';
import { FaArrowLeft, FaSpinner, FaCloudUploadAlt, FaCheck, FaPalette, FaPrint } from 'react-icons/fa';

const ResumeBuilder = () => {
  const [searchParams] = useSearchParams();
  const resumeId = searchParams.get('id');

  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saved', 'saving', 'error'
  const [aiLoading, setAiLoading] = useState(''); // 'summary', 'skills', 'projects-index'
  
  const isFirstRender = useRef(true);
  const saveTimeout = useRef(null);

  // Fetch Resume Data on mount
  useEffect(() => {
    const fetchResume = async () => {
      if (!resumeId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/resume/${resumeId}`);
        if (res.success) {
          setResumeData(res.data);
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [resumeId]);

  // Debounced Autosave effect
  useEffect(() => {
    if (isFirstRender.current) {
      if (resumeData) {
        isFirstRender.current = false;
      }
      return;
    }

    if (!resumeId || !resumeData) return;

    setSaveStatus('saving');
    
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(async () => {
      try {
        const res = await api.put(`/resume/${resumeId}`, resumeData);
        if (res.success) {
          setSaveStatus('saved');
        } else {
          setSaveStatus('error');
        }
      } catch (error) {
        console.error('Error autosaving resume:', error);
        setSaveStatus('error');
      }
    }, 1000); // 1 second debounce

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [resumeData, resumeId]);

  const handleFieldChange = (field, value) => {
    setResumeData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTemplateChange = (templateName) => {
    handleFieldChange('template', templateName);
  };

  // AI Assistance handlers
  const handleAIAssist = async (type, params = {}) => {
    if (!resumeData) return;
    
    if (type === 'summary') {
      const jobTitle = resumeData.personalInfo?.fullName ? `${resumeData.title} Professional` : 'Software Engineer';
      const skillsList = resumeData.skills?.map(s => s.name).join(', ') || 'web development';
      
      setAiLoading('summary');
      try {
        const res = await api.post('/ai/summary', { title: jobTitle, skills: skillsList });
        if (res.success) {
          handleFieldChange('summary', res.data);
        }
      } catch (err) {
        console.error('AI Summary failed:', err);
      } finally {
        setAiLoading('');
      }
    }

    if (type === 'skills') {
      const jobTitle = resumeData.title || 'Software Developer';
      setAiLoading('skills');
      try {
        const res = await api.post('/ai/skills', { title: jobTitle });
        if (res.success && Array.isArray(res.data)) {
          const newSkills = res.data.map(skillName => ({ name: skillName, level: 'Intermediate' }));
          handleFieldChange('skills', [...(resumeData.skills || []), ...newSkills]);
        }
      } catch (err) {
        console.error('AI Skills failed:', err);
      } finally {
        setAiLoading('');
      }
    }

    if (type === 'projects') {
      const { index, title, tech } = params;
      setAiLoading(`projects-${index}`);
      try {
        const res = await api.post('/ai/projects', { title, technologies: tech });
        if (res.success && Array.isArray(res.data)) {
          const updatedProjects = [...resumeData.projects];
          updatedProjects[index].description = res.data.join('\n');
          handleFieldChange('projects', updatedProjects);
        }
      } catch (err) {
        console.error('AI Project bullets failed:', err);
      } finally {
        setAiLoading('');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center gap-3">
        <FaSpinner className="animate-spin text-4xl text-primary" />
        <p className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark text-sm font-semibold">Loading Resume Builder Workspace...</p>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex flex-col justify-center items-center text-center px-4 py-20">
        <h2 className="text-2xl font-bold font-poppins">Resume Not Found</h2>
        <p className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-2 mb-6">The resume workspace you are trying to access does not exist.</p>
        <Link to="/dashboard" className="premium-btn bg-primary text-white hover:bg-primary-dark">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-screen flex flex-col">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-brandBorder-light dark:border-brandBorder-dark no-print">
        <div className="flex items-center gap-4">
          <Link to="/dashboard" className="p-2 bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark hover:bg-black/5 dark:hover:bg-white/5 rounded-xl transition-all">
            <FaArrowLeft className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark" />
          </Link>
          <div>
            <input
              type="text"
              value={resumeData.title || ''}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="text-xl font-bold font-poppins text-brandText-light dark:text-brandText-dark bg-transparent border-b border-transparent hover:border-brandBorder-light focus:border-primary focus:outline-none transition-all"
            />
            {/* Save status badge */}
            <div className="flex items-center gap-1.5 mt-1">
              {saveStatus === 'saving' && (
                <span className="text-[10px] text-amber-500 font-semibold flex items-center gap-1">
                  <FaCloudUploadAlt className="animate-bounce" /> Cloud saving...
                </span>
              )}
              {saveStatus === 'saved' && (
                <span className="text-[10px] text-green-500 font-semibold flex items-center gap-1">
                  <FaCheck /> Cloud saved (isolated)
                </span>
              )}
              {saveStatus === 'error' && (
                <span className="text-[10px] text-red-500 font-semibold">
                  ⚠️ Save failed. Check connection.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action button bar */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Template Selector dropdown */}
          <div className="flex items-center gap-2 bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark px-3 py-2 rounded-xl text-sm">
            <FaPalette className="text-primary" />
            <select
              value={resumeData.template || 'modern'}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="bg-transparent text-xs font-semibold cursor-pointer focus:outline-none"
            >
              <option value="modern">Modern Layout</option>
              <option value="minimal">Minimalist Layout</option>
              <option value="overleaf">Overleaf CV Layout</option>
              <option value="corporate">Corporate Layout</option>
            </select>
          </div>

          <PDFDownloadBtn data={resumeData} />
        </div>
      </div>

      {/* Split screen content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start flex-1">
        {/* Left Side: Input form */}
        <div className="h-full no-print">
          <ResumeForm
            data={resumeData}
            onChange={handleFieldChange}
            onAIAssist={handleAIAssist}
            aiLoading={aiLoading}
          />
        </div>

        {/* Right Side: Live preview */}
        <div className="sticky top-24 max-h-[780px] overflow-y-auto border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl shadow-premium bg-gray-500 p-4 transition-all">
          <div className="transform scale-[0.95] origin-top">
            <ResumePreview data={resumeData} />
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResumeBuilder;
