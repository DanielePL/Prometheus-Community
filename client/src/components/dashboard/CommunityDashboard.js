// client/src/components/dashboard/CommunityDashboard.js
import React, { useState } from 'react';
import Feed from './Feed';
import Challenges from './Challenges';
import Learn from './Learn';
import Leaderboard from './Leaderboard';
import Events from './Events';
import Profile from './Profile';
import Messages from './Messages';
import Settings from './Settings';

const CommunityDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('feed');

  const navigationItems = [
    { id: 'feed', label: 'Feed', emoji: '🏠' },
    { id: 'challenges', label: 'Challenges', emoji: '🎯' },
    { id: 'learn', label: 'Learn', emoji: '📚' },
    { id: 'leaderboard', label: 'Leaderboard', emoji: '🏆' },
    { id: 'events', label: 'Events', emoji: '📅' }
  ];

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'feed':
        return <Feed user={user} />;
      case 'challenges':
        return <Challenges user={user} />;
      case 'learn':
        return <Learn user={user} />;
      case 'leaderboard':
        return <Leaderboard user={user} />;
      case 'events':
        return <Events user={user} />;
      case 'profile':
        return <Profile user={user} />;
      case 'messages':
        return <Messages user={user} />;
      case 'settings':
        return <Settings user={user} />;
      default:
        return <Feed user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-prometheus-dark">
      {/* Top Navigation */}
      <nav className="bg-prometheus-dark-card border-b border-prometheus-gray-medium px-6 py-3 animate-slide-in-left">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="bg-prometheus-orange text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-2 glow-orange">
                ⚡
              </div>
              <span className="text-prometheus-text-white font-bold text-lg">Prometheus</span>
              <span className="text-prometheus-orange font-medium text-sm ml-2 pulse-dot">COMMUNITY</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                >
                  <span className="mr-2">{item.emoji}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="hidden lg:block text-prometheus-text-muted text-sm">Welcome back,</span>
            <span className="text-prometheus-text-white font-medium">{user?.name || 'Daniele Pauli'}</span>
            <button className="btn-primary hidden sm:block">
              Join Beta
            </button>
            <button
              onClick={onLogout}
              className="btn-secondary text-sm py-2 px-3"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex justify-center space-x-1 bg-prometheus-gray-dark p-1 rounded-lg">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-col items-center py-2 px-3 rounded-md transition-colors text-xs font-medium ${
                activeSection === item.id
                  ? 'bg-prometheus-orange text-white'
                  : 'text-prometheus-text-muted hover:text-white'
              }`}
            >
              <span className="text-lg mb-1">{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar - User Profile */}
        <div className="w-80 bg-prometheus-dark-card border-r border-prometheus-gray-medium p-6 animate-slide-in-left">
          <div className="text-center mb-6">
            <div className="avatar w-20 h-20 mx-auto mb-4 text-2xl">
              {user?.avatar || 'DP'}
            </div>
            <h2 className="text-prometheus-text-white font-bold text-lg">{user?.name || 'Daniele Pauli'}</h2>
            <p className="text-prometheus-text-muted text-sm">{user?.title || 'IPF World Champion'}</p>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => handleNavClick('feed')}
              className={`nav-link w-full ${activeSection === 'feed' ? 'active' : ''}`}
            >
              <span className="mr-3">🏠</span>My Feed
            </button>
            <button 
              onClick={() => handleNavClick('profile')}
              className={`nav-link w-full ${activeSection === 'profile' ? 'active' : ''}`}
            >
              <span className="mr-3">👤</span>My Profile
            </button>
            <button 
              onClick={() => handleNavClick('challenges')}
              className={`nav-link w-full ${activeSection === 'challenges' ? 'active' : ''}`}
            >
              <span className="mr-3">🎯</span>My Challenges
            </button>
            <button 
              onClick={() => handleNavClick('messages')}
              className={`nav-link w-full ${activeSection === 'messages' ? 'active' : ''}`}
            >
              <span className="mr-3">💬</span>Messages
            </button>
            <button 
              onClick={() => handleNavClick('settings')}
              className={`nav-link w-full ${activeSection === 'settings' ? 'active' : ''}`}
            >
              <span className="mr-3">⚙️</span>Settings
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderMainContent()}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 p-6 space-y-6 animate-slide-in-right">
          {/* Workout of the Day */}
          <div className="widget p-6">
            <h3 className="text-prometheus-text-white font-bold mb-4">Workout of the Day</h3>
            <div className="bg-prometheus-orange rounded-lg p-4 text-white text-center">
              <h4 className="font-bold text-lg mb-2">Prometheus Power</h4>
              <p className="text-sm mb-1">5 x 3 Back Squat</p>
              <p className="text-sm mb-1">@ 85% 1RM</p>
              <p className="text-xs mb-3">3 min rest between sets</p>
              <p className="text-xs mb-4">347 athletes participating</p>
              <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-30 transition-colors">
                Start Workout
              </button>
            </div>
          </div>

          {/* Weekly Leaderboard */}
          <div className="widget p-6">
            <h3 className="text-prometheus-text-white font-bold mb-4">Weekly Leaderboard</h3>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Alex Chen', prs: 6, badge: '🏆' },
                { rank: 2, name: 'Maria Santos', prs: 5, badge: '🥈' },
                { rank: 3, name: 'Jake Wilson', prs: 4, badge: '🥉' }
              ].map((athlete) => (
                <div key={athlete.rank} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-prometheus-orange rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {athlete.rank}
                    </div>
                    <div>
                      <p className="text-prometheus-text-white font-medium text-sm">{athlete.name}</p>
                      <p className="text-prometheus-text-muted text-xs">{athlete.prs} PRs this week</p>
                    </div>
                  </div>
                  <span className="text-lg">{athlete.badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="widget p-6">
            <h3 className="text-prometheus-text-white font-bold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              {[
                { date: '24\nNOV', title: 'VBT Masterclass', time: '2:00 PM EST' },
                { date: '1\nDEC', title: 'Beta Launch Party', time: '6:00 PM EST' },
                { date: '15\nDEC', title: 'Winter Challenge', time: 'All Day' }
              ].map((event, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-prometheus-orange text-white text-center rounded-lg p-2 mr-4 min-w-12">
                    <div className="text-xs font-bold whitespace-pre-line">{event.date}</div>
                  </div>
                  <div>
                    <p className="text-prometheus-text-white font-medium text-sm">{event.title}</p>
                    <p className="text-prometheus-text-muted text-xs">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Stats */}
          <div className="widget p-6">
            <h3 className="text-prometheus-text-white font-bold mb-4">Community Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-prometheus-text-muted text-sm">Active Athletes</span>
                <span className="text-prometheus-text-white font-medium">2,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-prometheus-text-muted text-sm">PRs This Week</span>
                <span className="text-prometheus-text-white font-medium">156</span>
              </div>
              <div className="flex justify-between">
                <span className="text-prometheus-text-muted text-sm">Workouts Completed</span>
                <span className="text-prometheus-text-white font-medium">1,203</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-prometheus-orange hover:bg-prometheus-orange-dark text-white rounded-full flex items-center justify-center text-xl shadow-lg glow-orange transition-all hover:scale-110">
        +
      </button>
    </div>
  );
};

export default CommunityDashboard;