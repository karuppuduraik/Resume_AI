import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaSpinner, FaCheckCircle } from 'react-icons/fa';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [photoUrl, setPhotoUrl] = useState(user?.profilePicture || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const toggleRole = async () => {
    setIsLoading(true);
    setFeedback({ type: '', message: '' });
    const targetRole = user.role === 'admin' ? 'user' : 'admin';
    try {
      const res = await updateProfile({ name: user.name, email: user.email, role: targetRole });
      if (res.success) {
        setFeedback({ type: 'success', message: `Successfully changed your role to ${targetRole}!` });
      } else {
        setFeedback({ type: 'error', message: res.message || 'Failed to toggle role' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'Failed to toggle role' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', message: '' });

    if (password && password !== confirmPassword) {
      return setFeedback({ type: 'error', message: 'Passwords do not match' });
    }

    setIsLoading(true);

    try {
      const updateData = { name, email, profilePicture: photoUrl };
      if (password) {
        updateData.password = password;
      }

      const res = await updateProfile(updateData);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Profile updated successfully!' });
        setPassword('');
        setConfirmPassword('');
      } else {
        setFeedback({ type: 'error', message: res.message || 'Update failed' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-brandText-light dark:text-brandText-dark font-poppins">Account Settings</h1>
        <p className="text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-1 font-inter">
          Manage your profile settings, profile picture, and login credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column: profile picture preview */}
        <div className={`md:col-span-1 bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium h-fit text-center ${
          user?.premiumStatus === 'approved' ? 'premium-glow-card' : ''
        }`}>
          <div className="relative w-32 h-32 mx-auto mb-4 group">
            {photoUrl ? (
              <img 
                src={photoUrl} 
                alt="Profile Preview" 
                referrerPolicy="no-referrer"
                className="w-full h-full rounded-full object-cover border-2 border-primary" 
              />
            ) : (
              <div className="w-full h-full rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-4xl border-2 border-primary/20">
                {user?.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <FaCamera className="text-white text-xl" />
            </div>
          </div>
          <h3 className={`font-bold text-lg font-poppins ${
            user?.premiumStatus === 'approved' ? 'premium-shimmer-text' : 'text-brandText-light dark:text-brandText-dark'
          }`}>{user?.name}</h3>
          <p className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark mb-4">{user?.email}</p>
          <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold uppercase">{user?.role} Account</span>
          {(user?.email === 'karuppuduraikece@gmail.com') && (
            <div className="mt-4 pt-4 border-t border-brandBorder-light dark:border-brandBorder-dark">
              <button
                onClick={toggleRole}
                disabled={isLoading}
                type="button"
                className="text-xs w-full py-2 px-3 bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-semibold rounded-lg border border-amber-500/25 transition-colors cursor-pointer"
              >
                Toggle Dev Admin Role
              </button>
            </div>
          )}
        </div>

        {/* Right column: form */}
        <div className="md:col-span-2 bg-white dark:bg-brandCard-dark border border-brandBorder-light dark:border-brandBorder-dark rounded-2xl p-6 shadow-premium transition-all">
          {feedback.message && (
            <div className={`mb-6 p-4 rounded-xl border flex items-center gap-2 text-sm ${
              feedback.type === 'success' 
                ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-950/20 dark:border-green-900/50 dark:text-green-300' 
                : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-950/20 dark:border-red-900/50 dark:text-red-300'
            }`}>
              {feedback.type === 'success' && <FaCheckCircle className="flex-shrink-0" />}
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                    className="premium-input pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="premium-label">Profile Photo URL</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="premium-input"
              />
              <span className="text-xs text-brandTextSecondary-light dark:text-brandTextSecondary-dark mt-1.5 block">Paste a public photo URL to update your profile image</span>
            </div>

            <hr className="border-brandBorder-light dark:border-brandBorder-dark" />

            <div>
              <h3 className="text-sm font-semibold uppercase text-primary dark:text-secondary mb-4 font-poppins">Change Password (Optional)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="premium-label">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-brandTextSecondary-light dark:text-brandTextSecondary-dark">
                      <FaLock className="text-sm" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="premium-input pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="premium-btn text-white bg-primary hover:bg-primary-dark shadow-glass cursor-pointer flex items-center gap-2"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : null} Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
