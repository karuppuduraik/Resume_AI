import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import ResumeBuilder from './pages/ResumeBuilder';
import ATSChecker from './pages/ATSChecker';
import CoverLetterGenerator from './pages/CoverLetterGenerator';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Spinner Component for global loading
const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col justify-center items-center bg-brandBg-light dark:bg-brandBg-dark">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    <p className="mt-4 text-sm text-brandTextSecondary-light dark:text-brandTextSecondary-dark font-medium">Initializing workspace...</p>
  </div>
);

// Protected Route Guard
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route Guard (prevents logged in users from seeing login/register)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-brandBg-light dark:bg-brandBg-dark text-brandText-light dark:text-brandText-dark transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path="/builder" element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          } />
          
          <Route path="/ats-checker" element={
            <ProtectedRoute>
              <ATSChecker />
            </ProtectedRoute>
          } />
          
          <Route path="/cover-letter" element={
            <ProtectedRoute>
              <CoverLetterGenerator />
            </ProtectedRoute>
          } />

          {/* Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
