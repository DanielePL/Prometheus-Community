// client/src/components/auth/Login.js
import React, { useState, useEffect } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState({});
  const [isActive, setIsActive] = useState(true);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock login for demo
    onLogin({ 
      name: 'Daniele Pauli', 
      email, 
      avatar: 'DP',
      betaAccess: true 
    });
  };

  const handleDemoLogin = () => {
    onLogin({ 
      name: 'Daniele Pauli', 
      email: 'daniele@prometheus.com', 
      avatar: 'DP',
      betaAccess: true 
    });
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
              THE AI COACHING REVOLUTION LAUNCHES IN
            </h2>
            <p className="text-xl text-gray-300 mb-6 max-w-3xl mx-auto leading-relaxed">
              The world's first fully automated <span className="text-orange-500 font-semibold">AI-powered fitness platform</span> that 
              transforms how you train, eat, and achieve your goals. Built for real people who want real results.
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
                  { icon: '🧠', title: 'Your Personal AI Coach', desc: 'Want to unlock your inner beast? Get a smart training plan that adapts to your progress and ensures you hit your goals faster than ever.' },
                  { icon: '📱', title: 'Perfect Your Form', desc: 'Use your phone camera to check your technique in real-time. No more guessing - see exactly how to move for maximum results and injury prevention.' },
                  { icon: '⚡', title: 'Track Your Power', desc: 'We measure your bar speed and movement quality for better muscle and strength development. Train smarter, not just harder.' },
                  { icon: '🍎', title: 'Effortless Nutrition', desc: 'Just snap a photo of your meal and our AI tells you exactly what nutrients you\'re getting. No more tedious calorie counting.' },
                  { icon: '👥', title: 'Expert Guidance', desc: 'Get access to professional coaches who can guide hundreds of athletes efficiently. Video calls, progress reviews, and personalized feedback.' }
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
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl text-lg border border-orange-400/30"
              >
                🚀 ENTER PROMETHEUS BETA
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
                className="w-full mt-6 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 border border-gray-700 hover:border-orange-500/50 text-lg"
              >
                👨‍💻 Try Demo Access
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
              September 1st, 2025 - The most anticipated launch of an 
              <span className="text-orange-500 font-semibold"> AI-powered fitness platform</span> in the industry.
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
