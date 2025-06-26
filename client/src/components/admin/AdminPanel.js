// client/src/components/admin/AdminPanel.js
import React, { useState } from 'react';
import EventManager from './EventManager';
import ClassManager from './ClassManager';
import WebinarManager from './WebinarManager';
import UserManager from './UserManager';
import ContentManager from './ContentManager';
import AnalyticsDashboard from './AnalyticsDashboard';

const AdminPanel = ({ user, onBack }) => {
  const [activeTab, setActiveTab] = useState('events');

  const adminTabs = [
    { id: 'events', label: 'Events', icon: '📅', component: EventManager },
    { id: 'classes', label: 'Classes', icon: '🏫', component: ClassManager },
    { id: 'webinars', label: 'Webinars', icon: '💻', component: WebinarManager },
    { id: 'content', label: 'Content', icon: '📝', component: ContentManager },
    { id: 'users', label: 'Users', icon: '👥', component: UserManager },
    { id: 'analytics', label: 'Analytics', icon: '📊', component: AnalyticsDashboard }
  ];

  const ActiveComponent = adminTabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <div className="bg-gray-900/90 backdrop-blur-sm border-b border-orange-500/30 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors"
            >
              ← Back to Dashboard
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">
                ⚡
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Prometheus Admin Panel</h1>
                <p className="text-gray-400">Manage your community content</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-white font-semibold">{user?.firstName} {user?.lastName}</div>
              <div className="text-orange-500 text-sm">Administrator</div>
            </div>
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="bg-gray-900/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {adminTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Admin Content */}
      <div className="max-w-7xl mx-auto p-6">
        {ActiveComponent && <ActiveComponent user={user} />}
      </div>
    </div>
  );
};

export default AdminPanel;
