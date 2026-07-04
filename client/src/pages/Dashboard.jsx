import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  FaPlus, FaSearch, FaFileAlt, FaRobot, FaCheckCircle, 
  FaTrashAlt, FaChartLine, FaArrowRight, FaSpinner, FaEye 
} from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('newest');
  const [isCreating, setIsCreating] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/resume?search=${searchTerm}&sort=${sortOption}`);
      if (res.success) {
        setResumes(res.data);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [searchTerm, sortOption]);

  const handleCreateResume = async () => {
    try {
      setIsCreating(true);
      const res = await api.post('/resume', { title: 'My Professional Resume', template: 'modern' });
      if (res.success) {
        navigate(`/builder?id=${res.data._id}`);
      }
    } catch (error) {
      console.error('Error creating resume:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteResume = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this resume? This cannot be undone.')) {
      return;
    }
    try {
      const res = await api.delete(`/resume/${id}`);
      if (res.success) {
        setResumes(resumes.filter(r => r._id !== id));
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  // Math stats
  const totalResumes = resumes.length;
  const avgAtsScore = resumes.length 
    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.atsScore || 0), 0) / resumes.length) 
    : 0;
  const highAtsResumes = resumes.filter(r => (r.atsScore || 0) >= 80).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brandText-light dark:text-brandText-dark font-poppins">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-1.5 font-inter">
            Monitor and refine your job applications using AI insights.
          </p>
        </div>
        <button
          onClick={handleCreateResume}
          disabled={isCreating}
          className="premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer"
        >
          {isCreating ? <FaSpinner className="animate-spin" /> : <FaPlus />} New Resume
        </button>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <div className="p-6 bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl shadow-premium">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-brandTextSecondary-light dark:text-brandTextSecondary-dark uppercase font-poppins">Total Resumes</h3>
            <FaFileAlt className="text-primary text-lg" />
          </div>
          <p className="text-3xl font-bold text-brandText-light dark:text-brandText-dark font-poppins">{totalResumes}</p>
          <span className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-2 block">All resumes saved in the cloud</span>
        </div>

        <div className="p-6 bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl shadow-premium">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-brandTextSecondary-light dark:text-brandTextSecondary-dark uppercase font-poppins">Average ATS Score</h3>
            <FaCheckCircle className="text-success text-lg" />
          </div>
          <p className="text-3xl font-bold text-brandText-light dark:text-brandText-dark font-poppins">{avgAtsScore}%</p>
          <span className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-2 block">Goal is over 80% compatibility</span>
        </div>

        <div className="p-6 bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl shadow-premium">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-brandTextSecondary-light dark:text-brandTextSecondary-dark uppercase font-poppins">Highly Optimized</h3>
            <FaChartLine className="text-secondary text-lg" />
          </div>
          <p className="text-3xl font-bold text-brandText-light dark:text-brandText-dark font-poppins">{highAtsResumes}</p>
          <span className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-2 block">Resumes with ATS Score ≥ 80</span>
        </div>
      </div>

      {/* Main Grid: Search and List */}
      <div className="bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium transition-all">
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light">
              <FaSearch />
            </div>
            <input
              type="text"
              placeholder="Search resumes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="premium-input pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-brandTextSecondary-light dark:text-brandTextSecondary-dark font-poppins whitespace-nowrap">Sort By:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="premium-input py-2 text-sm bg-transparent cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="atsScore">ATS Score</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        {/* Resumes List */}
        {loading ? (
          <div className="py-20 flex justify-center items-center flex-col gap-3">
            <FaSpinner className="animate-spin text-3xl text-primary" />
            <p className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark">Fetching your resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-brandBorder-light dark:border-brandBorder-dark rounded-2xl">
            <FaFileAlt className="text-4xl text-brandTextSecondary-light/40 mx-auto mb-4" />
            <h3 className="text-lg font-bold font-poppins text-brandText-light dark:text-brandText-dark mb-1">No Resumes Found</h3>
            <p className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark max-w-sm mx-auto mb-6">
              Create your first professional resume using AI tools or refine an existing template.
            </p>
            <button
              onClick={handleCreateResume}
              className="premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass mx-auto cursor-pointer"
            >
              Create New Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div 
                key={resume._id}
                onClick={() => navigate(`/builder?id=${resume._id}`)}
                className="group relative flex flex-col justify-between border border-brandBorder-light dark:border-brandBorder-dark rounded-xl p-5 hover:border-primary/40 hover:shadow-premium-hover transition-all duration-300 bg-brandBg-light dark:bg-brandBg-dark/30 cursor-pointer"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase font-semibold font-poppins text-primary dark:text-secondary px-2 py-1 rounded bg-primary/10">
                      {resume.template}
                    </span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      (resume.atsScore || 0) >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400'
                    }`}>
                      ATS: {resume.atsScore || 0}%
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-poppins text-brandText-light dark:text-brandText-dark mb-1.5 group-hover:text-primary transition-colors">
                    {resume.title}
                  </h3>
                  <p className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                    Updated: {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-brandBorder-light dark:border-brandBorder-dark">
                  <div className="flex items-center gap-1 text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark group-hover:text-primary transition-colors">
                    <FaEye /> Edit Resume
                  </div>
                  <button
                    onClick={(e) => handleDeleteResume(resume._id, e)}
                    className="p-2 text-brandTextSecondary-light hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                    title="Delete resume"
                  >
                    <FaTrashAlt className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
