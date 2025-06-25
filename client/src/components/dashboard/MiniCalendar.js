// client/src/components/dashboard/MiniCalendar.js
import React, { useState } from 'react';
import moment from 'moment';

const MiniCalendar = ({ events, onDateClick, onEventClick }) => {
  const [currentDate, setCurrentDate] = useState(moment());
  
  const startOfMonth = currentDate.clone().startOf('month');
  const endOfMonth = currentDate.clone().endOf('month');
  const startDate = startOfMonth.clone().startOf('week');
  const endDate = endOfMonth.clone().endOf('week');

  const calendar = [];
  const day = startDate.clone().subtract(1, 'day');
  
  while (day.isBefore(endDate, 'day')) {
    calendar.push(
      Array(7).fill(0).map(() => day.add(1, 'day').clone())
    );
  }

  const getEventsForDate = (date) => {
    return events.filter(event => 
      moment(event.start).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
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

  return (
    <div className="bg-gray-700 rounded-xl p-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-lg">
          {currentDate.format('MMMM YYYY')}
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={goToPreviousMonth}
            className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center justify-center"
          >
            ←
          </button>
          <button
            onClick={goToNextMonth}
            className="w-8 h-8 bg-gray-600 hover:bg-gray-500 text-white rounded-lg flex items-center justify-center"
          >
            →
          </button>
        </div>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-center text-gray-400 text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="space-y-1">
        {calendar.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 gap-1">
            {week.map((day, dayIndex) => {
              const dayEvents = getEventsForDate(day);
              const hasEvents = dayEvents.length > 0;
              
              return (
                <div
                  key={dayIndex}
                  onClick={() => onDateClick && onDateClick(day)}
                  className={`
                    relative h-8 flex items-center justify-center text-sm cursor-pointer rounded
                    ${isCurrentMonth(day) ? 'text-white' : 'text-gray-500'}
                    ${isToday(day) ? 'bg-orange-500 text-white font-bold' : 'hover:bg-gray-600'}
                    ${hasEvents ? 'ring-2 ring-orange-400' : ''}
                  `}
                >
                  <span>{day.format('D')}</span>
                  {hasEvents && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-0.5">
                        {dayEvents.slice(0, 3).map((event, index) => (
                          <div
                            key={index}
                            className="w-1 h-1 rounded-full"
                            style={{ backgroundColor: event.color }}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="w-1 h-1 rounded-full bg-gray-400" />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Today's Events */}
      <div className="mt-4 pt-4 border-t border-gray-600">
        <h4 className="text-white font-medium text-sm mb-2">Today's Events</h4>
        {getEventsForDate(moment()).length > 0 ? (
          <div className="space-y-2">
            {getEventsForDate(moment()).map((event, index) => (
              <div
                key={index}
                onClick={() => onEventClick && onEventClick(event)}
                className="flex items-center space-x-2 p-2 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-600"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-white text-xs font-medium truncate">
                    {event.title}
                  </div>
                  <div className="text-gray-400 text-xs">
                    {moment(event.start).format('h:mm A')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-xs">No events today</div>
        )}
      </div>
    </div>
  );
};

export default MiniCalendar;
