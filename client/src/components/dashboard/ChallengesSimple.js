import React, { useState, useEffect } from 'react';

const ChallengesSimple = ({ user }) => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [joinedChallenges, setJoinedChallenges] = useState(new Set());

  // Fetch challenges from API
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/challenges', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setChallenges(data);
        
        // Set joined challenges
        const joined = new Set();
        data.forEach(challenge => {
          if (challenge.participants?.some(p => p._id === user?._id)) {
            joined.add(challenge._id);
          }
        });
        setJoinedChallenges(joined);
      } catch (err) {
        console.error('Error fetching challenges:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [user]);

  const handleJoinChallenge = async (challengeId) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setJoinedChallenges(prev => new Set([...prev, challengeId]));
        
        // Update challenges list
        setChallenges(prev => prev.map(challenge => 
          challenge._id === challengeId 
            ? { ...challenge, participants: [...(challenge.participants || []), user] }
            : challenge
        ));
      }
    } catch (err) {
      console.error('Error joining challenge:', err);
    }
  };

  const handleLeaveChallenge = async (challengeId) => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setJoinedChallenges(prev => {
          const newSet = new Set(prev);
          newSet.delete(challengeId);
          return newSet;
        });
        
        // Update challenges list
        setChallenges(prev => prev.map(challenge => 
          challenge._id === challengeId 
            ? { ...challenge, participants: challenge.participants?.filter(p => p._id !== user?._id) || [] }
            : challenge
        ));
      }
    } catch (err) {
      console.error('Error leaving challenge:', err);
    }
  };

  const filteredChallenges = challenges.filter(challenge => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'joined') return joinedChallenges.has(challenge._id);
    if (activeFilter === 'available') return !joinedChallenges.has(challenge._id);
    return challenge.category === activeFilter;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'strength': return '🏋️‍♂️';
      case 'endurance': return '🏃‍♂️';
      case 'flexibility': return '🧘‍♀️';
      case 'mobility': return '🤸‍♂️';
      case 'nutrition': return '🥗';
      case 'mindfulness': return '🧠';
      default: return '🎯';
    }
  };

  const formatDuration = (duration) => {
    if (typeof duration === 'number') {
      return `${duration} days`;
    }
    return duration;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400 mb-4">Error loading challenges: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Challenges</h2>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          Create Challenge
        </button>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {['all', 'joined', 'available', 'strength', 'endurance', 'flexibility', 'nutrition'].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeFilter === filter
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Challenge Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏆</span>
            <div>
              <p className="text-white font-semibold">{joinedChallenges.size}</p>
              <p className="text-gray-400 text-sm">Active Challenges</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎯</span>
            <div>
              <p className="text-white font-semibold">{challenges.length}</p>
              <p className="text-gray-400 text-sm">Total Available</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⭐</span>
            <div>
              <p className="text-white font-semibold">
                {challenges.reduce((acc, c) => acc + (c.participants?.length || 0), 0)}
              </p>
              <p className="text-gray-400 text-sm">Total Participants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      {filteredChallenges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {activeFilter === 'all' 
              ? 'No challenges available yet.' 
              : `No ${activeFilter} challenges found.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => (
            <div key={challenge._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              {/* Challenge Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCategoryIcon(challenge.category)}</span>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{challenge.title}</h3>
                    <p className="text-gray-400 text-sm capitalize">{challenge.category}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                  {challenge.difficulty}
                </span>
              </div>

              {/* Challenge Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{challenge.description}</p>

              {/* Challenge Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-xs">Duration</p>
                  <p className="text-white font-semibold">{formatDuration(challenge.duration)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Participants</p>
                  <p className="text-white font-semibold">{challenge.participants?.length || 0}</p>
                </div>
              </div>

              {/* Progress Bar (for joined challenges) */}
              {joinedChallenges.has(challenge._id) && challenge.progress !== undefined && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-white">{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="flex space-x-2">
                {joinedChallenges.has(challenge._id) ? (
                  <>
                    <button
                      onClick={() => handleLeaveChallenge(challenge._id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Leave Challenge
                    </button>
                    <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm">
                      View Progress
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleJoinChallenge(challenge._id)}
                    className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    Join Challenge
                  </button>
                )}
              </div>

              {/* Challenge Rewards */}
              {challenge.rewards && challenge.rewards.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-gray-400 text-xs mb-2">Rewards</p>
                  <div className="flex flex-wrap gap-1">
                    {challenge.rewards.map((reward, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChallengesSimple;
