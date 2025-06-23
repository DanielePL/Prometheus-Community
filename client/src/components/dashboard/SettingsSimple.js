// client/src/components/dashboard/SettingsSimple.js
import React, { useState } from 'react';

const SettingsSimple = ({ user, settings, updateSettings }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [localSettings, setLocalSettings] = useState(settings);

  const sections = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'account', label: 'Account', icon: '🔐' }
  ];

  const handleSettingChange = (category, key, value) => {
    const newSettings = {
      ...localSettings,
      [category]: {
        ...localSettings[category],
        [key]: value
      }
    };
    setLocalSettings(newSettings);
    updateSettings(newSettings);
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
          {user?.avatar || 'U'}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{user?.name || 'User Name'}</h3>
          <p className="text-gray-400">{user?.email || 'user@email.com'}</p>
          <button className="mt-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm">
            Change Photo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 mb-2">Full Name</label>
          <input
            type="text"
            defaultValue={user?.name || ''}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Email</label>
          <input
            type="email"
            defaultValue={user?.email || ''}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Location</label>
          <input
            type="text"
            defaultValue={user?.location || ''}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 mb-2">Bio</label>
          <textarea
            rows="3"
            placeholder="Tell us about yourself..."
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email notifications', description: 'Receive notifications via email' },
            { key: 'training', label: 'Training reminders', description: 'Get reminders for your workouts' },
            { key: 'social', label: 'Social updates', description: 'Friend requests, mentions, and comments' }
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{item.label}</h4>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <button
                onClick={() => handleSettingChange('notifications', item.key, !localSettings.notifications[item.key])}
                className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
                  localSettings.notifications[item.key] ? 'bg-orange-500' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localSettings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  } mt-1`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Push Notifications</h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-white font-medium">Push notifications</h4>
            <p className="text-gray-400 text-sm">Receive push notifications on your device</p>
          </div>
          <button
            onClick={() => handleSettingChange('notifications', 'push', !localSettings.notifications.push)}
            className={`relative inline-flex h-6 w-11 rounded-full transition-colors ${
              localSettings.notifications.push ? 'bg-orange-500' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                localSettings.notifications.push ? 'translate-x-6' : 'translate-x-1'
              } mt-1`}
            />
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {[
        { key: 'profile', label: 'Profile visibility', description: 'Who can see your profile' },
        { key: 'workouts', label: 'Workout data', description: 'Who can see your workout history' },
        { key: 'achievements', label: 'Achievements', description: 'Who can see your achievements' }
      ].map(item => (
        <div key={item.key}>
          <h4 className="text-white font-medium mb-2">{item.label}</h4>
          <p className="text-gray-400 text-sm mb-3">{item.description}</p>
          <select
            value={localSettings.privacy[item.key]}
            onChange={(e) => handleSettingChange('privacy', item.key, e.target.value)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="public">Public</option>
            <option value="friends">Friends only</option>
            <option value="private">Private</option>
          </select>
        </div>
      ))}
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Units</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-300 mb-2">Weight</label>
            <select
              value={localSettings.units.weight}
              onChange={(e) => handleSettingChange('units', 'weight', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="kg">Kilograms (kg)</option>
              <option value="lbs">Pounds (lbs)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Distance</label>
            <select
              value={localSettings.units.distance}
              onChange={(e) => handleSettingChange('units', 'distance', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="metric">Metric (km)</option>
              <option value="imperial">Imperial (miles)</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Temperature</label>
            <select
              value={localSettings.units.temperature}
              onChange={(e) => handleSettingChange('units', 'temperature', e.target.value)}
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Password & Security</h3>
        <div className="space-y-4">
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-left">
            Change Password
          </button>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-left">
            Two-Factor Authentication
          </button>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-left">
            Login Sessions
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Data & Privacy</h3>
        <div className="space-y-4">
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-left">
            Download Your Data
          </button>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg text-left">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSettings();
      case 'notifications': return renderNotificationSettings();
      case 'privacy': return renderPrivacySettings();
      case 'preferences': return renderPreferences();
      case 'account': return renderAccountSettings();
      default: return renderProfileSettings();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Settings</h2>
            <nav className="space-y-2">
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left ${
                    activeSection === section.id
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">
                {sections.find(s => s.id === activeSection)?.label}
              </h1>
            </div>
            
            {renderContent()}

            <div className="mt-8 pt-6 border-t border-gray-700">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSimple;
