// client/src/components/dashboard/Settings.js
import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Users, Bell, Shield, Globe } from 'lucide-react';

const Settings = ({ user, settings, updateSettings }) => {
  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="w-full px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-prometheus-text-muted text-lg">Customize your Prometheus experience</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <div className="p-6">
                <nav className="space-y-2">
                  {[
                    { id: 'profile', icon: Users, label: 'Profile' },
                    { id: 'notifications', icon: Bell, label: 'Notifications' },
                    { id: 'privacy', icon: Shield, label: 'Privacy' },
                    { id: 'units', icon: Globe, label: 'Units & Preferences' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-center px-4 py-3 text-prometheus-text-light hover:text-white hover:bg-prometheus-gray-medium rounded-lg transition-all text-left"
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="bg-prometheus-dark-lighter px-6 py-4 border-b border-prometheus-gray-medium">
                <h3 className="font-bold text-white text-lg flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Profile Settings
                </h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-prometheus-orange rounded-full flex items-center justify-center text-2xl font-bold text-white">
                    {user?.avatar}
                  </div>
                  <div className="flex-1">
                    <button className="btn-secondary mr-3">Change Avatar</button>
                    <button className="text-prometheus-text-muted hover:text-white transition-colors">Remove</button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-prometheus-text-light mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-4 py-3 bg-prometheus-gray-dark border border-prometheus-gray-medium rounded-lg text-white focus:outline-none focus:border-prometheus-orange"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-prometheus-text-light mb-2">Title</label>
                    <input
                      type="text"
                      defaultValue={user?.title}
                      className="w-full px-4 py-3 bg-prometheus-gray-dark border border-prometheus-gray-medium rounded-lg text-white focus:outline-none focus:border-prometheus-orange"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="bg-prometheus-dark-lighter px-6 py-4 border-b border-prometheus-gray-medium">
                <h3 className="font-bold text-white text-lg flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Notification Preferences
                </h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { key: 'achievements', label: 'Achievement Notifications' },
                  { key: 'challenges', label: 'Challenge Updates' },
                  { key: 'social', label: 'Social Notifications' },
                  { key: 'events', label: 'Event Reminders' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-3 border-b border-prometheus-gray-medium last:border-b-0">
                    <div className="flex-1">
                      <div className="text-white font-medium">{item.label}</div>
                    </div>
                    <button
                      onClick={() => updateSettings('notifications', item.key, !settings.notifications[item.key])}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        settings.notifications[item.key] ? 'bg-prometheus-orange' : 'bg-prometheus-gray-medium'
                      }`}
                    >
                      <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
                        settings.notifications[item.key] ? 'left-6' : 'left-0.5'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <button className="btn-secondary">Cancel</button>
              <button 
                className="btn-primary"
                onClick={handleSave}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;