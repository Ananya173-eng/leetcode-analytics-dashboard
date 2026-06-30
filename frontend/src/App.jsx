import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LandingPage from './components/LandingPage';
import LoginRegister from './components/LoginRegister';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import ParticleBackground from './components/ParticleBackground';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B1020]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-violet border-t-transparent"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Public Route wrapper (prevents logged in users from visiting login page)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B1020]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-violet border-t-transparent"></div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="relative min-h-screen w-full overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
            {/* Interactive Floating Particle Canvas */}
            <ParticleBackground />

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <LoginRegister />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                } 
              />
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
