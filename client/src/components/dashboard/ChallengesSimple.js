// client/src/components/dashboard/ChallengesSimple.js
import React, { useState } from 'react';

const ChallengesSimple = ({ user }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const challenges = [
    {
      id: 1,
      title: '30-Day Squat Challenge',
      description: 'Progressive squat program to build lower body strength',
      difficulty: 'Intermediate',
      duration: '30 days',
      participants: 1247,
      progress: 65,
      status: 'active',
      category: 'strength'
    },
    {
      id: 2,
      title: 'Morning Mobility',
      description: 'Daily 10-minute mobility routine for better movement',
      difficulty: 'Beginner',
      duration: '21 days',
      participants: 892,
      progress: 85,
      status: 'active',
      category: 'mobility'
    },
    {
      id: 3,
      title: 'Deadlift PR Challenge',
      description: 'Work towards your personal record in deadlift',
      difficulty: 'Advanced',
      duration: '8 weeks',
      participants: 543,
      progress: 0,
      status: 'available',
      category: 'strength'
    }
  ];

  const filteredChallenges = challenges.filter(challenge => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return challenge.status === 'active';
    if (activeFilter === 'available') return challenge.status === 'available';
    return challenge.category === activeFilter;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-500 bg-green-500/10';
      case 'Intermediate': return 'text-yellow-500 bg-yellow-500/10';
      case 'Advanced': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Challenges</h1>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
            Create Challenge
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">2</div>
            <div className="text-gray-300 text-sm">Active</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">8</div>
            <div className="text-gray-300 text-sm">Completed</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">75%</div>
            <div className="text-gray-300 text-sm">Success Rate</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">145</div>
            <div className="text-gray-300 text-sm">Points Earned</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All', icon: '📋' },
            { id: 'active', label: 'Active', icon: '🔥' },
            { id: 'available', label: 'Available', icon: '🎯' },
            { id: 'strength', label: 'Strength', icon: '💪' },
            { id: 'mobility', label: 'Mobility', icon: '🤸' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeFilter === filter.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredChallenges.map(challenge => (
          <div key={challenge.id} className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                {challenge.difficulty}
              </span>
            </div>
            
            <p className="text-gray-400 mb-4">{challenge.description}</p>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white">{challenge.duration}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Participants:</span>
                <span className="text-white">{challenge.participants.toLocaleString()}</span>
              </div>
            </div>

            {challenge.status === 'active' && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-orange-500">{challenge.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${challenge.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button 
              className={`w-full py-3 rounded-lg font-medium ${
                challenge.status === 'active'
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {challenge.status === 'active' ? 'Continue Challenge' : 'Join Challenge'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChallengesSimple;
