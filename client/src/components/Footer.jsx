import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-brandCard-dark border-t border-brandBorder-light dark:border-brandBorder-dark transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-4 xl:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Resume AI Logo" className="h-8 w-8 rounded-lg object-cover shadow-glass" />
              <span className="font-poppins text-xl font-bold tracking-tight text-brandText-light dark:text-brandText-dark">
                Resume<span className="text-primary dark:text-secondary">AI</span>
              </span>
            </Link>
            <p className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark text-sm max-w-xs">
              Build professional, ATS-friendly resumes in minutes with the power of Artificial Intelligence.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider font-poppins">
                  Product
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link to="/builder" className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary">
                      Resume Builder
                    </Link>
                  </li>
                  <li>
                    <Link to="/ats-checker" className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary">
                      ATS Optimization
                    </Link>
                  </li>
                  <li>
                    <Link to="/cover-letter" className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary">
                      Cover Letter Generator
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-8 md:mt-0">
                <h3 className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider font-poppins">
                  Resources
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary">
                      Writing Tips
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary">
                      ATS Standards
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary">
                      Job Matches
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
              <div>
                <h3 className="text-xs font-semibold text-primary dark:text-secondary uppercase tracking-wider font-poppins">
                  Company
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="#" className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark hover:text-primary dark:hover:text-secondary">
                      Terms of Service
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-brandBorder-light dark:border-brandBorder-dark pt-8 flex justify-between items-center flex-col sm:flex-row">
          <p className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
            &copy; {new Date().getFullYear()} Resume AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
