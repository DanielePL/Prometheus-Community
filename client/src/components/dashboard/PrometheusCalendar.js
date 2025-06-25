// client/src/components/dashboard/PrometheusCalendar.js
import React, { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const PrometheusCalendar = ({ user }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const calendarRef = useRef(null);

  // Campus Events für das 12-Monats-Programm
  const campusEvents = [
    // Juni 2025
    {
      id: '1',
      title: 'Campus Town Hall: Q3 Updates',
      start: '2025-06-26T20:00:00',
      end: '2025-06-26T21:00:00',
      backgroundColor: '#f97316',
      borderColor: '#ea580c',
      extendedProps: {
        type: 'town-hall',
        speaker: 'CEO + Product Team',
        track: 'all',
        attendees: 3847,
        description: 'Q3 Platform Updates & AI Coach 2.0 announcement',
        category: 'Core'
      }
    },
    {
      id: '2',
      title: 'TUT Deep Dive Masterclass',
      start: '2025-06-27T19:00:00',
      end: '2025-06-27T20:30:00',
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      extendedProps: {
        type: 'masterclass',
        speaker: 'Sjoerd van den Berg',
        track: 'academy',
        attendees: 892,
        description: 'Time Under Tension for maximum hypertrophy',
        category: 'Academy'
      }
    },
    {
      id: '3',
      title: 'Video Analysis Workshop',
      start: '2025-06-30T18:00:00',
      end: '2025-06-30T19:30:00',
      backgroundColor: '#10b981',
      borderColor: '#059669',
      extendedProps: {
        type: 'workshop',
        speaker: 'Elite Coach Panel',
        track: 'coachlab',
        attendees: 445,
        description: 'Master form analysis in 3 minutes',
        category: 'Coach Lab'
      }
    },

    // Juli 2025
    {
      id: '4',
      title: 'Campus Town Hall: July Kickoff',
      start: '2025-07-24T20:00:00',
      end: '2025-07-24T21:00:00',
      backgroundColor: '#f97316',
      borderColor: '#ea580c',
      extendedProps: {
        type: 'town-hall',
        speaker: 'Sjoerd + Leadership',
        track: 'all',
        attendees: 0,
        description: 'Monthly vision update and community highlights',
        category: 'Core'
      }
    },
    {
      id: '5',
      title: 'ROM Optimization Workshop',
      start: '2025-07-10T19:00:00',
      end: '2025-07-10T20:30:00',
      backgroundColor: '#3b82f6',
      borderColor: '#2563eb',
      extendedProps: {
        type: 'masterclass',
        speaker: 'Elite Performance Coach',
        track: 'academy',
        attendees: 0,
        description: 'Range of Motion techniques for elite performance',
        category: 'Academy'
      }
    },
    {
      id: '6',
      title: 'Pricing Your Coaching Services',
      start: '2025-07-08T18:00:00',
      end: '2025-07-08T19:30:00',
      backgroundColor: '#10b981',
      borderColor: '#059669',
      extendedProps: {
        type: 'workshop',
        speaker: 'Business Coach',
        track: 'coachlab',
        attendees: 0,
        description: 'How to price for profit and attract premium clients',
        category: 'Coach Lab'
      }
    },
    {
      id: '7',
      title: 'Team Performance Systems',
      start: '2025-07-03T17:00:00',
      end: '2025-07-03T18:30:00',
      backgroundColor: '#8b5cf6',
      borderColor: '#7c3aed',
      extendedProps: {
        type: 'forum',
        speaker: 'Performance Director',
        track: 'leadership',
        attendees: 156,
        description: 'Scaling coaching systems across organizations',
        category: 'Leadership'
      }
    },
    {
      id: '8',
      title: 'Referral Circle: July Leaderboard',
      start: '2025-07-15T18:00:00',
      end: '2025-07-15T19:00:00',
      backgroundColor: '#f59e0b',
      borderColor: '#d97706',
      extendedProps: {
        type: 'circle',
        speaker: 'Community Team',
        track: 'builder',
        attendees: 0,
        description: 'Monthly recognition and referral strategy',
        category: 'Business Builder'
      }
    },

    // August 2025
    {
      id: '9',
      title: 'Guest Talk: Olympic Champion Mindset',
      start: '2025-08-18T19:00:00',
      end: '2025-08-18T20:30:00',
      backgroundColor: '#ef4444',
      borderColor: '#dc2626',
      extendedProps: {
        type: 'special',
        speaker: 'Olympic Champion',
        track: 'all',
        attendees: 0,
        description: 'Exclusive talk with Olympic gold medalist',
        category: 'Special Event'
      }
    },
    {
      id: '10',
      title: 'Campus Town Hall: August Updates',
      start: '2025-08-28T20:00:00',
      end: '2025-08-28T21:00:00',
      backgroundColor: '#f97316',
      borderColor: '#ea580c',
      extendedProps: {
        type: 'town-hall',
        speaker: 'CEO + Product Team',
        track: 'all',
        attendees: 0,
        description: 'Pre-launch final updates and community preparation',
        category: 'Core'
      }
    }
  ];

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setShowEventModal(true);
  };

  const handleDateSelect = (selectInfo) => {
    const title = prompt('Event Title:');
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: Date.now().toString(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
        backgroundColor: '#f97316',
        borderColor: '#ea580c'
      });
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const EventModal = () => {
    if (!selectedEvent) return null;

    const props = selectedEvent.extendedProps;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedEvent.backgroundColor }}
                />
                <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                  {props.category}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{selectedEvent.title}</h2>
            </div>
            <button
              onClick={() => setShowEventModal(false)}
              className="text-gray-400 hover:text-white p-2"
            >
              ✕
            </button>
          </div>

          {/* Event Details */}
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Datum & Zeit</div>
                <div className="text-white font-medium">
                  {formatDate(selectedEvent.start)}
                </div>
                <div className="text-orange-500">
                  {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                </div>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Speaker</div>
                <div className="text-white font-medium">{props.speaker}</div>
                <div className="text-gray-400 text-sm">Host</div>
              </div>
            </div>

            {props.description && (
              <div className="bg-gray-700 p-4 rounded-lg">
                <div className="text-gray-400 text-sm mb-1">Beschreibung</div>
                <div className="text-white">{props.description}</div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-orange-500 text-xl font-bold">
                  {props.attendees > 0 ? props.attendees.toLocaleString() : 'TBA'}
                </div>
                <div className="text-gray-400 text-sm">Angemeldet</div>
              </div>
              <div className="text-center">
                <div className="text-green-500 text-xl font-bold">
                  {Math.floor((new Date(selectedEvent.end) - new Date(selectedEvent.start)) / (1000 * 60))}
                </div>
                <div className="text-gray-400 text-sm">Minuten</div>
              </div>
              <div className="text-center">
                <div className="text-blue-500 text-xl font-bold">Free</div>
                <div className="text-gray-400 text-sm">Preis</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold text-lg">
              🎯 Für Event anmelden
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                📅 Zu Kalender hinzufügen
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium">
                📤 Event teilen
              </button>
            </div>
          </div>

          {/* Event Info */}
          <div className="mt-6 pt-4 border-t border-gray-600">
            <div className="flex items-center justify-between text-sm text-gray-400">
              <span>Event wird aufgezeichnet</span>
              <span>Live Q&A inklusive</span>
            </div>
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
          <div className="text-orange-500 text-2xl font-bold">{campusEvents.length}</div>
          <div className="text-gray-300 text-sm">Events insgesamt</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-green-500 text-2xl font-bold">6</div>
          <div className="text-gray-300 text-sm">Angemeldet</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-blue-500 text-2xl font-bold">4</div>
          <div className="text-gray-300 text-sm">Teilgenommen</div>
        </div>
        <div className="bg-gray-700 p-4 rounded-lg text-center">
          <div className="text-purple-500 text-2xl font-bold">89%</div>
          <div className="text-gray-300 text-sm">Teilnahmequote</div>
        </div>
      </div>

      {/* FullCalendar */}
      <div className="bg-gray-800 rounded-xl p-6">
        <style>{`
          .fc {
            background: transparent;
            color: white;
          }
          .fc-theme-standard .fc-scrollgrid {
            border: 1px solid #374151;
          }
          .fc-theme-standard th {
            background: #374151;
            border-color: #4b5563;
            color: white;
            font-weight: 600;
          }
          .fc-theme-standard td {
            border-color: #374151;
            background: #1f2937;
          }
          .fc-day-today {
            background: rgba(249, 115, 22, 0.1) !important;
          }
          .fc-button {
            background: #374151;
            border-color: #4b5563;
            color: white;
          }
          .fc-button:not(:disabled):active,
          .fc-button:not(:disabled).fc-button-active {
            background: #f97316;
            border-color: #ea580c;
          }
          .fc-button:hover {
            background: #4b5563;
            border-color: #6b7280;
          }
          .fc-event {
            border-radius: 6px;
            padding: 2px 4px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
          }
          .fc-event:hover {
            opacity: 0.8;
          }
          .fc-toolbar-title {
            color: white;
            font-size: 1.5rem;
            font-weight: bold;
          }
          .fc-col-header-cell-cushion {
            color: white;
          }
          .fc-daygrid-day-number {
            color: #d1d5db;
          }
          .fc-daygrid-day-number:hover {
            background: #374151;
            border-radius: 4px;
          }
        `}</style>
        
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={campusEvents}
          select={handleDateSelect}
          eventClick={handleEventClick}
          height="600px"
          locale="de"
          buttonText={{
            today: 'Heute',
            month: 'Monat',
            week: 'Woche',
            day: 'Tag'
          }}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }}
        />
      </div>

      {/* Event Categories Legend */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-white font-bold mb-4">Event-Kategorien</h3>
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

      {/* Event Modal */}
      {showEventModal && <EventModal />}
    </div>
  );
};

export default PrometheusCalendar;
