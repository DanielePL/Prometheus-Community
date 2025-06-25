// client/src/components/dashboard/EventsSimple.js
import React, { useState } from 'react';

const EventsSimple = ({ user }) => {
  const [activeView, setActiveView] = useState('upcoming');

  const events = {
    upcoming: [
      {
        id: 1,
        title: 'Summer Powerlifting Meet',
        date: '2024-07-15',
        time: '09:00',
        location: 'Milan Strength Center',
        type: 'competition',
        participants: 45,
        description: 'Local powerlifting competition for all levels',
        status: 'registered'
      },
      {
        id: 2,
        title: 'Mobility Workshop',
        date: '2024-07-08',
        time: '18:00',
        location: 'Community Gym',
        type: 'workshop',
        participants: 23,
        description: 'Learn essential mobility techniques',
        status: 'available'
      },
      {
        id: 3,
        title: 'Nutrition Seminar',
        date: '2024-07-12',
        time: '19:30',
        location: 'Online',
        type: 'seminar',
        participants: 87,
        description: 'Nutrition strategies for strength athletes',
        status: 'available'
      }
    ],
    past: [
      {
        id: 4,
        title: 'Spring Training Camp',
        date: '2024-06-01',
        time: '10:00',
        location: 'Training Center',
        type: 'training',
        participants: 32,
        description: 'Intensive 3-day training program',
        status: 'attended'
      }
    ]
  };

  const eventTypes = [
    { id: 'upcoming', label: 'Upcoming', icon: '📅' },
    { id: 'past', label: 'Past Events', icon: '📋' }
  ];

  const getEventTypeInfo = (type) => {
    switch (type) {
      case 'competition': return { color: 'text-red-500 bg-red-500/10', icon: '🏆' };
      case 'workshop': return { color: 'text-blue-500 bg-blue-500/10', icon: '🛠️' };
      case 'seminar': return { color: 'text-green-500 bg-green-500/10', icon: '🎓' };
      case 'training': return { color: 'text-orange-500 bg-orange-500/10', icon: '💪' };
      default: return { color: 'text-gray-500 bg-gray-500/10', icon: '📅' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Events</h1>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
            Create Event
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">2</div>
            <div className="text-gray-300 text-sm">Registered</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">5</div>
            <div className="text-gray-300 text-sm">Attended</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">3</div>
            <div className="text-gray-300 text-sm">This Month</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">155</div>
            <div className="text-gray-300 text-sm">Total Participants</div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex space-x-2">
          {eventTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setActiveView(type.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeView === type.id
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

      {/* Events List */}
      <div className="bg-gray-800 rounded-xl p-6 min-h-[600px]">
        <div className="space-y-4">
        {events[activeView].map(event => {
          const typeInfo = getEventTypeInfo(event.type);
          
          return (
            <div key={event.id} className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
                      {typeInfo.icon} {event.type}
                    </span>
                    {event.status === 'registered' && (
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Registered
                      </span>
                    )}
                    {event.status === 'attended' && (
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        ✓ Attended
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3">{event.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400 block">Date</span>
                      <span className="text-white">{formatDate(event.date)}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Time</span>
                      <span className="text-white">{event.time}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Location</span>
                      <span className="text-white">{event.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Participants</span>
                      <span className="text-white">{event.participants}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>📍 {event.location}</span>
                  <span>👥 {event.participants} going</span>
                </div>
                
                {activeView === 'upcoming' && (
                  <div className="flex space-x-3">
                    {event.status === 'available' && (
                      <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
                        Register
                      </button>
                    )}
                    {event.status === 'registered' && (
                      <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-medium">
                        View Details
                      </button>
                    )}
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium">
                      Share
                    </button>
                  </div>
                )}
                
                {activeView === 'past' && (
                  <div className="flex space-x-3">
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium">
                      View Photos
                    </button>
                    <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium">
                      Leave Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {events[activeView].length === 0 && (
        <div className="bg-gray-800 rounded-xl p-12 text-center">
          <span className="text-6xl">📅</span>
          <h3 className="text-xl font-semibold text-white mt-4">No Events Found</h3>
          <p className="text-gray-400 mt-2">
            {activeView === 'upcoming' 
              ? 'No upcoming events. Create one or check back later!'
              : 'No past events to show.'
            }
          </p>
        </div>
      )}
      </div>
    </div>
  );
};

export default EventsSimple;
