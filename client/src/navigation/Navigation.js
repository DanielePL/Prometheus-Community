/* client/src/components/navigation/Navigation.js */
import React, { useState } from 'react';
import { Bell, Search, Settings } from 'lucide-react';

const Navigation = ({ user, onLogout, onNavigate, activeSection = 'feed' }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const navigationItems = [
    { id: 'feed', label: 'Feed', emoji: '🏠', active: activeSection === 'feed' },
    { id: 'challenges', label: 'Challenges', emoji: '🎯', active: activeSection === 'challenges' },
    { id: 'learn', label: 'Learn', emoji: '📚', active: activeSection === 'learn' },
    { id: 'leaderboard', label: 'Leaderboard', emoji: '🏆', active: activeSection === 'leaderboard' },
    { id: 'events', label: 'Events', emoji: '📅', active: activeSection === 'events' }
  ];

  const handleNavClick = (sectionId) => {
    if (onNavigate) {
      onNavigate(sectionId);
    }
  };

  return (
    <nav className="bg-prometheus-dark-card border-b border-prometheus-gray-medium px-6 py-3 animate-slide-in-left">
      <div className="flex items-center justify-between">
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center">
            <div className="bg-prometheus-orange text-prometheus-text-white w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mr-2 glow-orange">
              ⚡
            </div>
            <span className="text-prometheus-text-white font-bold text-lg">Prometheus</span>
            <span className="text-prometheus-orange font-medium text-sm ml-2 pulse-dot">COMMUNITY</span>
          </div>
          
          {/* Main Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link ${item.active ? 'active' : ''}`}
              >
                <span className="mr-2">{item.emoji}</span>
                {item.label}
              </button>
            ))}
          </div>
        </div>
        
        {/* Right Section - Search, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Search Button */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 text-prometheus-text-muted hover:text-prometheus-text-white hover:bg-prometheus-gray-medium rounded-lg transition-all duration-200"
            title="Search"
          >
            <Search size={20} />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-prometheus-text-muted hover:text-prometheus-text-white hover:bg-prometheus-gray-medium rounded-lg transition-all duration-200 relative"
              title="Notifications"
            >
              <Bell size={20} />
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-prometheus-orange text-white text-xs rounded-full flex items-center justify-center font-bold">
                3
              </div>
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-prometheus-dark-card border border-prometheus-gray-medium rounded-lg shadow-lg z-50 animate-fade-in-up">
                <div className="p-4 border-b border-prometheus-gray-medium">
                  <h3 className="text-prometheus-text-white font-semibold">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 hover:bg-prometheus-gray-dark cursor-pointer border-b border-prometheus-gray-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-prometheus-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        MJ
                      </div>
                      <div>
                        <p className="text-prometheus-text-white text-sm">
                          <strong>Mike Johnson</strong> liked your PR post
                        </p>
                        <p className="text-prometheus-text-muted text-xs">2 minutes ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-prometheus-gray-dark cursor-pointer border-b border-prometheus-gray-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-prometheus-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        🏆
                      </div>
                      <div>
                        <p className="text-prometheus-text-white text-sm">
                          You're now #2 on the weekly leaderboard!
                        </p>
                        <p className="text-prometheus-text-muted text-xs">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 hover:bg-prometheus-gray-dark cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-prometheus-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                        📅
                      </div>
                      <div>
                        <p className="text-prometheus-text-white text-sm">
                          VBT Masterclass starts in 1 hour
                        </p>
                        <p className="text-prometheus-text-muted text-xs">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-prometheus-gray-medium">
                  <button className="w-full text-prometheus-orange hover:text-prometheus-orange-light text-sm font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Info */}
          <div className="hidden lg:flex items-center space-x-3">
            <span className="text-prometheus-text-muted text-sm">Welcome back,</span>
            <span className="text-prometheus-text-white font-medium">{user?.name}</span>
          </div>

          {/* User Avatar */}
          <div className="relative">
            <div className="avatar w-8 h-8 cursor-pointer" title="Profile Menu">
              {user?.avatar}
            </div>
          </div>

          {/* Join Beta Button */}
          <button className="btn-primary hidden sm:block">
            Join Beta
          </button>

          {/* Settings */}
          <button
            className="p-2 text-prometheus-text-muted hover:text-prometheus-text-white hover:bg-prometheus-gray-medium rounded-lg transition-all duration-200"
            title="Settings"
          >
            <Settings size={20} />
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="btn-secondary text-sm py-2 px-3"
            title="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar (Expandable) */}
      {showSearch && (
        <div className="mt-4 animate-fade-in-up">
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search athletes, posts, challenges..."
              className="input-field w-full"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <div className="md:hidden mt-4 flex justify-center space-x-1 bg-prometheus-gray-dark p-1 rounded-lg">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-md transition-colors text-xs font-medium ${
              item.active
                ? 'bg-prometheus-orange text-white'
                : 'text-prometheus-text-muted hover:text-white'
            }`}
          >
            <span className="text-lg mb-1">{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showSearch) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowSearch(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navigation;