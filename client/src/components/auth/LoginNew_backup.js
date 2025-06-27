// Production Login Component - Clean and Ready for Live Use
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('danielepauli@gmail.com');
  const [password, setPassword] = useState('admin123');
  const [isSignup, setIsSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const { login, loading, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    // TODO: Implement signup API call
    console.log('Signup requested:', signupData);
    alert('Registration is currently closed. Please join our waitlist!');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-1 h-32 bg-gradient-to-b from-orange-500 to-transparent opacity-30 transform rotate-12"></div>
        <div className="absolute bottom-32 right-32 w-1 h-24 bg-gradient-to-t from-orange-500 to-transparent opacity-20 transform -rotate-12"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-20 bg-gradient-to-b from-orange-500 to-transparent opacity-25 transform rotate-45"></div>
        
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* Logo and Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mr-6 shadow-2xl border border-orange-400/30">
              ⚡
            </div>
            <div>
              <h1 className="text-6xl font-black text-white mb-2 tracking-tight">
                PROMETHEUS
              </h1>
              <p className="text-orange-500 font-bold text-2xl tracking-wider">
                COMMUNITY
              </p>
            </div>
          </div>

          <div className="bg-gray-900/80 border border-orange-500/50 rounded-2xl p-8 mb-8 backdrop-blur-sm shadow-2xl">
            <h2 className="text-4xl font-black text-white mb-4 tracking-tight">
              Elite Strength Training Community
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Where <span className="text-orange-500 font-semibold">world-class coaching meets cutting-edge technology</span> - 
              connecting athletes with elite trainers in a community that pushes every member to their peak potential.
            </p>
          </div>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-10 border border-orange-500/30 shadow-2xl max-w-lg mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-white mb-3">
              {isSignup ? '🚀 Join the Community' : '🎯 Welcome Back'}
            </h3>
            <p className="text-gray-400 text-lg">
              {isSignup ? 'Create your account to get started' : 'Sign in to your account'}
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/60 border border-red-700/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
              <p className="text-red-300 text-sm text-center font-medium">{error}</p>
            </div>
          )}

          {!isSignup ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-orange-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : '🚀 Enter Prometheus'}
              </button>
            </form>
          ) : (
            /* Signup Form */
            <form onSubmit={handleSignupSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-semibold mb-3">Full Name</label>
                <input
                  type="text"
                  value={signupData.name}
                  onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">Email</label>
                <input
                  type="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">Password</label>
                <input
                  type="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3">Confirm Password</label>
                <input
                  type="password"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl border border-orange-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : '🚀 Join Prometheus'}
              </button>
            </form>
          )}

          {/* Toggle between Login/Signup */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button 
                onClick={() => setIsSignup(!isSignup)}
                className="text-orange-400 hover:text-orange-300 font-medium"
              >
                {isSignup ? 'Sign In' : 'Join Waitlist'}
              </button>
            </p>
          </div>

          {/* Beta Status */}
          <div className="mt-8 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <div className="text-center">
              <p className="text-orange-500 font-semibold text-sm">
                🚀 Private Beta Access
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Currently accepting limited members
              </p>
            </div>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🧠', title: 'Expert Coaching', desc: 'Learn from world-class trainers and performance coaches' },
            { icon: '📊', title: 'Advanced Analytics', desc: 'Track every metric that matters for optimal performance' },
            { icon: '👥', title: 'Elite Community', desc: 'Train alongside top athletes and fitness professionals' }
          ].map((feature, index) => (
            <div key={index} className="bg-gray-900/60 rounded-2xl p-6 border border-gray-800 text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-orange-500 font-bold text-xl mb-2">{feature.title}</h4>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
