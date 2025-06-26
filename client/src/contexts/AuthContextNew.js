// client/src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for saved token and get current user
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('prometheus_token');
      if (savedToken) {
        try {
          apiService.setToken(savedToken);
          const userData = await apiService.getCurrentUser();
          setUser(userData.user);
          console.log('Loaded user from API:', userData.user);
        } catch (error) {
          console.error('Error loading user from API:', error);
          // Token is invalid, remove it
          localStorage.removeItem('prometheus_token');
          apiService.setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    console.log('Login attempt with:', { email });
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
      console.log('Login successful:', response.user);
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    console.log('Register attempt with:', userData.email);
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.register(userData);
      setUser(response.user);
      console.log('Registration successful:', response.user);
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiService.logout();
      setUser(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await apiService.updateUserProfile(profileData);
      setUser(response.user);
      return response;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
