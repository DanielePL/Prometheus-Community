// client/src/hooks/useAuth.js
import { useState, useEffect } from 'react';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('prometheus_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('prometheus_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create demo user data
    const userData = {
      id: 1,
      email,
      name: 'Daniele Pauli',
      title: 'IPF World Champion',
      avatar: 'DP',
      token: 'demo_token_' + Date.now(),
      joinDate: new Date().toISOString()
    };
    
    setUser(userData);
    localStorage.setItem('prometheus_user', JSON.stringify(userData));
    setLoading(false);
    
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('prometheus_user');
  };

  return {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user
  };
};

export default useAuth;