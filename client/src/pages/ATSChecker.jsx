import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
  FaCheckCircle, FaExclamationTriangle, FaTimesCircle, 
  FaArrowRight, FaSpinner, FaClipboard, FaChartPie, FaFileAlt 
} from 'react-icons/fa';

const ATSChecker = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [latestReport, setLatestReport] = useState(null);
  const [error, setError] = useState('');

  const fetchResumes = async () => {
    try {
      const res = await api.get('/resume');
      if (res.success) {
        setResumes(res.data);
        if (res.data.length > 0) {
          setSelectedResumeId(res.data[0]._id);
        }
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await api.get('/ai/ats-reports');
      if (res.success) {
        setReports(res.data);
        if (res.data.length > 0) {
          setLatestReport(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  useEffect(() => {
    fetchResumes();
    fetchReports();
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedResumeId) {
      return setError('Please select a resume to analyze.');
    }
    if (!jobDescription.trim()) {
      return setError('Please paste a job description.');
    }

    setIsLoading(true);

    try {
      const res = await api.post('/ai/ats-check', {
        resumeId: selectedResumeId,
        jobDescription,
      });

      if (res.success) {
        setLatestReport(res.data);
        setReports([res.data, ...reports]);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError(res.message || 'Analysis failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success border-success';
    if (score >= 60) return 'text-warning border-warning';
    return 'text-danger border-danger';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brandText-light dark:text-brandText-dark font-poppins">ATS Optimization Scanner</h1>
        <p className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-1 font-inter">
          Compare your resume against specific job requirements and optimize your keywords.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Configuration form */}
        <div className="lg:col-span-1 bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium h-fit">
          <h2 className="text-lg font-bold font-poppins text-brandText-light dark:text-brandText-dark mb-4">Run Scanner</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleAnalyze} className="space-y-5">
            <div>
              <label className="premium-label">Select Resume</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="premium-input bg-transparent cursor-pointer"
              >
                {resumes.length === 0 ? (
                  <option value="">No resumes found. Create one first!</option>
                ) : (
                  resumes.map(r => (
                    <option key={r._id} value={r._id}>{r.title}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="premium-label">Paste Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={10}
                placeholder="Paste the target job description details here..."
                className="premium-input font-mono text-xs"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading || resumes.length === 0}
              className="w-full premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Analyzing Resume...
                </>
              ) : (
                <>
                  Scan Compatibility <FaArrowRight />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Analysis results or history */}
        <div className="lg:col-span-2 space-y-6">
          {latestReport ? (
            <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium transition-all">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-b border-brandBorder-light dark:border-brandBorder-dark pb-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold font-poppins text-brandText-light dark:text-brandText-dark">Analysis Result</h3>
                  <p className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-1">
                    Scanned on {new Date(latestReport.createdAt).toLocaleDateString()} for "{latestReport.jobTitle || 'Resume'}"
                  </p>
                </div>
                
                {/* Score display ring */}
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center text-2xl font-bold font-poppins ${getScoreColor(latestReport.score)}`}>
                    {latestReport.score}%
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-brandTextSecondary-light dark:text-brandTextSecondary-dark uppercase block">Match Rating</span>
                    <span className="text-sm font-bold font-poppins text-brandText-light dark:text-brandText-dark">
                      {latestReport.score >= 80 ? 'Highly Compatible' : latestReport.score >= 60 ? 'Moderate Match' : 'Low Match'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Keyword analytics */}
              <div className="space-y-6">
                {/* Keyword Match details */}
                <div>
                  <h4 className="text-sm font-bold uppercase text-primary dark:text-secondary mb-3 flex items-center gap-2 font-poppins">
                    <FaChartPie /> Keywords Match Details (Score: {latestReport.keywordMatch?.score || 0}%)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50/50 dark:bg-green-950/10 border border-green-100 dark:border-green-950/20 rounded-xl">
                      <h5 className="text-xs font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5 font-poppins">
                        <FaCheckCircle /> Matching Keywords ({latestReport.keywordMatch?.matchingKeywords?.length || 0})
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {latestReport.keywordMatch?.matchingKeywords?.length === 0 ? (
                          <span className="text-xs text-brandTextSecondary-light">None detected.</span>
                        ) : (
                          latestReport.keywordMatch?.matchingKeywords?.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded font-medium">{kw}</span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-950/20 rounded-xl">
                      <h5 className="text-xs font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-1.5 font-poppins">
                        <FaTimesCircle /> Missing Keywords ({latestReport.keywordMatch?.missingKeywords?.length || 0})
                      </h5>
                      <div className="flex flex-wrap gap-1.5">
                        {latestReport.keywordMatch?.missingKeywords?.length === 0 ? (
                          <span className="text-xs text-brandTextSecondary-light">None detected. Nice job!</span>
                        ) : (
                          latestReport.keywordMatch?.missingKeywords?.map((kw, i) => (
                            <span key={i} className="px-2 py-0.5 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded font-medium">{kw}</span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formatting Feedback */}
                <div>
                  <h4 className="text-sm font-bold uppercase text-primary dark:text-secondary mb-3 flex items-center gap-2 font-poppins">
                    <FaFileAlt /> Layout & Formatting Feedback
                  </h4>
                  <ul className="space-y-2">
                    {latestReport.formatting?.feedback?.map((fb, i) => (
                      <li key={i} className="flex gap-2 items-start text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                        <FaCheckCircle className="text-success mt-0.5 flex-shrink-0" />
                        <span>{fb}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Missing Skills */}
                <div>
                  <h4 className="text-sm font-bold uppercase text-primary dark:text-secondary mb-3 flex items-center gap-2 font-poppins">
                    <FaClipboard /> Suggested Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {latestReport.missingSkills?.length === 0 ? (
                      <span className="text-xs text-brandTextSecondary-light">Your skills cover all critical JD requirements.</span>
                    ) : (
                      latestReport.missingSkills?.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 text-xs bg-primary/10 text-primary dark:text-secondary rounded-full font-medium">{skill}</span>
                      ))
                    )}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="p-4 bg-orange-50/50 dark:bg-orange-950/10 border border-orange-100 dark:border-orange-950/20 rounded-xl">
                  <h4 className="text-sm font-bold text-orange-800 dark:text-orange-400 mb-3 flex items-center gap-1.5 font-poppins">
                    <FaExclamationTriangle /> Actionable Suggestions to Improve Score
                  </h4>
                  <ul className="space-y-2">
                    {latestReport.suggestions?.map((sug, i) => (
                      <li key={i} className="flex gap-2 items-start text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                        <span className="text-primary font-bold">{i + 1}.</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-12 text-center shadow-premium">
              <FaClipboard className="text-5xl text-brandTextSecondary-light/30 mx-auto mb-4" />
              <h3 className="text-lg font-bold font-poppins mb-1">No Scan Reports Yet</h3>
              <p className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark max-w-sm mx-auto">
                Paste a job description on the left and select your resume to run an automated ATS compatibility check.
              </p>
            </div>
          )}

          {/* Scans History list */}
          {reports.length > 1 && (
            <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium">
              <h3 className="text-lg font-bold font-poppins mb-4">Past Scans History</h3>
              <div className="divide-y divide-brandBorder-light dark:divide-brandBorder-dark">
                {reports.map((rep) => (
                  <div 
                    key={rep._id}
                    onClick={() => setLatestReport(rep)}
                    className="py-3 flex justify-between items-center hover:bg-black/5 dark:hover:bg-white/5 px-2 rounded-lg cursor-pointer transition-colors"
                  >
                    <div>
                      <h4 className="text-sm font-bold font-poppins">{rep.jobTitle || 'Resume'}</h4>
                      <p className="text-[10px] text-brandTextSecondary-light dark:text-brandTextSecondary-dark">{new Date(rep.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-sm font-bold font-poppins px-2.5 py-1 rounded ${
                      rep.score >= 80 ? 'bg-green-100 text-green-700' : rep.score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>{rep.score}%</span>
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

export default ATSChecker;
