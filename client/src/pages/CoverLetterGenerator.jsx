import React, { useState } from 'react';
import api from '../services/api';
import { FaSpinner, FaMagic, FaCopy, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';

const CoverLetterGenerator = () => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [skills, setSkills] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!title.trim() || !jobDescription.trim()) {
      return setError('Please enter at least the job title and job description.');
    }

    setIsLoading(true);

    try {
      const res = await api.post('/ai/cover-letter', {
        name,
        title,
        company,
        skills,
        jobDescription,
      });

      if (res.success) {
        setCoverLetter(res.data);
      } else {
        setError(res.message || 'Generation failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brandText-light dark:text-brandText-dark font-poppins">AI Cover Letter Generator</h1>
        <p className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-1 font-inter">
          Generate a personalized, high-impact cover letter tailored to a specific job role and company.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Details */}
        <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium h-fit">
          <h2 className="text-lg font-bold font-poppins text-brandText-light dark:text-brandText-dark mb-4 flex items-center gap-1.5">
            <FaMagic className="text-primary" /> Letter Details
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="premium-label">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="premium-input text-sm"
                />
              </div>
              <div>
                <label className="premium-label">Target Job Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Dev"
                  className="premium-input text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="premium-label">Company Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Stripe"
                  className="premium-input text-sm"
                />
              </div>
              <div>
                <label className="premium-label">Key Highlight Skills</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, UI Design, APIs"
                  className="premium-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="premium-label">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                placeholder="Paste the job description details here to let AI tailor the letter..."
                className="premium-input font-mono text-xs"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Tailoring Letter...
                </>
              ) : (
                <>
                  Generate Letter <FaMagic />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Output Area */}
        <div className="flex flex-col">
          {coverLetter ? (
            <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center border-b border-brandBorder-light dark:border-brandBorder-dark pb-4 mb-4">
                  <h3 className="font-bold text-lg font-poppins text-brandText-light dark:text-brandText-dark">Generated Cover Letter</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 text-brandTextSecondary-light hover:text-primary rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center gap-1 text-xs font-medium cursor-pointer"
                    >
                      {copied ? <><FaCheckCircle className="text-success" /> Copied!</> : <><FaCopy /> Copy</>}
                    </button>
                    <button
                      onClick={() => setCoverLetter('')}
                      className="p-2 text-brandTextSecondary-light hover:text-red-500 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
                      title="Clear content"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
                
                <div className="prose dark:prose-invert max-w-none text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark whitespace-pre-line font-inter leading-relaxed bg-brandBg-light dark:bg-brandBg-dark/40 p-5 rounded-xl border border-brandBorder-light dark:border-brandBorder-dark">
                  {coverLetter}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <span className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark italic">Copy the text above and paste it into your document editor.</span>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-12 text-center shadow-premium flex-1 flex flex-col justify-center">
              <FaMagic className="text-5xl text-brandTextSecondary-light/30 mx-auto mb-4 animate-bounce" />
              <h3 className="text-lg font-bold font-poppins mb-1">Your Cover Letter Awaits</h3>
              <p className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark max-w-sm mx-auto">
                Fill out the role details on the left, click generate, and the Gemini model will craft a bespoke cover letter for you.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGenerator;
