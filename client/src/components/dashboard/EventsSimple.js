import React, { useState, useEffect } from 'react';

const EventsSimple = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeView, setActiveView] = useState('upcoming');
  const [registeredEvents, setRegisteredEvents] = useState(new Set());

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data);
        
        // Set registered events
        const registered = new Set();
        data.forEach(event => {
          if (event.registrations?.some(r => r.user === user?._id)) {
            registered.add(event._id);
          }
        });
        setRegisteredEvents(registered);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  const handleRegister = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setRegisteredEvents(prev => new Set([...prev, eventId]));
        
        // Update events list
        setEvents(prev => prev.map(event =>
          event._id === eventId
            ? { ...event, registrations: [...(event.registrations || []), { user: user._id }] }
            : event
        ));
      }
    } catch (err) {
      console.error('Error registering for event:', err);
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      const response = await fetch(`/api/events/${eventId}/unregister`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setRegisteredEvents(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
        
        // Update events list
        setEvents(prev => prev.map(event =>
          event._id === eventId
            ? { ...event, registrations: event.registrations?.filter(r => r.user !== user._id) || [] }
            : event
        ));
      }
    } catch (err) {
      console.error('Error unregistering from event:', err);
    }
  };

  const filterEvents = () => {
    const now = new Date();
    return events.filter(event => {
      const eventDate = new Date(event.date);
      if (activeView === 'upcoming') {
        return eventDate >= now;
      } else if (activeView === 'past') {
        return eventDate < now;
      } else if (activeView === 'registered') {
        return registeredEvents.has(event._id);
      }
      return true;
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getEventTypeIcon = (type) => {
    switch(type) {
      case 'competition': return '🏆';
      case 'workshop': return '🛠️';
      case 'seminar': return '📚';
      case 'training': return '🏋️‍♂️';
      case 'social': return '🎉';
      default: return '📅';
    }
  };

  const getEventTypeColor = (type) => {
    switch(type) {
      case 'competition': return 'text-yellow-400 bg-yellow-400/20';
      case 'workshop': return 'text-blue-400 bg-blue-400/20';
      case 'seminar': return 'text-green-400 bg-green-400/20';
      case 'training': return 'text-orange-400 bg-orange-400/20';
      case 'social': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
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
        <p className="text-red-400 mb-4">Error loading events: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const filteredEvents = filterEvents();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Events</h2>
        <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
          Create Event
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2">
        {['upcoming', 'past', 'registered'].map((view) => (
          <button
            key={view}
            onClick={() => setActiveView(view)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeView === view
                ? 'bg-orange-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {view} ({events.filter(e => {
              const eventDate = new Date(e.date);
              const now = new Date();
              if (view === 'upcoming') return eventDate >= now;
              if (view === 'past') return eventDate < now;
              if (view === 'registered') return registeredEvents.has(e._id);
              return true;
            }).length})
          </button>
        ))}
      </div>

      {/* Events Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-white font-semibold">{events.filter(e => new Date(e.date) >= new Date()).length}</p>
              <p className="text-gray-400 text-sm">Upcoming Events</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-white font-semibold">{registeredEvents.size}</p>
              <p className="text-gray-400 text-sm">Registered</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">👥</span>
            <div>
              <p className="text-white font-semibold">
                {events.reduce((acc, e) => acc + (e.registrations?.length || 0), 0)}
              </p>
              <p className="text-gray-400 text-sm">Total Participants</p>
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {activeView === 'upcoming' 
              ? 'No upcoming events scheduled.' 
              : activeView === 'past' 
              ? 'No past events to show.' 
              : 'You are not registered for any events.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Event Header */}
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-2xl">{getEventTypeIcon(event.type)}</span>
                    <div>
                      <h3 className="text-white font-semibold text-lg">{event.title}</h3>
                      <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        <span>📍 {event.location}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Event Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-gray-400 text-sm">Date & Time</p>
                      <p className="text-white font-medium">
                        {formatDate(event.date)}
                        {event.time && ` at ${formatTime(event.time)}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Participants</p>
                      <p className="text-white font-medium">
                        {event.registrations?.length || 0}
                        {event.maxParticipants && ` / ${event.maxParticipants}`}
                      </p>
                    </div>
                  </div>

                  {/* Event Description */}
                  {event.description && (
                    <p className="text-gray-300 text-sm mb-4">{event.description}</p>
                  )}

                  {/* Event Tags */}
                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="ml-6 flex flex-col space-y-2">
                  {new Date(event.date) >= new Date() && (
                    <>
                      {registeredEvents.has(event._id) ? (
                        <button
                          onClick={() => handleUnregister(event._id)}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Unregister
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRegister(event._id)}
                          disabled={event.maxParticipants && event.registrations?.length >= event.maxParticipants}
                          className="px-4 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {event.maxParticipants && event.registrations?.length >= event.maxParticipants
                            ? 'Full'
                            : 'Register'
                          }
                        </button>
                      )}
                    </>
                  )}
                  
                  <button className="px-4 py-2 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors">
                    Details
                  </button>
                </div>
              </div>

              {/* Event Progress Bar (for events with limited capacity) */}
              {event.maxParticipants && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Capacity</span>
                    <span className="text-white">
                      {event.registrations?.length || 0} / {event.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min(100, ((event.registrations?.length || 0) / event.maxParticipants) * 100)}%` 
                      }}
                    ></div>
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

export default EventsSimple;
