// client/src/components/dashboard/LeaderboardSimple.js
import React, { useState } from 'react';

const LeaderboardSimple = ({ user }) => {
  const [activeLeaderboard, setActiveLeaderboard] = useState('total');

  const leaderboards = {
    total: [
      { rank: 1, name: 'Alex Chen', avatar: 'AC', points: 2847, badge: '👑', streak: 89 },
      { rank: 2, name: 'Sarah Johnson', avatar: 'SJ', points: 2691, badge: '🥈', streak: 76 },
      { rank: 3, name: 'Mike Rodriguez', avatar: 'MR', points: 2534, badge: '🥉', streak: 45 },
      { rank: 4, name: 'Emma Wilson', avatar: 'EW', points: 2398, badge: '', streak: 52 },
      { rank: 5, name: 'David Kim', avatar: 'DK', points: 2267, badge: '', streak: 38 },
      { rank: 12, name: 'Daniele Pauli', avatar: 'DP', points: 1847, badge: '', streak: 67, isCurrentUser: true }
    ],
    monthly: [
      { rank: 1, name: 'Emma Wilson', avatar: 'EW', points: 487, badge: '🔥', streak: 23 },
      { rank: 2, name: 'Alex Chen', avatar: 'AC', points: 423, badge: '💪', streak: 21 },
      { rank: 3, name: 'Sarah Johnson', avatar: 'SJ', points: 398, badge: '⚡', streak: 19 },
      { rank: 7, name: 'Daniele Pauli', avatar: 'DP', points: 267, badge: '', streak: 15, isCurrentUser: true }
    ],
    weekly: [
      { rank: 1, name: 'Mike Rodriguez', avatar: 'MR', points: 127, badge: '🚀', streak: 7 },
      { rank: 2, name: 'David Kim', avatar: 'DK', points: 98, badge: '💯', streak: 6 },
      { rank: 3, name: 'Emma Wilson', avatar: 'EW', points: 89, badge: '⭐', streak: 5 },
      { rank: 4, name: 'Daniele Pauli', avatar: 'DP', points: 76, badge: '', streak: 4, isCurrentUser: true }
    ]
  };

  const leaderboardTypes = [
    { id: 'total', label: 'All Time', icon: '🏆' },
    { id: 'monthly', label: 'This Month', icon: '📅' },
    { id: 'weekly', label: 'This Week', icon: '⚡' }
  ];

  const currentData = leaderboards[activeLeaderboard];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <div className="flex items-center space-x-2 text-gray-400">
            <span>🏃‍♂️</span>
            <span>Compete with the community</span>
          </div>
        </div>

        {/* User's Position Card */}
        {currentData.find(u => u.isCurrentUser) && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.avatar || 'DP'}
                </div>
                <div>
                  <h3 className="text-white font-semibold">Your Position</h3>
                  <p className="text-orange-400">Rank #{currentData.find(u => u.isCurrentUser)?.rank}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-orange-500">
                  {currentData.find(u => u.isCurrentUser)?.points} pts
                </div>
                <div className="text-orange-400 text-sm">
                  {currentData.find(u => u.isCurrentUser)?.streak} day streak
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Type Selector */}
        <div className="flex space-x-2">
          {leaderboardTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveLeaderboard(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeLeaderboard === type.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 text-center">Top Performers</h2>
        <div className="flex justify-center items-end space-x-8">
          {/* 2nd Place */}
          {currentData[1] && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                {currentData[1].avatar}
              </div>
              <div className="text-4xl mb-2">🥈</div>
              <h3 className="text-white font-semibold">{currentData[1].name}</h3>
              <p className="text-orange-500 font-bold">{currentData[1].points} pts</p>
            </div>
          )}

          {/* 1st Place */}
          {currentData[0] && (
            <div className="text-center transform scale-110">
              <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-2">
                {currentData[0].avatar}
              </div>
              <div className="text-5xl mb-2">👑</div>
              <h3 className="text-white font-semibold text-lg">{currentData[0].name}</h3>
              <p className="text-orange-500 font-bold text-lg">{currentData[0].points} pts</p>
            </div>
          )}

          {/* 3rd Place */}
          {currentData[2] && (
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                {currentData[2].avatar}
              </div>
              <div className="text-4xl mb-2">🥉</div>
              <h3 className="text-white font-semibold">{currentData[2].name}</h3>
              <p className="text-orange-500 font-bold">{currentData[2].points} pts</p>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-gray-800 rounded-xl">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Rankings</h2>
        </div>
        <div className="divide-y divide-gray-700">
          {currentData.map((user, index) => (
            <div 
              key={index}
              className={`p-4 flex items-center justify-between ${
                user.isCurrentUser ? 'bg-orange-500/5 border-l-4 border-orange-500' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <div className="w-8 text-center">
                  <span className={`font-bold ${
                    user.rank <= 3 ? 'text-orange-500' : 'text-gray-400'
                  }`}>
                    #{user.rank}
                  </span>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                  user.isCurrentUser ? 'bg-orange-500' : 'bg-gray-600'
                }`}>
                  {user.avatar}
                </div>
                <div>
                  <h3 className={`font-semibold ${
                    user.isCurrentUser ? 'text-orange-400' : 'text-white'
                  }`}>
                    {user.name}
                    {user.isCurrentUser && <span className="text-orange-500 ml-2">(You)</span>}
                  </h3>
                  <p className="text-gray-400 text-sm">{user.streak} day streak</p>
                </div>
                {user.badge && (
                  <span className="text-2xl">{user.badge}</span>
                )}
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  user.isCurrentUser ? 'text-orange-500' : 'text-white'
                }`}>
                  {user.points} pts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSimple;
