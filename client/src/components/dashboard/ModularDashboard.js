// client/src/components/dashboard/ModularDashboard.js
import React, { useState } from 'react';
import FeedSimple from './FeedSimple';
import ProfileSimple from './ProfileSimple';
import ChallengesSimple from './ChallengesSimple';
import LearnSimple from './LearnSimple';
import LeaderboardSimple from './LeaderboardSimple';
import EventsSimple from './EventsSimple';
import MessagesSimple from './MessagesSimple';
import SettingsSimple from './SettingsSimple';
import CampusSimple from './CampusSimple';

const ModularDashboard = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('campus'); // Start with Campus as default
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      training: true,
      social: false
    },
    privacy: {
      profile: 'public',
      workouts: 'friends',
      achievements: 'public'
    },
    units: {
      weight: 'kg',
      distance: 'metric',
      temperature: 'celsius'
    }
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Mock user data for components that need it
  const mockUser = user || {
    name: 'Daniele Pauli',
    avatar: 'DP',
    email: 'daniele@prometheus.com',
    location: 'Milan, Italy',
    joinDate: 'March 2024',
    stats: {
      workouts: 156,
      totalVolume: '45,670 kg',
      prs: 23,
      streak: 67
    }
  };

  // Handle user clicks for navigation to profile views
  const handleUserClick = (selectedUser) => {
    console.log('User clicked:', selectedUser);
    // Could navigate to user's profile or show user modal
    // For now, just log the action
  };

  // Render the appropriate component based on active section
  const renderContent = () => {
    switch (activeSection) {
      case 'campus':
        return <CampusSimple user={mockUser} />;
      case 'feed':
        return <FeedSimple user={mockUser} handleUserClick={handleUserClick} />;
      case 'profile':
        return <ProfileSimple user={mockUser} />;
      case 'challenges':
        return <ChallengesSimple user={mockUser} />;
      case 'learn':
        return <LearnSimple user={mockUser} />;
      case 'leaderboard':
        return <LeaderboardSimple user={mockUser} />;
      case 'events':
        return <EventsSimple user={mockUser} />;
      case 'messages':
        return <MessagesSimple user={mockUser} />;
      case 'settings':
        return <SettingsSimple user={mockUser} settings={settings} updateSettings={updateSettings} />;
      default:
        return <CampusSimple user={mockUser} />; // Default to Campus
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top Navigation */}
      <div className="bg-gray-900 border-b border-gray-800 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center">
              <div className="bg-orange-500 text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-2">
                ⚡
              </div>
              <span className="text-white font-bold text-lg">Prometheus</span>
              <span className="text-orange-500 font-medium text-sm ml-2">COMMUNITY</span>
            </div>
            
            <nav className="flex items-center space-x-6">
              <button 
                onClick={() => setActiveSection('campus')}
                className={`flex items-center px-3 py-1 rounded-lg ${
                  activeSection === 'campus' 
                    ? 'text-orange-500 bg-orange-500/10' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="mr-2">🏛️</span>Campus
              </button>
              <button 
                onClick={() => setActiveSection('feed')}
                className={`flex items-center px-3 py-1 rounded-lg ${
                  activeSection === 'feed' 
                    ? 'text-orange-500 bg-orange-500/10' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="mr-2">🏠</span>Feed
              </button>
              <button 
                onClick={() => setActiveSection('challenges')}
                className={`flex items-center px-3 py-1 rounded-lg ${
                  activeSection === 'challenges' 
                    ? 'text-orange-500 bg-orange-500/10' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="mr-2">🎯</span>Challenges
              </button>
              <button 
                onClick={() => setActiveSection('learn')}
                className={`flex items-center px-3 py-1 rounded-lg ${
                  activeSection === 'learn' 
                    ? 'text-orange-500 bg-orange-500/10' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="mr-2">📚</span>Learn
              </button>
              <button 
                onClick={() => setActiveSection('leaderboard')}
                className={`flex items-center px-3 py-1 rounded-lg ${
                  activeSection === 'leaderboard' 
                    ? 'text-orange-500 bg-orange-500/10' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="mr-2">🏆</span>Leaderboard
              </button>
              <button 
                onClick={() => setActiveSection('events')}
                className={`flex items-center px-3 py-1 rounded-lg ${
                  activeSection === 'events' 
                    ? 'text-orange-500 bg-orange-500/10' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className="mr-2">📅</span>Events
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
              Join Beta
            </button>
            <button
              onClick={onLogout}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Sidebar - User Profile */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 p-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {mockUser.avatar}
            </div>
            <h2 className="text-white font-bold text-lg">{mockUser.name}</h2>
            <p className="text-gray-400 text-sm">IPF World Champion</p>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => setActiveSection('campus')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${
                activeSection === 'campus' 
                  ? 'text-white bg-orange-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">🏛️</span>Prometheus Campus
            </button>
            <button 
              onClick={() => setActiveSection('feed')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${
                activeSection === 'feed' 
                  ? 'text-white bg-orange-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">🏠</span>My Feed
            </button>
            <button 
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${
                activeSection === 'profile' 
                  ? 'text-white bg-orange-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">👤</span>My Profile
            </button>
            <button 
              onClick={() => setActiveSection('challenges')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${
                activeSection === 'challenges' 
                  ? 'text-white bg-orange-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">🎯</span>My Challenges
            </button>
            <button 
              onClick={() => setActiveSection('learn')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${
                activeSection === 'learn' 
                  ? 'text-white bg-orange-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">📚</span>Learning
            </button>
            <button 
              onClick={() => setActiveSection('leaderboard')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${
                activeSection === 'leaderboard' 
                  ? 'text-white bg-orange-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">🏆</span>Leaderboard
            </button>
            <button 
              onClick={() => setActiveSection('events')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${
                activeSection === 'events' 
                  ? 'text-white bg-orange-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">📅</span>Events
            </button>
            <button 
              onClick={() => setActiveSection('messages')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${
                activeSection === 'messages' 
                  ? 'text-white bg-orange-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">💬</span>Messages
            </button>
            <button 
              onClick={() => setActiveSection('settings')}
              className={`w-full flex items-center px-4 py-3 rounded-lg ${
                activeSection === 'settings' 
                  ? 'text-white bg-orange-500' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <span className="mr-3">⚙️</span>Settings
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center text-xl shadow-lg transition-colors">
        +
      </button>
    </div>
  );
};

export default ModularDashboard;
