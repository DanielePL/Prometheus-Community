// client/src/components/dashboard/CampusSimple.js
import React, { useState, useEffect } from 'react';
import PrometheusCalendar from './PrometheusCalendar';

const CampusSimple = ({ user }) => {
  const [activeTrack, setActiveTrack] = useState('overview');
  const [timeToNextEvent, setTimeToNextEvent] = useState('');

  // Countdown timer for next event
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(20, 0, 0, 0); // 8 PM tomorrow
      
      const timeDiff = tomorrow - now;
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeToNextEvent(`${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Campus tracks based on user's subscription level
  const campusTracks = [
    {
      id: 'academy',
      title: 'Academy',
      subtitle: 'Rev 1 - Elite Users',
      description: 'Master elite performance techniques',
      icon: '🎯',
      color: 'from-blue-500 to-blue-600',
      level: 'Elite Athlete',
      nextCall: 'TUT Masterclass - Tomorrow 8PM',
      participants: 2847
    },
    {
      id: 'coachlab',
      title: 'Coach Lab', 
      subtitle: 'Rev 2 - Coaches',
      description: 'Build your 6-figure coaching brand',
      icon: '🎓',
      color: 'from-green-500 to-green-600',
      level: 'Coach',
      nextCall: 'Video Analysis in 3 Min - Friday 7PM',
      participants: 892
    },
    {
      id: 'leadership',
      title: 'Leadership Forum',
      subtitle: 'Rev 3 - B2B/Organizations', 
      description: 'Scale coaching systems across teams',
      icon: '👑',
      color: 'from-purple-500 to-purple-600',
      level: 'Organization Leader',
      nextCall: 'Team Performance Systems - Next Week',
      participants: 156
    },
    {
      id: 'builder',
      title: 'Business Builder',
      subtitle: 'Referral Circle',
      description: 'Create income through Prometheus',
      icon: '💰',
      color: 'from-orange-500 to-orange-600',
      level: 'Entrepreneur',
      nextCall: 'Content Creation Workshop - Monday 6PM',
      participants: 1243
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Campus Town Hall',
      type: 'Core Call',
      date: 'Tomorrow',
      time: '8:00 PM',
      speaker: 'CEO + Product Team',
      topic: 'Q3 Platform Updates & AI Coach 2.0',
      attendees: 3500,
      track: 'all',
      start: new Date(2025, 5, 26, 20, 0),
      end: new Date(2025, 5, 26, 21, 0),
      color: '#f97316'
    },
    {
      id: 2,
      title: 'TUT Deep Dive',
      type: 'Academy Masterclass',
      date: 'Friday',
      time: '7:00 PM',
      speaker: 'Sjoerd van den Berg',
      topic: 'Time Under Tension for Hypertrophy',
      attendees: 890,
      track: 'academy',
      start: new Date(2025, 5, 27, 19, 0),
      end: new Date(2025, 5, 27, 20, 30),
      color: '#3b82f6'
    },
    {
      id: 3,
      title: 'Video Analysis Mastery',
      type: 'Coach Workshop',
      date: 'Monday',
      time: '6:00 PM', 
      speaker: 'Elite Coach Panel',
      topic: 'Analyze form in 3 minutes or less',
      attendees: 450,
      track: 'coachlab',
      start: new Date(2025, 5, 30, 18, 0),
      end: new Date(2025, 5, 30, 19, 30),
      color: '#10b981'
    }
  ];

  const monthlyStats = {
    callsAttended: 4,
    totalCalls: 6,
    campusPoints: 1250,
    rank: 89,
    streak: 3
  };

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
              <div className="text-orange-500 text-2xl font-bold">{monthlyStats.campusPoints}</div>
              <div className="text-gray-300 text-sm">Campus Points</div>
              <div className="text-gray-400 text-xs mt-1">Rank #{monthlyStats.rank}</div>
            </div>
          </div>
        </div>

        {/* Monthly Progress */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="text-orange-500 text-2xl font-bold">{monthlyStats.callsAttended}/{monthlyStats.totalCalls}</div>
            <div className="text-gray-300 text-sm">Calls This Month</div>
            <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className="bg-orange-500 h-2 rounded-full" 
                style={{ width: `${(monthlyStats.callsAttended / monthlyStats.totalCalls) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="text-orange-500 text-2xl font-bold">{monthlyStats.streak}</div>
            <div className="text-gray-300 text-sm">Month Streak</div>
            <div className="text-green-400 text-xs mt-1">🔥 On fire!</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="text-orange-500 text-2xl font-bold">VIP</div>
            <div className="text-gray-300 text-sm">Member Status</div>
            <div className="text-purple-400 text-xs mt-1">👑 Elite Access</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-colors cursor-pointer">
            <div className="text-orange-500 text-2xl font-bold">Q3</div>
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
            <PrometheusCalendar user={user} />
          </div>
        )}

        {activeTrack === 'overview' && (
          <div className="space-y-6">
            {/* Next Campus Event */}
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse">
                      🔴 LIVE IN {timeToNextEvent}
                    </span>
                    <span className="text-orange-500 font-semibold">Campus Town Hall</span>
                    <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                      3,847 registered
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Q3 Platform Updates & AI Coach 2.0</h3>
                  <p className="text-gray-300 mb-4">Tomorrow at 8:00 PM • CEO + Product Team</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span>🎥 Recorded for replay</span>
                    <span>•</span>
                    <span>💬 Live Q&A</span>
                    <span>•</span>
                    <span>📱 Mobile friendly</span>
                  </div>
                </div>
                <div className="flex flex-col space-y-3">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-bold">
                    🔔 Get Reminder
                  </button>
                  <button className="bg-gray-700 hover:bg-gray-600 text-gray-300 px-6 py-2 rounded-lg text-sm">
                    📅 Add to Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Campus Tracks Grid and Mini Calendar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Campus Tracks - Takes up 2 columns */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {campusTracks.map(track => (
                  <div key={track.id} className="bg-gray-700 rounded-xl p-6 hover:bg-gray-600 transition-colors cursor-pointer"
                       onClick={() => setActiveTrack(track.id)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${track.color} rounded-xl flex items-center justify-center text-2xl`}>
                        {track.icon}
                      </div>
                      <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-sm">
                        {track.participants.toLocaleString()} members
                      </span>
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

              {/* Quick Calendar Overview - Takes up 1 column */}
              <div className="lg:col-span-1">
                <div className="bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">
                      📅 This Week
                    </h3>
                    <button
                      onClick={() => setActiveTrack('calendar')}
                      className="text-orange-500 hover:text-orange-400 text-sm"
                    >
                      View Calendar →
                    </button>
                  </div>

                  <div className="space-y-3">
                    {upcomingEvents.slice(0, 3).map(event => (
                      <div key={event.id} className="bg-gray-800 p-3 rounded-lg">
                        <div className="flex items-center space-x-2 mb-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: event.color }}
                          />
                          <div className="text-white text-sm font-medium truncate">
                            {event.title}
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs">
                          {event.date} • {event.time}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTrack('calendar')}
                    className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm font-medium"
                  >
                    📅 Open Full Calendar
                  </button>
                </div>
              </div>
            </div>

            {/* Upcoming Campus Calendar */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">🗓️ This Week's Campus Events</h3>
                <button 
                  onClick={() => setActiveTrack('calendar')}
                  className="text-orange-500 hover:text-orange-400 text-sm"
                >
                  View Full Calendar →
                </button>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="text-orange-500 font-bold">{event.date}</div>
                          <div className="text-white font-semibold">{event.title}</div>
                          <span className="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs">
                            {event.type}
                          </span>
                          {event.track !== 'all' && (
                            <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs">
                              {event.track}
                            </span>
                          )}
                        </div>
                        <div className="text-gray-400 text-sm mb-1">
                          {event.time} • {event.speaker} • {event.topic}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>👥 {event.attendees.toLocaleString()} registered</span>
                          <span>🎥 Will be recorded</span>
                          <span>💬 Q&A included</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
                          Join
                        </button>
                        <button className="bg-gray-600 hover:bg-gray-500 text-gray-300 px-3 py-2 rounded-lg text-sm">
                          📅
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick Actions */}
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
          </div>
        )}

        {/* Individual Track Content */}
        {activeTrack !== 'overview' && (
          <div className="space-y-6">
            {(() => {
              const track = campusTracks.find(t => t.id === activeTrack);
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

                  {/* Track-specific content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-700 p-6 rounded-xl">
                      <h3 className="text-white font-bold mb-4">📚 Exclusive Resources</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Monthly Masterclass Replays</span>
                          <span className="text-orange-500">12 Videos</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Downloadable PDFs</span>
                          <span className="text-orange-500">24 Files</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Private Discussion Threads</span>
                          <span className="text-green-400">Active</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Expert Office Hours</span>
                          <span className="text-blue-400">Weekly</span>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm">
                        Browse Library
                      </button>
                    </div>

                    <div className="bg-gray-700 p-6 rounded-xl">
                      <h3 className="text-white font-bold mb-4">🏆 Track Leaderboard</h3>
                      <div className="space-y-2">
                        {[1,2,3,4,5].map(rank => (
                          <div key={rank} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className={`font-bold ${rank === 1 ? 'text-yellow-500' : rank === 2 ? 'text-gray-400' : rank === 3 ? 'text-orange-600' : 'text-orange-500'}`}>
                                #{rank}
                              </span>
                              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-sm">
                                {rank === 4 ? 'DP' : `E${rank}`}
                              </div>
                              <span className={`${rank === 4 ? 'text-orange-500 font-semibold' : 'text-gray-300'}`}>
                                {rank === 4 ? 'You' : `Elite Member ${rank}`}
                              </span>
                            </div>
                            <span className="text-orange-500">{1500 - rank * 100} pts</span>
                          </div>
                        ))}
                      </div>
                      <button className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-gray-300 py-2 rounded-lg text-sm">
                        View Full Rankings
                      </button>
                    </div>

                    <div className="bg-gray-700 p-6 rounded-xl">
                      <h3 className="text-white font-bold mb-4">📅 Next Sessions</h3>
                      <div className="space-y-3">
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-orange-500 text-sm font-medium">Tomorrow 8PM</div>
                          <div className="text-white font-medium">Advanced Technique Workshop</div>
                          <div className="text-gray-400 text-xs">45 min • Interactive</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-orange-500 text-sm font-medium">Friday 7PM</div>
                          <div className="text-white font-medium">Q&A with Experts</div>
                          <div className="text-gray-400 text-xs">30 min • Live chat</div>
                        </div>
                        <div className="bg-gray-800 p-3 rounded-lg">
                          <div className="text-orange-500 text-sm font-medium">Next Monday</div>
                          <div className="text-white font-medium">Monthly Challenge Launch</div>
                          <div className="text-gray-400 text-xs">60 min • All levels</div>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm">
                        Register for All
                      </button>
                    </div>
                  </div>

                  {/* Track Progress & Goals */}
                  <div className="mt-6 bg-gray-700 p-6 rounded-xl">
                    <h3 className="text-white font-bold mb-4">📈 Your Progress in {track.title}</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">67%</div>
                        <div className="text-gray-300 text-sm">Completion Rate</div>
                        <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '67%' }}></div>
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-500">12</div>
                        <div className="text-gray-300 text-sm">Sessions Attended</div>
                        <div className="text-green-400 text-xs mt-1">+3 this week</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-500">8</div>
                        <div className="text-gray-300 text-sm">Certifications</div>
                        <div className="text-blue-400 text-xs mt-1">2 pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-500">156</div>
                        <div className="text-gray-300 text-sm">Community Points</div>
                        <div className="text-purple-400 text-xs mt-1">Top 25%</div>
                      </div>
                    </div>
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
