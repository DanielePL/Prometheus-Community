// client/src/components/dashboard/SimpleCampusCalendar.js
import React, { useState } from 'react';
import moment from 'moment';

const SimpleCampusCalendar = ({ user }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [view, setView] = useState('month');
  
  // Sample events data
  const events = [
    {
      id: 1,
      title: 'Campus Town Hall',
      date: '2025-06-26',
      time: '20:00',
      type: 'core',
      color: '#f97316'
    },
    {
      id: 2,
      title: 'TUT Deep Dive',
      date: '2025-06-27',
      time: '19:00',
      type: 'academy',
      color: '#3b82f6'
    },
    {
      id: 3,
      title: 'Video Analysis Workshop',
      date: '2025-06-30',
      time: '18:00',
      type: 'coach',
      color: '#10b981'
    }
  ];

  const getDaysInMonth = () => {
    const startOfMonth = currentDate.clone().startOf('month');
    const endOfMonth = currentDate.clone().endOf('month');
    const startDate = startOfMonth.clone().startOf('week');
    const endDate = endOfMonth.clone().endOf('week');

    const days = [];
    const day = startDate.clone().subtract(1, 'day');

    while (day.isBefore(endDate, 'day')) {
      days.push(day.add(1, 'day').clone());
    }

    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => 
      moment(event.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(currentDate.clone().subtract(1, 'month'));
  };

  const goToNextMonth = () => {
    setCurrentDate(currentDate.clone().add(1, 'month'));
  };

  const isToday = (date) => {
    return moment().format('YYYY-MM-DD') === date.format('YYYY-MM-DD');
  };

  const isCurrentMonth = (date) => {
    return date.month() === currentDate.month();
  };

  const days = getDaysInMonth();
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

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

      {/* Calendar */}
      <div className="bg-gray-800 rounded-xl p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-white">{currentDate.format('MMMM YYYY')}</h2>
            <div className="flex space-x-2">
              <button
                onClick={goToPreviousMonth}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg"
              >
                ←
              </button>
              <button
                onClick={() => setCurrentDate(moment())}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg"
              >
                Today
              </button>
              <button
                onClick={goToNextMonth}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg"
              >
                →
              </button>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {['month', 'week', 'list'].map(viewName => (
              <button
                key={viewName}
                onClick={() => setView(viewName)}
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

        {view === 'month' && (
          <>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <div key={index} className="text-center text-gray-400 font-medium py-3">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => {
                const dayEvents = getEventsForDate(day);
                const hasEvents = dayEvents.length > 0;
                
                return (
                  <div
                    key={index}
                    className={`
                      relative min-h-[100px] p-2 border border-gray-700 
                      ${isCurrentMonth(day) ? 'bg-gray-800' : 'bg-gray-900'}
                      ${isToday(day) ? 'bg-orange-500/20 border-orange-500' : ''}
                      hover:bg-gray-700 cursor-pointer transition-colors
                    `}
                  >
                    <div className={`
                      text-sm font-medium mb-2
                      ${isCurrentMonth(day) ? 'text-white' : 'text-gray-500'}
                      ${isToday(day) ? 'text-orange-500 font-bold' : ''}
                    `}>
                      {day.format('D')}
                    </div>
                    
                    {hasEvents && (
                      <div className="space-y-1">
                        {dayEvents.slice(0, 3).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className="text-xs p-1 rounded text-white truncate"
                            style={{ backgroundColor: event.color }}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view === 'list' && (
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-white mb-4">Upcoming Events</h3>
            {events.map(event => (
              <div key={event.id} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: event.color }}
                    />
                    <div>
                      <div className="text-white font-medium">{event.title}</div>
                      <div className="text-gray-400 text-sm">
                        {moment(event.date).format('MMMM Do, YYYY')} at {event.time}
                      </div>
                    </div>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
    </div>
  );
};

export default SimpleCampusCalendar;
