import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaUser, FaSignOutAlt, FaFileAlt, FaRobot, 
  FaCheckCircle, FaMoon, FaSun, FaBars, FaTimes, FaCrown
} from 'react-icons/fa';

const Navbar = () => {
  const { user, logout, requestPremium } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRequestPremium = async () => {
    try {
      const res = await requestPremium();
      if (res.success) {
        alert('Premium access request sent! Please await approval from the Administrator.');
      } else {
        alert(res.message || 'Failed to request premium access.');
      }
    } catch (err) {
      alert('Failed to request premium access.');
    }
  };

  const isActive = (path) => location.pathname === path;

  const activeClass = "text-primary dark:text-secondary font-semibold";
  const inactiveClass = "text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary transition-colors duration-200";

  return (
    <nav className="sticky top-0 z-50 glass-card border-b border-brandBorder-light dark:border-brandBorder-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Resume AI Logo" className="h-8 w-8 rounded-lg object-cover shadow-glass" />
              <span className="font-poppins text-xl font-bold tracking-tight text-brandText-light dark:text-brandText-dark">
                Resume<span className="text-primary dark:text-secondary">AI</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              {user && (
                <>
                  <Link to="/dashboard" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/dashboard') ? activeClass : inactiveClass}`}>
                    Dashboard
                  </Link>
                  <Link to="/builder" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/builder') ? activeClass : inactiveClass}`}>
                    Resume Builder
                  </Link>
                  <Link to="/ats-checker" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/ats-checker') ? activeClass : inactiveClass}`}>
                    ATS Checker
                  </Link>
                  <Link to="/cover-letter" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/cover-letter') ? activeClass : inactiveClass}`}>
                    Cover Letter
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className={`inline-flex items-center px-1 pt-1 text-sm ${isActive('/admin') ? activeClass : inactiveClass}`}>
                      Admin Panel
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* Premium Button */}
            {user && user.premiumStatus === 'none' && user.role !== 'admin' && (
              <button
                onClick={handleRequestPremium}
                className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black text-xs font-bold rounded-lg transition-all duration-300 shadow-md transform hover:scale-105 cursor-pointer flex items-center gap-1"
              >
                Get Premium <FaCrown className="text-[10px]" />
              </button>
            )}
            {user && user.premiumStatus === 'requested' && (
              <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold rounded-lg">
                Premium Pending ⏳
              </span>
            )}

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun className="h-5 w-5 text-yellow-400" /> : <FaMoon className="h-5 w-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-brandText-light dark:text-brandText-dark hover:text-primary dark:hover:text-secondary transition-colors duration-200">
                  {user.profilePicture ? (
                    <img src={user.profilePicture} alt={user.name} referrerPolicy="no-referrer" className="h-8 w-8 rounded-full object-cover border border-primary/20" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium flex items-center gap-1">
                    {user.name}
                    {user.premiumStatus === 'approved' && (
                      <FaCrown className="text-amber-500 premium-crown-sparkle text-xs" title="Premium Account" />
                    )}
                  </span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-glass flex items-center gap-1.5"
                >
                  <FaSignOutAlt className="text-xs" /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-brandText-light dark:text-brandText-dark hover:text-primary transition-colors duration-200">
                  Login
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-glass">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger button */}
          <div className="flex items-center md:hidden gap-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {darkMode ? <FaSun className="h-5 w-5 text-yellow-400" /> : <FaMoon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:bg-black/5 dark:hover:bg-white/5 focus:outline-none transition-colors"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-card border-t border-brandBorder-light dark:border-brandBorder-dark">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${isActive('/dashboard') ? 'bg-primary/10 text-primary' : 'text-brandTextSecondary-light dark:text-brandTextSecondary-dark'}`}>
                  Dashboard
                </Link>
                <Link to="/builder" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${isActive('/builder') ? 'bg-primary/10 text-primary' : 'text-brandTextSecondary-light dark:text-brandTextSecondary-dark'}`}>
                  Resume Builder
                </Link>
                <Link to="/ats-checker" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${isActive('/ats-checker') ? 'bg-primary/10 text-primary' : 'text-brandTextSecondary-light dark:text-brandTextSecondary-dark'}`}>
                  ATS Checker
                </Link>
                <Link to="/cover-letter" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${isActive('/cover-letter') ? 'bg-primary/10 text-primary' : 'text-brandTextSecondary-light dark:text-brandTextSecondary-dark'}`}>
                  Cover Letter
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className={`block px-3 py-2 rounded-md text-base ${isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-brandTextSecondary-light dark:text-brandTextSecondary-dark'}`}>
                    Admin Panel
                  </Link>
                )}
                {user.premiumStatus === 'none' && user.role !== 'admin' && (
                  <button
                    onClick={() => { setIsOpen(false); handleRequestPremium(); }}
                    className="w-full text-center block px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold rounded-lg mt-2 cursor-pointer"
                  >
                    Get Premium ⭐
                  </button>
                )}
                {user.premiumStatus === 'requested' && (
                  <div className="text-center block px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold rounded-lg mt-2 text-sm">
                    Premium Pending ⏳
                  </div>
                )}
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                  Profile
                </Link>
                <button 
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="w-full text-left block px-3 py-2 rounded-md text-base text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base bg-primary text-white text-center font-medium mt-2">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
