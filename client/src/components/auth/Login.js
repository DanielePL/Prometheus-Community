// client/src/components/auth/Login.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState({});
  const [isActive, setIsActive] = useState(true);
  const [debugMessages, setDebugMessages] = useState([]);
  const [localUser, setLocalUser] = useState(null);
  
  const { login, loading, error, user, debugSetUser } = useAuth();
  
  // Add context debugging
  const authContext = useAuth();
  const contextId = authContext.contextId || 'unknown';

  const addDebugMessage = (message) => {
    setDebugMessages(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleTestLocalState = () => {
    addDebugMessage('Setting local user state...');
    setLocalUser({
      email: 'admin@prometheuscommunity.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    addDebugMessage('Local user state set!');
  };

  // Launch date: September 1st, 2025
  const launchDate = new Date('2025-09-01T00:00:00').getTime();

  // Test API call directly
  useEffect(() => {
    const testApi = async () => {
      try {
        addDebugMessage('Testing direct API call...');
        const response = await fetch('http://localhost:5000/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'admin@prometheuscommunity.com',
            password: 'admin123'
          })
        });
        
        const data = await response.json();
        addDebugMessage(`API Response: ${JSON.stringify(data)}`);
        
        if (data.success && data.user) {
          addDebugMessage('API call successful! Setting user...');
          // Try to call the context login function
          try {
            await login('admin@prometheuscommunity.com', 'admin123');
            addDebugMessage('Context login completed');
          } catch (contextError) {
            addDebugMessage(`Context login failed: ${contextError.message}`);
          }

          // Also try direct user state setting
          addDebugMessage('Testing direct user state setting...');
          if (debugSetUser) {
            debugSetUser({
              id: 1,
              email: 'admin@prometheuscommunity.com',
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin'
            });
            addDebugMessage('Direct debugSetUser called - user should be set now');
          } else {
            addDebugMessage('ERROR: debugSetUser function not available');
          }
        }
      } catch (error) {
        addDebugMessage(`API test failed: ${error.message}`);
      }
    };
    
    // Run the test after 2 seconds
    const timer = setTimeout(testApi, 2000);
    return () => clearTimeout(timer);
  }, [login, debugSetUser]);

  const handleForceUserSet = () => {
    addDebugMessage('Forcing user state directly...');
    try {
      if (debugSetUser) {
        debugSetUser({
          id: 1,
          email: 'admin@prometheuscommunity.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin'
        });
        addDebugMessage('Direct debugSetUser called');
      } else {
        addDebugMessage('debugSetUser function not available');
      }
    } catch (error) {
      addDebugMessage(`Force set error: ${error.message}`);
    }
  };

  const handleTestLogin = async () => {
    addDebugMessage('Test login starting...');
    try {
      addDebugMessage('Calling auth context login...');
      const result = await login('admin@prometheuscommunity.com', 'admin123');
      addDebugMessage(`Login result: ${JSON.stringify(result, null, 2)}`);
      addDebugMessage(`User state after login: ${user ? user.email : 'still null'}`);
      
      // Check window debug state
      if (typeof window !== 'undefined' && window.debugAuthState) {
        addDebugMessage(`Window debug state: ${JSON.stringify(window.debugAuthState, null, 2)}`);
      }
      
      // Wait a bit and check again
      setTimeout(() => {
        addDebugMessage(`User after timeout: ${user ? user.email : 'still null'}`);
      }, 500);
    } catch (error) {
      addDebugMessage(`Login error: ${error.message}`);
    }
  };

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
      await login(email, password);
      // Login success is handled by AuthContext
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleDemoLogin = async () => {
    console.log('Demo login clicked!');
    addDebugMessage('Demo login clicked!');
    try {
      setEmail('admin@prometheuscommunity.com');
      setPassword('admin123');
      addDebugMessage('About to call login function...');
      console.log('About to call login function...');
      const result = await login('admin@prometheuscommunity.com', 'admin123');
      addDebugMessage(`Login function returned: ${JSON.stringify(result)}`);
      console.log('Login function returned:', result);
      // Login success is handled by AuthContext
    } catch (error) {
      addDebugMessage(`Demo login failed: ${error.message}`);
      console.error('Demo login failed:', error);
      console.error('Error details:', error.message);
    }
  };

  const handleTestApiCall = async () => {
    console.log('Testing direct API call...');
    addDebugMessage('Testing direct API call...');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@prometheuscommunity.com',
          password: 'admin123'
        })
      });
      
      const data = await response.json();
      addDebugMessage(`Direct API response: ${JSON.stringify(data)}`);
      console.log('Direct API response:', data);
      
      if (data.success) {
        addDebugMessage('Direct API call successful!');
        console.log('Direct API call successful!');
      }
    } catch (error) {
      addDebugMessage(`Direct API call failed: ${error.message}`);
      console.error('Direct API call failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Prometheus Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Lightning bolt patterns */}
        <div className="absolute top-20 left-20 w-1 h-32 bg-gradient-to-b from-orange-500 to-transparent opacity-30 transform rotate-12"></div>
        <div className="absolute bottom-32 right-32 w-1 h-24 bg-gradient-to-t from-orange-500 to-transparent opacity-20 transform -rotate-12"></div>
        <div className="absolute top-1/3 right-1/4 w-1 h-20 bg-gradient-to-b from-orange-500 to-transparent opacity-25 transform rotate-45"></div>
        
        {/* Glowing orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(249, 115, 22, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(249, 115, 22, 0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
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

          {/* Hype Announcement */}
          <div className="bg-gray-900/80 border border-orange-500/50 rounded-2xl p-8 mb-8 backdrop-blur-sm shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <span className="bg-orange-500 text-white px-6 py-3 rounded-full text-sm font-bold animate-pulse shadow-lg">
                🔥 EXCLUSIVE BETA ACCESS
              </span>
            </div>
            <h2 className="text-5xl font-black text-white mb-6 tracking-tight">
              THE ULTIMATE TRAINING COMMUNITY LAUNCHES IN
            </h2>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              Where <span className="text-orange-500 font-semibold">elite coaching meets cutting-edge technology</span> - 
              connecting athletes with world-class trainers in a community that pushes every member to their peak potential.
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-8 mb-12 max-w-5xl mx-auto">
            {[
              { value: timeLeft.days, label: 'DAYS' },
              { value: timeLeft.hours, label: 'HOURS' },
              { value: timeLeft.minutes, label: 'MINUTES' },
              { value: timeLeft.seconds, label: 'SECONDS' }
            ].map((item, index) => (
              <div key={index} className="bg-gray-900 rounded-2xl p-8 border border-orange-500/30 shadow-2xl transform hover:scale-105 transition-all duration-300">
                <div className="text-6xl font-black text-orange-500 mb-3 tracking-tight">
                  {String(item.value || 0).padStart(2, '0')}
                </div>
                <div className="text-orange-500 font-bold text-xl tracking-wider">
                  {item.label}
                </div>
                <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-8 flex items-center">
                <span className="mr-3">🚀</span>Unlock Your Full Potential
              </h3>
              <div className="space-y-6">
                {[
                  { icon: '🧠', title: 'Expert Coaching at Scale', desc: 'Get personalized guidance from certified professionals who understand your goals. Our platform amplifies their expertise to help hundreds of athletes simultaneously.' },
                  { icon: '📱', title: 'Perfect Your Technique', desc: 'Use advanced movement analysis to refine your form in real-time. Get instant feedback that rivals having a coach standing right beside you.' },
                  { icon: '⚡', title: 'Track Every Rep', desc: 'Monitor bar speed, power output, and movement quality for optimal training adaptations. Data-driven insights that serious athletes demand.' },
                  { icon: '🍎', title: 'Nutrition Made Simple', desc: 'Smart nutrition tracking that adapts to your training demands. No more guesswork - just results-driven meal planning that fits your lifestyle.' },
                  { icon: '👥', title: 'Elite Community Access', desc: 'Train alongside top athletes and coaches. Share knowledge, celebrate victories, and push each other to new heights in a supportive environment.' }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-5 bg-gray-900/80 rounded-2xl p-6 border border-gray-800/50 hover:border-orange-500/30 transition-all duration-300">
                    <span className="text-4xl">{feature.icon}</span>
                    <div>
                      <h4 className="text-orange-500 font-bold text-xl mb-2">{feature.title}</h4>
                      <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-gray-900 rounded-2xl p-8 border border-orange-500/30 shadow-xl">
              <div className="text-center">
                <div className="text-5xl font-black text-orange-500 mb-3">10,000+</div>
                <div className="text-white font-bold text-xl mb-2">Athletes & Trainers Already Registered</div>
                <div className="text-orange-500 text-lg font-medium">Join the Revolution!</div>
                <div className="mt-4 text-sm text-gray-400">
                  🏋️‍♂️ Powerlifting • 🤸‍♀️ CrossFit • ⚽ Team Sports • 🏃‍♂️ Running • 🏥 Rehabilitation
                </div>
                <div className="mt-4 flex justify-center space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-10 border border-orange-500/30 shadow-2xl">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-white mb-3 flex items-center justify-center">
                <span className="mr-3">🎯</span>Secure Your Beta Access
              </h3>
              <p className="text-gray-400 text-lg">
                Get exclusive access to the community platform
              </p>
            </div>

            {/* Debug Display */}
            <div className="mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
              <h4 className="text-white font-bold mb-2">Debug Info:</h4>
              <div className="text-xs text-gray-300 space-y-1">
                <div>Context User: {user ? `${user.email} (${user.role})` : 'Not logged in'}</div>
                <div>Local User: {localUser ? `${localUser.email} (${localUser.role})` : 'Not set'}</div>
                <div>Loading: {loading ? 'Yes' : 'No'}</div>
                <div>Error: {error || 'None'}</div>
                <div>Is Authenticated: {user ? 'YES' : 'NO'}</div>
                <div>Context ID: {contextId}</div>
                <div className="mt-2">Recent messages:</div>
                {debugMessages.map((msg, i) => (
                  <div key={i} className="text-xs text-green-400">{msg}</div>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/60 border border-red-700/50 rounded-xl p-4 mb-6 backdrop-blur-sm">
                <p className="text-red-300 text-sm text-center font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-white font-semibold mb-3 text-lg">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-lg"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-3 text-lg">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white px-6 py-4 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all duration-300 text-lg"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl text-lg border border-orange-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : '🚀 ENTER PROMETHEUS BETA'}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">or</span>
                </div>
              </div>

              <button
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-700 hover:border-orange-500/50 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Demo...
                  </span>
                ) : '👨‍💻 Try Demo Access'}
              </button>

              <button
                onClick={handleForceUserSet}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 border border-red-500 text-lg"
              >
                🔥 Force Set User State
              </button>

              <button
                onClick={handleTestLocalState}
                className="w-full mt-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 border border-purple-500 text-lg"
              >
                🎯 Test Local State
              </button>

              <button
                onClick={handleTestLogin}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 border border-green-500 text-lg"
              >
                🧪 Test Auth Context Login
              </button>

              <button
                onClick={handleTestApiCall}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 border border-blue-500 text-lg"
              >
                🔧 Test Direct API Call
              </button>
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <button className="text-orange-400 hover:text-orange-300 font-medium">
                  Join Waitlist
                </button>
              </p>
            </div>

            {/* Beta Benefits */}
            <div className="mt-10 bg-gray-900 rounded-xl p-6 border border-orange-500/30">
              <h4 className="text-orange-500 font-bold mb-4 flex items-center text-lg">
                <span className="mr-3">🎁</span> Exclusive Beta Benefits
              </h4>
              <ul className="text-gray-300 space-y-2">
                <li className="flex items-center"><span className="text-orange-500 mr-2">•</span> 50% Lifetime Discount on Premium Features</li>
                <li className="flex items-center"><span className="text-orange-500 mr-2">•</span> Direct Access to Development Team</li>
                <li className="flex items-center"><span className="text-orange-500 mr-2">•</span> Exclusive Beta Features Before Everyone Else</li>
                <li className="flex items-center"><span className="text-orange-500 mr-2">•</span> VIP Status in the Community</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gray-900/90 rounded-2xl p-10 border border-orange-500/30 shadow-2xl">
            <h3 className="text-4xl font-bold text-white mb-6">
              🔥 Don't Miss the Launch!
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              September 1st, 2025 - Where <span className="text-orange-500 font-semibold">world-class coaching meets innovative technology</span> to create 
              the most advanced training community in the industry.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 border border-orange-400/30 shadow-xl">
                📱 Reserve Your Spot
              </button>
              <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-10 rounded-xl transition-all duration-300 border border-gray-700 hover:border-orange-500/50">
                📧 Get Launch Updates
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;