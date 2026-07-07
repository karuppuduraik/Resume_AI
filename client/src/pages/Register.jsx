import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaArrowRight, FaSpinner } from 'react-icons/fa';

const Register = () => {
  const { register, loginWithGoogle } = useAuth();
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

  const handleMockGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await loginWithGoogle('mock-google-token');
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Mock Google Sign-In failed');
      }
    } catch (err) {
      console.error(err);
      setError('Mock Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError('');
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    
    // Auto-detect placeholder/example client ID to trigger mock login bypass
    const isMock = !clientId || clientId.includes('example') || clientId.includes('YOUR_');

    if (isMock) {
      handleMockGoogleLogin();
      return;
    }

    if (!window.google) {
      setError('Google SDK failed to load. Please check your network connection.');
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            setIsLoading(true);
            try {
              const res = await loginWithGoogle(tokenResponse.access_token);
              if (res.success) {
                navigate('/dashboard');
              } else {
                setError(res.message || 'Google registration failed');
              }
            } catch (err) {
              setError('Google Sign-in failed. Please try again.');
            } finally {
              setIsLoading(false);
            }
          }
        },
      });
      client.requestAccessToken();
    } catch (err) {
      console.error(err);
      setError('Failed to initialize Google login prompt.');
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

        {/* Google Powered Registration (Brown styled G logo & real OAuth popup trigger) */}
        <div className="mb-6">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 border border-amber-800/30 bg-amber-50/10 hover:bg-amber-50/30 dark:bg-brandCard-dark dark:border-brandBorder-dark rounded-xl text-sm font-semibold text-amber-900 dark:text-amber-400 hover:text-amber-950 flex items-center justify-center gap-2.5 cursor-pointer shadow-sm transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#78350f" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.555 0-6.438-2.883-6.438-6.438s2.883-6.438 6.438-6.438c1.558 0 2.977.558 4.093 1.487l3.078-3.078C19.16 2.19 15.9.962 12.24.962 6.035.962 1 5.997 1 12.202s5.035 11.24 11.24 11.24c5.89 0 10.99-4.22 10.99-11.24 0-.768-.096-1.344-.24-1.917H12.24z"/>
            </svg>
            Sign up with Google
          </button>
        </div>

        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-brandBorder-light dark:border-brandBorder-dark"></div>
          </div>
          <div className="relative bg-white dark:bg-brandCard-dark px-3 text-xs uppercase text-brandTextSecondary-light dark:text-brandTextSecondary-dark font-semibold">
            Or register with email
          </div>
        </div>

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
            className="w-full premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer flex items-center justify-center gap-2 font-semibold"
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
