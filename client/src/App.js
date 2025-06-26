// client/src/App.js
import React from 'react';
import ModularDashboard from './components/dashboard/ModularDashboard';
import Login from './components/auth/Login';
import ErrorBoundary from './components/common/ErrorBoundary';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Main App Component (wrapped with auth)
const AppContent = () => {
  const { user, loading } = useAuth();

  console.log('AppContent render - user:', user);
  console.log('AppContent render - loading:', loading);

  const handleLogin = (userData) => {
    // Login is handled by AuthContext
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    // Logout is handled by AuthContext
    console.log('User logged out');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="bg-orange-500 text-white w-16 h-16 rounded-lg flex items-center justify-center text-2xl font-bold mb-4 mx-auto animate-pulse">
            ⚡
          </div>
          <div className="text-white text-xl font-bold">PROMETHEUS</div>
          <div className="text-gray-400 mt-2">Loading Community...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <ErrorBoundary>
        {user ? (
          <>
            <div>DEBUG: User found - {user.email}</div>
            <ModularDashboard user={user} onLogout={handleLogout} />
          </>
        ) : (
          <>
            <div>DEBUG: No user found, showing login</div>
            <Login />
          </>
        )}
      </ErrorBoundary>
    </div>
  );
};

// Main App Component with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;