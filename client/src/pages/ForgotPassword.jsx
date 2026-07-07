import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { FaEnvelope, FaLock, FaKey, FaArrowRight, FaSpinner } from 'react-icons/fa';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: request code, 2: reset password
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Intercept with sandbox notice and redirect as requested
    setSuccess('This feature is currently in development. Please try creating another new account to test.');
    setTimeout(() => {
      setIsLoading(false);
      navigate('/register');
    }, 3500);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);

    try {
      const res = await api.post('/auth/reset-password', {
        email,
        code,
        newPassword,
      });

      if (res.success) {
        setSuccess('Password reset successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(res.message || 'Failed to reset password');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100-16)] flex items-center justify-center py-16 px-4">
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-8 shadow-premium relative z-10 transition-all">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold font-poppins text-brandText-light dark:text-brandText-dark">
            {step === 1 ? 'Reset Password' : 'Enter Code'}
          </h2>
          <p className="text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-2 font-inter">
            {step === 1 
              ? 'Enter your email address to receive a 6-digit password reset code.' 
              : 'Enter the verification code sent to your email and set your new password.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-500 rounded-r-lg text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border-l-4 border-green-500 rounded-r-lg text-sm text-green-700 dark:text-green-300">
            {success}
          </div>
        )}



        {step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-6">
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer flex items-center justify-center gap-2 font-semibold"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin text-sm" /> Generating Code...
                </>
              ) : (
                <>
                  Send Reset Code <FaArrowRight className="text-xs" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="premium-label">6-Digit Verification Code</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                  <FaKey className="text-sm" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="premium-input pl-10 tracking-widest font-mono text-center text-lg"
                />
              </div>
            </div>

            <div>
              <label className="premium-label">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                  <FaLock className="text-sm" />
                </div>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="premium-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="premium-label">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                  <FaLock className="text-sm" />
                </div>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
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
                  <FaSpinner className="animate-spin text-sm" /> Resetting Password...
                </>
              ) : (
                <>
                  Update Password <FaArrowRight className="text-xs" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-8 text-center text-sm">
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
