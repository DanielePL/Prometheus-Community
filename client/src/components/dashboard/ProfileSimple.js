// client/src/components/dashboard/ProfileSimple.js
import React, { useState } from 'react';

const ProfileSimple = ({ user, selectedUser }) => {
  const profileUser = selectedUser || user;
  const isOwnProfile = !selectedUser || selectedUser.name === user?.name;

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
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
      <div className="bg-gray-800 rounded-xl min-h-[600px]">
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

        <div className="p-6 h-full">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">Personal Records</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">Squat</span>
                      <span className="text-orange-500 font-bold">180kg</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">Bench Press</span>
                      <span className="text-orange-500 font-bold">120kg</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">Deadlift</span>
                      <span className="text-orange-500 font-bold">220kg</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-600">
                      <span className="text-gray-300">Overhead Press</span>
                      <span className="text-orange-500 font-bold">85kg</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-300">Total (SBD)</span>
                      <span className="text-orange-500 font-bold">520kg</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 py-2">
                      <span className="text-orange-500 text-xl">🏋️</span>
                      <div>
                        <span className="text-gray-300 text-sm block">Completed Push workout</span>
                        <span className="text-gray-500 text-xs">2 hours ago</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 py-2">
                      <span className="text-orange-500 text-xl">🎯</span>
                      <div>
                        <span className="text-gray-300 text-sm block">Achieved monthly goal</span>
                        <span className="text-gray-500 text-xs">Yesterday</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 py-2">
                      <span className="text-orange-500 text-xl">📈</span>
                      <div>
                        <span className="text-gray-300 text-sm block">New PR in deadlift</span>
                        <span className="text-gray-500 text-xs">3 days ago</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 py-2">
                      <span className="text-orange-500 text-xl">🔥</span>
                      <div>
                        <span className="text-gray-300 text-sm block">67-day streak achieved</span>
                        <span className="text-gray-500 text-xs">1 week ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Profile Content */}
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-gray-700 p-6 rounded-lg">
                  <h3 className="text-white font-semibold mb-4">Training Summary</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">156</div>
                      <div className="text-gray-400 text-sm">Total Workouts</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">45,670kg</div>
                      <div className="text-gray-400 text-sm">Volume Lifted</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">23</div>
                      <div className="text-gray-400 text-sm">Personal Records</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-500">67</div>
                      <div className="text-gray-400 text-sm">Day Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'workouts' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <span className="text-6xl">💪</span>
                <h3 className="text-xl font-semibold text-white mt-4">Workout History</h3>
                <p className="text-gray-400 mt-2">Track and view all your training sessions</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="text-white font-medium">Push Day #{i}</h4>
                        <p className="text-gray-400 text-sm">{i} days ago • 90 minutes</p>
                      </div>
                      <div className="text-orange-500 font-bold">
                        {Math.floor(Math.random() * 5000) + 3000}kg volume
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <span className="text-6xl">🏆</span>
                <h3 className="text-xl font-semibold text-white mt-4">Achievements</h3>
                <p className="text-gray-400 mt-2">Unlock badges and celebrate milestones</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: '🥇', title: 'First PR', desc: 'Set your first personal record' },
                  { icon: '🔥', title: '30-Day Streak', desc: 'Train consistently for 30 days' },
                  { icon: '💪', title: 'Strong Lifter', desc: 'Deadlift 2x bodyweight' },
                  { icon: '⚡', title: 'Speed Demon', desc: 'Complete workout in 60 minutes' },
                  { icon: '🎯', title: 'Goal Crusher', desc: 'Achieve monthly training goal' },
                  { icon: '👑', title: 'Elite Status', desc: 'Join the top 10% of lifters' }
                ].map((achievement, i) => (
                  <div key={i} className="bg-gray-700 p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">{achievement.icon}</div>
                    <h4 className="text-white font-medium">{achievement.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{achievement.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <span className="text-6xl">📈</span>
                <h3 className="text-xl font-semibold text-white mt-4">Activity Feed</h3>
                <p className="text-gray-400 mt-2">See your training progress over time</p>
              </div>
              <div className="space-y-4">
                {[
                  { type: 'pr', icon: '🏆', text: 'New PR: Deadlift 220kg', time: '2 hours ago' },
                  { type: 'workout', icon: '💪', text: 'Completed Push Day workout', time: '1 day ago' },
                  { type: 'streak', icon: '🔥', text: 'Achieved 67-day training streak', time: '3 days ago' },
                  { type: 'goal', icon: '🎯', text: 'Monthly goal completed', time: '1 week ago' },
                  { type: 'badge', icon: '🏅', text: 'Earned "Strong Lifter" badge', time: '2 weeks ago' }
                ].map((activity, i) => (
                  <div key={i} className="bg-gray-700 p-4 rounded-lg flex items-center space-x-4">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-white">{activity.text}</p>
                      <p className="text-gray-400 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSimple;
