import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      const res = await register(name, email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Registration failed');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100-16)] flex items-center justify-center py-16 px-4">
      {/* Background decoration */}
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-8 shadow-premium relative z-10 transition-all">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-poppins text-brandText-light dark:text-brandText-dark">Create Account</h2>
          <p className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-2 font-inter">
            Join thousands of professionals landing higher paying jobs.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="premium-label">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                <FaUser className="text-sm" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="premium-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="premium-label">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                <FaEnvelope className="text-sm" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="premium-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="premium-label">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                <FaLock className="text-sm" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="premium-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="premium-label">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                <FaLock className="text-sm" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                className="premium-input pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-sm" /> Registering...
              </>
            ) : (
              <>
                Get Started Free <FaArrowRight className="text-xs" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
