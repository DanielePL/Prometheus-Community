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
  const [contextId] = useState(() => Math.random().toString(36).substring(7));

  console.log(`AuthProvider render - Context ID: ${contextId}, User:`, user);

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
      console.log('Calling apiService.login...');
      const response = await apiService.login(email, password);
      console.log('API response:', response);
      
      if (response.user) {
        console.log('Setting user to:', response.user);
        setUser(prevUser => {
          console.log('Previous user:', prevUser);
          console.log('New user:', response.user);
          console.log('Setting user state now...');
          
          // Add a debug log to window so we can see it
          if (typeof window !== 'undefined') {
            window.debugAuthState = {
              previous: prevUser,
              new: response.user,
              timestamp: new Date().toISOString()
            };
            console.log('Debug state saved to window.debugAuthState');
          }
          
          return response.user;
        });
        console.log('User state should be set now');
        
        // Add a small delay to ensure state update
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('After delay - user should be set');
      } else {
        console.error('No user in response:', response);
        throw new Error('No user data in response');
      }
      
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
    isAuthenticated: !!user,
    contextId,
    // Debug function
    debugSetUser: (userData) => {
      console.log('Debug setUser called with:', userData);
      setUser(userData);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
