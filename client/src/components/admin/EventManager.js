// client/src/components/admin/EventManager.js
import React, { useState, useEffect } from 'react';
import { useAsyncOperation } from '../../hooks/useApi';

const EventManager = ({ user }) => {
  const { apiCall, loading, error } = useAsyncOperation();
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    type: 'workshop',
    category: 'Academy',
    location: '',
    maxAttendees: 30,
    price: 0
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...');
      const response = await apiCall('/api/events', 'GET');
      console.log('Events fetch response:', response);
      
      if (response.success) {
        // Handle both possible response formats
        const eventsData = response.data.events || response.data || [];
        setEvents(eventsData);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  const handleAddEvent = async () => {
    try {
      const eventData = {
        ...newEvent,
        startDate: new Date(newEvent.startDate).toISOString(),
        endDate: new Date(newEvent.endDate).toISOString()
      };
      
      console.log('Creating event with data:', eventData);
      const response = await apiCall('/api/events', 'POST', eventData);
      console.log('Event creation response:', response);
      
      if (response.success) {
        // Handle both possible response formats
        const newEventData = response.data.event || response.data;
        setEvents([newEventData, ...events]);
        resetForm();
        alert('Event created successfully!');
      }
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Error creating event: ' + err.message);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : '',
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : '',
      type: event.type || 'workshop',
      category: event.category,
      location: event.location || '',
      maxAttendees: event.maxAttendees || 30,
      price: event.price || 0
    });
    setShowAddForm(true);
  };

  const handleUpdateEvent = async () => {
    try {
      const eventData = {
        ...newEvent,
        startDate: new Date(newEvent.startDate).toISOString(),
        endDate: new Date(newEvent.endDate).toISOString()
      };
      
      const response = await apiCall(`/api/events/${editingEvent._id}`, 'PUT', eventData);
      if (response.success) {
        setEvents(events.map(e => e._id === editingEvent._id ? response.data : e));
        resetForm();
      }
    } catch (err) {
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await apiCall(`/api/events/${eventId}`, 'DELETE');
        if (response.success) {
          setEvents(events.filter(e => e._id !== eventId));
        }
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  const resetForm = () => {
    setEditingEvent(null);
    setNewEvent({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      type: 'workshop',
      category: 'Academy',
      location: '',
      maxAttendees: 30,
      price: 0
    });
    setShowAddForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    
    if (now > endDate) return 'completed';
    if (now >= startDate && now <= endDate) return 'active';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Event Management</h2>
          <p className="text-gray-400 mt-1">Create and manage campus events, workshops, and training sessions</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
        >
          📅 Add New Event
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-orange-500">{events.length}</div>
          <div className="text-gray-400">Total Events</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-green-500">{events.filter(e => getEventStatus(e) === 'upcoming').length}</div>
          <div className="text-gray-400">Upcoming</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-blue-500">{events.filter(e => getEventStatus(e) === 'active').length}</div>
          <div className="text-gray-400">Active</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-gray-500">{events.filter(e => getEventStatus(e) === 'completed').length}</div>
          <div className="text-gray-400">Completed</div>
        </div>
      </div>

      {/* Add/Edit Event Form */}
      {showAddForm && (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingEvent ? 'Edit Event' : 'Add New Event'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Event Title</label>
              <input
                type="text"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                placeholder="Enter event title"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Event Type</label>
              <select
                value={newEvent.type}
                onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              >
                <option value="workshop">Workshop</option>
                <option value="seminar">Seminar</option>
                <option value="masterclass">Masterclass</option>
                <option value="town-hall">Town Hall</option>
                <option value="competition">Competition</option>
                <option value="social">Social Event</option>
                <option value="special">Special Event</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Event Category</label>
              <select
                value={newEvent.category}
                onChange={(e) => setNewEvent({...newEvent, category: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              >
                <option value="Core">Core</option>
                <option value="Academy">Academy</option>
                <option value="Coach Lab">Coach Lab</option>
                <option value="Leadership">Leadership</option>
                <option value="Business Builder">Business Builder</option>
                <option value="Special Event">Special Event</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Start Date & Time</label>
              <input
                type="datetime-local"
                value={newEvent.startDate}
                onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">End Date & Time</label>
              <input
                type="datetime-local"
                value={newEvent.endDate}
                onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Location</label>
              <input
                type="text"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                placeholder="Event location or 'Online'"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Max Attendees</label>
              <input
                type="number"
                value={newEvent.maxAttendees}
                onChange={(e) => setNewEvent({...newEvent, maxAttendees: parseInt(e.target.value)})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Price ($)</label>
              <input
                type="number"
                value={newEvent.price}
                onChange={(e) => setNewEvent({...newEvent, price: parseFloat(e.target.value)})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              value={newEvent.description}
              onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              rows="4"
              placeholder="Event description"
            />
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              onClick={editingEvent ? handleUpdateEvent : handleAddEvent}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingEvent(null);
                resetForm();
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">All Events</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Event</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Date & Time</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Location</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Registrations</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    Loading events...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-red-400">
                    Error loading events: {error}
                  </td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400">
                    No events found. Create your first event!
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-4 px-6">
                      <div>
                        <div className="text-white font-medium">{event.title}</div>
                        <div className="text-gray-400 text-sm">{event.organizer?.name || 'Unknown'}</div>
                        <div className="text-orange-500 text-sm">${event.price || 0}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white">{formatDate(event.startDate)}</div>
                      <div className="text-gray-400 text-sm">{formatDate(event.endDate)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white">{event.location || 'TBD'}</div>
                      <div className="text-gray-400 text-sm capitalize">{event.category}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white">{event.attendees?.length || 0}/{event.maxAttendees || 0}</div>
                      <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-orange-500 h-2 rounded-full" 
                          style={{ width: `${event.maxAttendees ? ((event.attendees?.length || 0) / event.maxAttendees) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        getEventStatus(event) === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                        getEventStatus(event) === 'active' ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {getEventStatus(event)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1 rounded text-sm transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event._id)}
                          className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventManager;
