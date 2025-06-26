// client/src/components/auth/Login.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: ''
  });
  const [timeLeft, setTimeLeft] = useState({});
  const [isActive, setIsActive] = useState(true);
  
  const { login, register, loading, error } = useAuth();

  // Launch date: September 1st, 2025
  const launchDate = new Date('2025-09-01T00:00:00').getTime();

  useEffect(() => {
    let intervalId = null;
    
    if (isActive) {
      intervalId = setInterval(() => {
        const now = new Date().getTime();
        const difference = launchDate - now;
        
        if (difference > 0) {
          setTimeLeft({
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000)
          });
        } else {
          setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          setIsActive(false);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isActive, launchDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      onLogin(response.user);
    } catch (error) {
      console.error('Login failed:', error);
      // Error is handled by AuthContext and displayed below
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await register(registrationData);
      onLogin(response.user);
    } catch (error) {
      console.error('Registration failed:', error);
      // Error is handled by AuthContext and displayed below
    }
  };

  const handleRegistrationChange = (field, value) => {
    setRegistrationData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Prometheus Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Lightning bolt patterns */}
        <div className="absolute top-20 left-20 w-1 h-32 bg-gradient-to-b from-orange-500 to-transparent opacity-30 transform rotate-12"></div>
        <div className="absolute bottom-32 right-32 w-1 h-24 bg-gradient-to-t from-orange-500 to-transparent opacity-20 transform -rotate-12"></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-16 bg-gradient-to-b from-orange-400 to-transparent opacity-25 transform rotate-45"></div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-orange-500 rounded-full opacity-40 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-orange-400 rounded-full opacity-30 animate-pulse delay-1000"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"60\" height=\"60\" viewBox=\"0 0 60 60\"%3E%3Cg fill=\"none\" stroke=\"%23f97316\" stroke-width=\"0.5\" opacity=\"0.1\"%3E%3Cpath d=\"M60 0H0v60h60z\"/>%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4 mx-auto shadow-lg shadow-orange-500/25">
            ⚡
          </div>
          <h1 className="text-white text-3xl font-bold mb-2">PROMETHEUS</h1>
          <p className="text-gray-400 text-sm">Strength Training Community</p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-white text-center text-sm font-semibold mb-3">Beta Launch Countdown</h3>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-orange-500 font-bold text-lg">{timeLeft.days || 0}</div>
              <div className="text-gray-400 text-xs">Days</div>
            </div>
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-orange-500 font-bold text-lg">{timeLeft.hours || 0}</div>
              <div className="text-gray-400 text-xs">Hours</div>
            </div>
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-orange-500 font-bold text-lg">{timeLeft.minutes || 0}</div>
              <div className="text-gray-400 text-xs">Minutes</div>
            </div>
            <div className="bg-gray-800/50 rounded p-2">
              <div className="text-orange-500 font-bold text-lg">{timeLeft.seconds || 0}</div>
              <div className="text-gray-400 text-xs">Seconds</div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-800 rounded-lg p-3 mb-4">
            <p className="text-red-300 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Login/Register Form */}
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-6 shadow-2xl">
          <div className="flex mb-6 bg-gray-800/50 rounded-lg p-1">
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                !isRegistering 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setIsRegistering(false)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                isRegistering 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
              onClick={() => setIsRegistering(true)}
            >
              Sign Up
            </button>
          </div>

          {!isRegistering ? (
            // Login Form
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          ) : (
            // Registration Form
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={registrationData.firstName}
                  onChange={(e) => handleRegistrationChange('firstName', e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={registrationData.lastName}
                  onChange={(e) => handleRegistrationChange('lastName', e.target.value)}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={registrationData.username}
                onChange={(e) => handleRegistrationChange('username', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registrationData.email}
                onChange={(e) => handleRegistrationChange('email', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registrationData.password}
                onChange={(e) => handleRegistrationChange('password', e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Beta Info */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            🚀 <span className="text-orange-500 font-semibold">Private Beta</span> - Limited Access
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Join the Prometheus Community for Velocity-Based Training
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
