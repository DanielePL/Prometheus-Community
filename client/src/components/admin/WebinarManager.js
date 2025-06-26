// client/src/components/admin/WebinarManager.js
import React, { useState } from 'react';

const WebinarManager = ({ user }) => {
  const [webinars, setWebinars] = useState([
    {
      id: 1,
      title: 'Nutrition for Peak Performance',
      description: 'Learn how to fuel your training for maximum results',
      presenter: 'Dr. Sarah Chen',
      date: '2025-07-25',
      time: '19:00',
      duration: '90 minutes',
      platform: 'Zoom',
      capacity: 500,
      registered: 234,
      price: 29,
      status: 'scheduled',
      tags: ['nutrition', 'performance', 'science']
    },
    {
      id: 2,
      title: 'Mental Training for Athletes',
      description: 'Developing mental toughness and focus',
      presenter: 'Marcus Thompson',
      date: '2025-08-02',
      time: '18:00',
      duration: '60 minutes',
      platform: 'Zoom',
      capacity: 300,
      registered: 156,
      price: 19,
      status: 'scheduled',
      tags: ['mental', 'psychology', 'mindset']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Webinar Management</h2>
          <p className="text-gray-400 mt-1">Schedule and manage online webinars and educational sessions</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
        >
          💻 Schedule Webinar
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-orange-500">{webinars.length}</div>
          <div className="text-gray-400">Total Webinars</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-green-500">{webinars.filter(w => w.status === 'scheduled').length}</div>
          <div className="text-gray-400">Scheduled</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-blue-500">{webinars.reduce((sum, w) => sum + w.registered, 0)}</div>
          <div className="text-gray-400">Total Registrations</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-yellow-500">
            ${webinars.reduce((sum, w) => sum + (w.registered * w.price), 0).toLocaleString()}
          </div>
          <div className="text-gray-400">Revenue</div>
        </div>
      </div>

      {/* Webinars List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webinars.map((webinar) => (
          <div key={webinar.id} className="bg-gray-900/60 rounded-xl border border-gray-800 p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white">{webinar.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                webinar.status === 'scheduled' 
                  ? 'bg-green-500/20 text-green-400' 
                  : 'bg-gray-500/20 text-gray-400'
              }`}>
                {webinar.status}
              </span>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">{webinar.description}</p>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Presenter:</span>
                <span className="text-white">{webinar.presenter}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Date:</span>
                <span className="text-white">{webinar.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span className="text-white">{webinar.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{webinar.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Price:</span>
                <span className="text-orange-500 font-semibold">${webinar.price}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Registrations</span>
                <span className="text-white">{webinar.registered}/{webinar.capacity}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${(webinar.registered / webinar.capacity) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button className="flex-1 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 py-2 rounded transition-colors text-sm">
                Edit
              </button>
              <button className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 py-2 rounded transition-colors text-sm">
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WebinarManager;
