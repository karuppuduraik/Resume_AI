import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Invalid credentials');
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
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-8 shadow-premium relative z-10 transition-all">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-poppins text-brandText-light dark:text-brandText-dark">Welcome Back</h2>
          <p className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-2 font-inter">
            Log in to manage and download your AI resumes.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex justify-between items-center mb-1.5">
              <label className="premium-label mb-0">Password</label>
              <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                <FaLock className="text-sm" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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
                <FaSpinner className="animate-spin text-sm" /> Logging in...
              </>
            ) : (
              <>
                Log In <FaArrowRight className="text-xs" />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
