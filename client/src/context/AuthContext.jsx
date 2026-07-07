import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on load
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          if (res.success) {
            setUser(res.data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Failed to load user profile', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          premiumStatus: res.data.premiumStatus || 'none',
          profilePicture: res.data.profilePicture,
        });
        return { success: true };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          premiumStatus: res.data.premiumStatus || 'none',
          profilePicture: res.data.profilePicture,
        });
        return { success: true };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Registration failed' };
    }
  };

  const loginWithGoogle = async (googleToken) => {
    try {
      const res = await api.post('/auth/google', { token: googleToken });
      if (res.success) {
        localStorage.setItem('token', res.data.token);
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          premiumStatus: res.data.premiumStatus || 'none',
          profilePicture: res.data.profilePicture,
        });
        return { success: true };
      }
      return { success: false, message: res.message || 'Google Login failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Google Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await api.put('/auth/profile', profileData);
      if (res.success) {
        setUser({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
          role: res.data.role,
          premiumStatus: res.data.premiumStatus || 'none',
          profilePicture: res.data.profilePicture,
        });
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        return { success: true };
      }
      return { success: false, message: res.message || 'Update failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Update failed' };
    }
  };

  const requestPremium = async () => {
    try {
      const res = await api.post('/auth/premium-request');
      if (res.success) {
        setUser(prev => ({
          ...prev,
          premiumStatus: 'requested'
        }));
        return { success: true };
      }
      return { success: false, message: res.message || 'Request failed' };
    } catch (error) {
      return { success: false, message: error.message || 'Request failed' };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, logout, updateProfile, requestPremium }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
