// client/src/App.js
import React, { useState, useEffect } from 'react';
import ModularDashboard from './components/dashboard/ModularDashboard';
import Login from './components/auth/Login';

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Temporarily disabled to always show login page for demo
    // Check for existing user data on app load
    // try {
    //   const storedUser = localStorage.getItem('prometheus_user');
    //   if (storedUser) {
    //     setUser(JSON.parse(storedUser));
    //   }
    // } catch (error) {
    //   console.error('Error loading user data:', error);
    //   localStorage.removeItem('prometheus_user');
    // }
    
    // Simulate loading time
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    // Store user data for persistence
    localStorage.setItem('prometheus_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('prometheus_user');
    setUser(null);
  };

  if (isLoading) {
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
      {user ? (
        <ModularDashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;