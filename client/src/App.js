// client/src/App.js
import React, { useState, useEffect } from 'react';
import ModularDashboard from './components/dashboard/ModularDashboard';

// Login Component
const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (error) setError('');
  };

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create user object with realistic data
      const userData = {
        email: formData.email,
        name: 'Daniele Pauli',
        title: 'IPF World Champion',
        avatar: 'DP',
        token: 'demo_token_' + Date.now()
      };
      
      // Store in localStorage
      localStorage.setItem('prometheus_user', JSON.stringify(userData));
      
      // Call onLogin with user data
      onLogin(userData);
      
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-500 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-orange-500 rounded-full opacity-40 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-orange-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-orange-500 text-white w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold mr-3">
              ⚡
            </div>
            <h1 className="text-3xl font-bold text-white">PROMETHEUS</h1>
          </div>
          <p className="text-gray-400 text-sm">AI-Powered Strength Training Community</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-400 hover:text-gray-300">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-orange-500 bg-gray-800 border-gray-600 rounded focus:ring-orange-500"
                />
                <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-300">
                  Remember me
                </label>
              </div>
              <button className="text-sm text-orange-500 hover:text-orange-400 transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-700 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-gray-400">
            <strong>Demo:</strong> Use any email/password to access the community
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user data on app load
    try {
      const storedUser = localStorage.getItem('prometheus_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log('No stored user data found');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
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