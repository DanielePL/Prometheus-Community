// client/src/components/dashboard/CampusCalendar.js
import React, { useState, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import EventRegistration from './EventRegistration';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const CampusCalendar = ({ user }) => {
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistration, setShowRegistration] = useState(false);

  // Campus Events Data
  const campusEvents = useMemo(() => [
    // Campus Town Halls
    {
      id: 1,
      title: 'Campus Town Hall: Q3 Platform Updates',
      start: new Date(2025, 5, 26, 20, 0), // June 26, 8 PM
      end: new Date(2025, 5, 26, 21, 0),
      type: 'town-hall',
      track: 'all',
      speaker: 'CEO + Product Team',
      description: 'Major platform updates, AI Coach 2.0 announcement, and live Q&A',
      attendees: 3847,
      isLive: false,
      color: '#f97316', // orange
      category: 'Core'
    },
    {
      id: 2,
      title: 'Campus Town Hall: July Kickoff',
      start: new Date(2025, 6, 24, 20, 0), // July 24, 8 PM
      end: new Date(2025, 6, 24, 21, 0),
      type: 'town-hall',
      track: 'all',
      speaker: 'Sjoerd + Leadership Team',
      description: 'Monthly vision update and community highlights',
      attendees: 0,
      isLive: false,
      color: '#f97316',
      category: 'Core'
    },

    // Academy (Rev 1) - Elite Users
    {
      id: 3,
      title: 'TUT Deep Dive Masterclass',
      start: new Date(2025, 5, 27, 19, 0), // June 27, 7 PM
      end: new Date(2025, 5, 27, 20, 30),
      type: 'masterclass',
      track: 'academy',
      speaker: 'Sjoerd van den Berg',
      description: 'Time Under Tension for maximum hypertrophy gains',
      attendees: 892,
      isLive: false,
      color: '#3b82f6', // blue
      category: 'Academy'
    },
    {
      id: 4,
      title: 'ROM Optimization Workshop',
      start: new Date(2025, 6, 10, 19, 0), // July 10, 7 PM
      end: new Date(2025, 6, 10, 20, 30),
      type: 'masterclass',
      track: 'academy',
      speaker: 'Elite Performance Coach',
      description: 'Range of Motion techniques for elite performance',
      attendees: 0,
      isLive: false,
      color: '#3b82f6',
      category: 'Academy'
    },

    // Coach Lab (Rev 2) - Coaches
    {
      id: 5,
      title: 'Video Analysis in 3 Minutes',
      start: new Date(2025, 5, 30, 18, 0), // June 30, 6 PM
      end: new Date(2025, 5, 30, 19, 30),
      type: 'workshop',
      track: 'coachlab',
      speaker: 'Elite Coach Panel',
      description: 'Master the art of rapid form analysis for your clients',
      attendees: 445,
      isLive: false,
      color: '#10b981', // green
      category: 'Coach Lab'
    },
    {
      id: 6,
      title: 'Pricing Your Coaching Services',
      start: new Date(2025, 6, 8, 18, 0), // July 8, 6 PM
      end: new Date(2025, 6, 8, 19, 30),
      type: 'workshop',
      track: 'coachlab',
      speaker: 'Business Coach',
      description: 'How to price for profit and attract premium clients',
      attendees: 0,
      isLive: false,
      color: '#10b981',
      category: 'Coach Lab'
    },

    // Leadership Forum (Rev 3) - B2B/Organizations
    {
      id: 7,
      title: 'Team Performance Systems',
      start: new Date(2025, 6, 3, 17, 0), // July 3, 5 PM
      end: new Date(2025, 6, 3, 18, 30),
      type: 'forum',
      track: 'leadership',
      speaker: 'Performance Director',
      description: 'Scaling coaching systems across large organizations',
      attendees: 156,
      isLive: false,
      color: '#8b5cf6', // purple
      category: 'Leadership'
    },

    // Business Builder (Referral Circle)
    {
      id: 8,
      title: 'Content Creation Workshop',
      start: new Date(2025, 5, 29, 18, 0), // June 29, 6 PM
      end: new Date(2025, 5, 29, 19, 0),
      type: 'workshop',
      track: 'builder',
      speaker: 'Content Expert',
      description: 'Create engaging content that converts referrals',
      attendees: 1243,
      isLive: false,
      color: '#f59e0b', // amber
      category: 'Business Builder'
    },
    {
      id: 9,
      title: 'Referral Circle: July Leaderboard',
      start: new Date(2025, 6, 15, 18, 0), // July 15, 6 PM
      end: new Date(2025, 6, 15, 19, 0),
      type: 'circle',
      track: 'builder',
      speaker: 'Community Team',
      description: 'Monthly recognition and referral strategy sharing',
      attendees: 0,
      isLive: false,
      color: '#f59e0b',
      category: 'Business Builder'
    },

    // Special Events
    {
      id: 10,
      title: 'Guest Talk: Olympic Champion Mindset',
      start: new Date(2025, 6, 18, 19, 0), // July 18, 7 PM
      end: new Date(2025, 6, 18, 20, 30),
      type: 'special',
      track: 'all',
      speaker: 'Olympic Champion',
      description: 'Exclusive talk with Olympic gold medalist',
      attendees: 0,
      isLive: false,
      color: '#ef4444', // red
      category: 'Special Event'
    }
  ], []);

  // Custom event style getter
  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '6px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  // Handle event selection
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setShowRegistration(true);
  };

  const handleRegister = (event) => {
    console.log('Registered for event:', event);
    // In a real app, this would make an API call
  };

  // Custom toolbar
  const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white">{label}</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => onNavigate('PREV')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg"
            >
              ←
            </button>
            <button
              onClick={() => onNavigate('TODAY')}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg"
            >
              Today
            </button>
            <button
              onClick={() => onNavigate('NEXT')}
              className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg"
            >
              →
            </button>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {['month', 'week', 'day', 'agenda'].map(viewName => (
            <button
              key={viewName}
              onClick={() => onView(viewName)}
              className={`px-3 py-1 rounded-lg capitalize ${
                view === viewName
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
            >
              {viewName}
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Event Modal
  const EventModal = () => {
    if (!selectedEvent) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedEvent.color }}
                ></span>
                <span className="text-orange-500 text-sm font-medium">
                  {selectedEvent.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
            </div>
            <button
              onClick={() => setShowEventModal(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2 text-gray-300">
              <span>📅</span>
              <span>{moment(selectedEvent.start).format('MMMM Do, YYYY')}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <span>🕐</span>
              <span>
                {moment(selectedEvent.start).format('h:mm A')} - {moment(selectedEvent.end).format('h:mm A')}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <span>🎤</span>
              <span>{selectedEvent.speaker}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <span>👥</span>
              <span>{selectedEvent.attendees.toLocaleString()} registered</span>
            </div>
          </div>
          
          <p className="text-gray-400 mb-6">{selectedEvent.description}</p>
          
          <div className="flex space-x-3">
            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-medium">
              Register
            </button>
            <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium">
              Add to Calendar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Calendar Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-orange-500 text-2xl font-bold">18</div>
          <div className="text-gray-300 text-sm">Events This Month</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-green-500 text-2xl font-bold">6</div>
          <div className="text-gray-300 text-sm">Registered</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-blue-500 text-2xl font-bold">4</div>
          <div className="text-gray-300 text-sm">Attended</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-purple-500 text-2xl font-bold">89%</div>
          <div className="text-gray-300 text-sm">Attendance Rate</div>
        </div>
      </div>

      {/* Calendar Component */}
      <div className="bg-gray-800 rounded-xl p-6">
        <style>{`
          .rbc-calendar {
            background: transparent;
            color: white;
          }
          .rbc-header {
            background: #374151;
            color: white;
            border: none;
            padding: 12px 8px;
            font-weight: 600;
          }
          .rbc-month-view, .rbc-time-view {
            background: transparent;
            border: none;
          }
          .rbc-date-cell {
            color: #d1d5db;
            padding: 8px;
          }
          .rbc-date-cell.rbc-off-range {
            color: #6b7280;
          }
          .rbc-today {
            background: #f97316;
            color: white;
          }
          .rbc-month-row {
            border: none;
          }
          .rbc-day-bg {
            background: #1f2937;
            border: 1px solid #374151;
          }
          .rbc-day-bg.rbc-today {
            background: #f97316;
          }
          .rbc-off-range-bg {
            background: #111827;
          }
          .rbc-event {
            border-radius: 6px;
            padding: 2px 6px;
            font-size: 12px;
            font-weight: 500;
          }
          .rbc-slot-selection {
            background: #f97316;
          }
          .rbc-time-slot {
            border-top: 1px solid #374151;
            color: #d1d5db;
          }
          .rbc-time-header-content {
            color: white;
          }
          .rbc-time-content {
            border-top: 1px solid #374151;
          }
          .rbc-current-time-indicator {
            background: #f97316;
          }
          .rbc-agenda-view table {
            background: transparent;
          }
          .rbc-agenda-view .rbc-agenda-content {
            color: white;
          }
          .rbc-agenda-view .rbc-agenda-date-cell {
            background: #374151;
            color: white;
          }
          .rbc-agenda-view .rbc-agenda-time-cell {
            color: #9ca3af;
          }
        `}</style>
        
        <Calendar
          localizer={localizer}
          events={campusEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          view={view}
          onView={setView}
          date={date}
          onNavigate={setDate}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          components={{
            toolbar: CustomToolbar
          }}
        />
      </div>

      {/* Event Legend */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">Event Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Campus Town Hall</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Academy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Coach Lab</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Leadership</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
            <span className="text-gray-300 text-sm">Business Builder</span>
          </div>
        </div>
      </div>

      {/* Event Registration Modal */}
      {showRegistration && selectedEvent && (
        <EventRegistration
          event={selectedEvent}
          onClose={() => setShowRegistration(false)}
          onRegister={handleRegister}
        />
      )}

      {/* Original Event Modal (keeping as backup) */}
      {showEventModal && <EventModal />}
    </div>
  );
};

export default CampusCalendar;
