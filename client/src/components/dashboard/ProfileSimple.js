// client/src/components/dashboard/ProfileSimple.js
import React, { useState } from 'react';

const ProfileSimple = ({ user, selectedUser }) => {
  const profileUser = selectedUser || user;
  const isOwnProfile = !selectedUser || selectedUser.name === user?.name;

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {profileUser?.avatar || 'U'}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold text-white">{profileUser?.name || 'User Name'}</h1>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                IPF World Champion
              </span>
            </div>
            <p className="text-gray-400 mb-4">{profileUser?.location || 'Location'} • Joined {profileUser?.joinDate || 'Recently'}</p>
            
            <div className="grid grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{profileUser?.stats?.workouts || 156}</div>
                <div className="text-gray-400 text-sm">Workouts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{profileUser?.stats?.totalVolume || '45,670 kg'}</div>
                <div className="text-gray-400 text-sm">Total Volume</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{profileUser?.stats?.prs || 23}</div>
                <div className="text-gray-400 text-sm">Personal Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">{profileUser?.stats?.streak || 67}</div>
                <div className="text-gray-400 text-sm">Day Streak</div>
              </div>
            </div>
          </div>
          
          {isOwnProfile && (
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg">
              ⚙️ Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-800 rounded-xl">
        <div className="flex border-b border-gray-700">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'workouts', label: 'Workouts', icon: '💪' },
            { id: 'achievements', label: 'Achievements', icon: '🏆' },
            { id: 'activity', label: 'Activity', icon: '📈' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium ${
                activeTab === tab.id
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-3">Personal Records</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Squat</span>
                      <span className="text-orange-500 font-bold">180kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bench Press</span>
                      <span className="text-orange-500 font-bold">120kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Deadlift</span>
                      <span className="text-orange-500 font-bold">220kg</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-500">🏋️</span>
                      <span className="text-gray-300 text-sm">Completed Push workout</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-500">🎯</span>
                      <span className="text-gray-300 text-sm">Achieved monthly goal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-orange-500">📈</span>
                      <span className="text-gray-300 text-sm">New PR in deadlift</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="text-center py-8">
              <span className="text-6xl">💪</span>
              <h3 className="text-xl font-semibold text-white mt-4">Workout History</h3>
              <p className="text-gray-400 mt-2">Track and view all your training sessions</p>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="text-center py-8">
              <span className="text-6xl">🏆</span>
              <h3 className="text-xl font-semibold text-white mt-4">Achievements</h3>
              <p className="text-gray-400 mt-2">Unlock badges and celebrate milestones</p>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-8">
              <span className="text-6xl">📈</span>
              <h3 className="text-xl font-semibold text-white mt-4">Activity Feed</h3>
              <p className="text-gray-400 mt-2">See your training progress over time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSimple;
