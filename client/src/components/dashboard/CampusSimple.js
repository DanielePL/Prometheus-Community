// client/src/components/dashboard/CampusSimple.js
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const CampusSimple = ({ user }) => {
  const [activeTrack, setActiveTrack] = useState('overview');
  const [campusTracks, setCampusTracks] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch campus data on component mount
  useEffect(() => {
    const fetchCampusData = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with real API calls when backend endpoints are ready
        // const [tracksResponse, eventsResponse, statsResponse] = await Promise.all([
        //   apiService.getCampusTracks(),
        //   apiService.getCampusEvents(),
        //   apiService.getCampusStats(user.id)
        // ]);
        
        // For now, set empty data structures
        setCampusTracks([]);
        setUpcomingEvents([]);
        setMonthlyStats({
          callsAttended: 0,
          totalCalls: 0,
          campusPoints: 0,
          rank: 0,
          streak: 0
        });
        
      } catch (err) {
        console.error('Error fetching campus data:', err);
        setError('Failed to load campus data');
      } finally {
        setLoading(false);
      }
    };

    fetchCampusData();
  }, [user.id]);

  // Loading state
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-2/3"></div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Campus</div>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Campus Header */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">🏛️ Prometheus Campus</h1>
            <p className="text-gray-300 text-lg">Where Elite Performance Meets Community Excellence</p>
          </div>
          <div className="text-right">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
              <div className="text-orange-500 text-2xl font-bold">{monthlyStats?.campusPoints || 0}</div>
              <div className="text-gray-300 text-sm">Campus Points</div>
              <div className="text-gray-400 text-xs mt-1">Rank #{monthlyStats?.rank || 0}</div>
            </div>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="text-orange-500 text-2xl font-bold">
              {monthlyStats?.callsAttended || 0}/{monthlyStats?.totalCalls || 0}
            </div>
            <div className="text-gray-300 text-sm">Calls This Month</div>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ 
                  width: monthlyStats?.totalCalls > 0 
                    ? `${(monthlyStats.callsAttended / monthlyStats.totalCalls) * 100}%` 
                    : '0%'
                }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="text-orange-500 text-2xl font-bold">{monthlyStats?.streak || 0}</div>
            <div className="text-gray-300 text-sm">Month Streak</div>
            <div className="text-green-400 text-xs mt-1">
              {monthlyStats?.streak > 0 ? '🔥 On fire!' : '💪 Get started!'}
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="text-orange-500 text-2xl font-bold">
              {user?.membershipType || 'Member'}
            </div>
            <div className="text-gray-300 text-sm">Member Status</div>
            <div className="text-purple-400 text-xs mt-1">👑 Elite Access</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="text-orange-500 text-2xl font-bold">
              {user?.ambassadorTrack || 'N/A'}
            </div>
            <div className="text-gray-300 text-sm">Ambassador Track</div>
            <div className="text-blue-400 text-xs mt-1">📈 Growing</div>
          </div>
        </div>

        {/* Track Navigation */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTrack('overview')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTrack === 'overview'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            🏛️ Campus Overview
          </button>
          <button
            onClick={() => setActiveTrack('calendar')}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTrack === 'calendar'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            📅 Events Calendar
          </button>
          {campusTracks.map(track => (
            <button
              key={track.id}
              onClick={() => setActiveTrack(track.id)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTrack === track.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {track.icon} {track.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Campus Content */}
      <div className="bg-gray-800 rounded-xl p-6 min-h-[700px]">
        {activeTrack === 'calendar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-white">📅 Campus Events Calendar</h2>
                <p className="text-gray-300 mt-2">Complete schedule of all Campus activities, workshops, and special events</p>
              </div>
              <div className="flex space-x-3">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
                  📥 Export Calendar
                </button>
                <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium">
                  🔔 Notification Settings
                </button>
              </div>
            </div>
            {/* TODO: Replace with real calendar component when ready */}
            <div className="bg-gray-700 rounded-xl p-8 text-center">
              <div className="text-gray-400 text-lg mb-4">📅 Calendar Coming Soon</div>
              <p className="text-gray-500">Campus events calendar will be integrated here</p>
            </div>
          </div>
        )}

        {activeTrack === 'overview' && (
          <div className="space-y-6">
            {/* Empty state for upcoming events */}
            {upcomingEvents.length === 0 ? (
              <div className="bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                <div className="text-gray-400 text-xl mb-4">📅 No Upcoming Campus Events</div>
                <p className="text-gray-500 mb-4">Campus events will appear here when scheduled</p>
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg">
                  Browse All Events
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
                {/* Event details will be populated when events are available */}
              </div>
            )}

            {/* Empty state for campus tracks */}
            {campusTracks.length === 0 ? (
              <div className="bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                <div className="text-gray-400 text-xl mb-4">🎯 No Campus Tracks Available</div>
                <p className="text-gray-500 mb-4">Campus learning tracks will be displayed here</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                  {/* Placeholder track cards */}
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600">
                      <div className="w-12 h-12 bg-gray-600 rounded-xl mb-3"></div>
                      <div className="h-4 bg-gray-600 rounded mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded mb-4"></div>
                      <div className="h-8 bg-gray-600 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {campusTracks.map(track => (
                  <div key={track.id} className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-colors cursor-pointer"
                       onClick={() => setActiveTrack(track.id)}>
                    <div className={`w-12 h-12 bg-gradient-to-r ${track.color} rounded-xl flex items-center justify-center text-2xl mb-4`}>
                      {track.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{track.title}</h3>
                    <p className="text-orange-500 text-sm mb-2">{track.subtitle}</p>
                    <p className="text-gray-300 mb-4">{track.description}</p>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-xs mb-1">Next Call:</div>
                      <div className="text-white text-sm font-medium">{track.nextCall}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Actions - Always show these */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
                <div className="text-lg mb-1">🎯</div>
                <div className="font-medium">Set Goals</div>
                <div className="text-xs opacity-80">Monthly objectives</div>
              </button>
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all">
                <div className="text-lg mb-1">🤝</div>
                <div className="font-medium">Find Mentor</div>
                <div className="text-xs opacity-80">Connect with experts</div>
              </button>
              <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all">
                <div className="text-lg mb-1">🎁</div>
                <div className="font-medium">Refer Friends</div>
                <div className="text-xs opacity-80">Earn rewards</div>
              </button>
            </div>
          </div>
        )}

        {/* Individual Track Content - Only show if track exists */}
        {activeTrack !== 'overview' && activeTrack !== 'calendar' && (
          <div className="space-y-6">
            {(() => {
              const track = campusTracks.find(t => t.id === activeTrack);
              if (!track) {
                return (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-xl mb-4">🎯 Track Not Found</div>
                    <p className="text-gray-500 mb-4">The selected track is not available</p>
                    <button 
                      onClick={() => setActiveTrack('overview')}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
                    >
                      Back to Overview
                    </button>
                  </div>
                );
              }
              
              return (
                <div>
                  <div className="flex items-center space-x-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${track.color} rounded-xl flex items-center justify-center text-3xl`}>
                      {track.icon}
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">{track.title}</h2>
                      <p className="text-orange-500 text-lg">{track.subtitle}</p>
                      <p className="text-gray-300">{track.description}</p>
                    </div>
                  </div>
                  {/* Track content will be populated when data is available */}
                  <div className="bg-gray-700/50 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                    <div className="text-gray-400 text-lg mb-4">📚 Track Content Loading...</div>
                    <p className="text-gray-500">Track-specific content will be displayed here</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusSimple;
