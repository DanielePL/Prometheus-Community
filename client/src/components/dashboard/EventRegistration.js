// client/src/components/dashboard/EventRegistration.js
import React, { useState } from 'react';
import moment from 'moment';

const EventRegistration = ({ event, onClose, onRegister }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState('15min');

  const handleRegister = () => {
    setIsRegistered(true);
    if (onRegister) {
      onRegister(event);
    }
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    // In a real app, this would set up notifications
  };

  const addToCalendar = () => {
    const startDate = moment(event.start).format('YYYYMMDDTHHmmss');
    const endDate = moment(event.end).format('YYYYMMDDTHHmmss');
    const title = encodeURIComponent(event.title);
    const description = encodeURIComponent(event.description || '');
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${description}`;
    window.open(googleCalendarUrl, '_blank');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Core': return '🏛️';
      case 'Academy': return '🎯';
      case 'Coach Lab': return '🎓';
      case 'Leadership': return '👑';
      case 'Business Builder': return '💰';
      case 'Special Event': return '⭐';
      default: return '📅';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{getCategoryIcon(event.category)}</span>
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium text-white"
                style={{ backgroundColor: event.color }}
              >
                {event.category}
              </span>
              {isRegistered && (
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  ✓ Registered
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{event.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2"
          >
            ✕
          </button>
        </div>

        {/* Event Details */}
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Date & Time</div>
              <div className="text-white font-medium">
                {moment(event.start).format('MMMM Do, YYYY')}
              </div>
              <div className="text-orange-500">
                {moment(event.start).format('h:mm A')} - {moment(event.end).format('h:mm A')}
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="text-gray-400 text-sm mb-1">Speaker</div>
              <div className="text-white font-medium">{event.speaker}</div>
              <div className="text-gray-400 text-sm">Host</div>
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="text-gray-400 text-sm mb-1">Description</div>
            <div className="text-white">{event.description}</div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-orange-500 text-xl font-bold">
                {event.attendees.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm">Registered</div>
            </div>
            <div className="text-center">
              <div className="text-green-500 text-xl font-bold">
                {Math.floor((event.end - event.start) / (1000 * 60))}
              </div>
              <div className="text-gray-400 text-sm">Minutes</div>
            </div>
            <div className="text-center">
              <div className="text-blue-500 text-xl font-bold">Free</div>
              <div className="text-gray-400 text-sm">Price</div>
            </div>
          </div>
        </div>

        {/* Registration Actions */}
        {!isRegistered ? (
          <div className="space-y-4">
            <button
              onClick={handleRegister}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg font-bold text-lg"
            >
              🎯 Register for Event
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={addToCalendar}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
              >
                📅 Add to Calendar
              </button>
              <button
                onClick={() => {/* Share functionality */}}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
              >
                📤 Share Event
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Reminder Settings */}
            <div className="bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-white font-medium">Set Reminder</span>
                {reminderSet && (
                  <span className="text-green-400 text-sm">✓ Set</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {['15min', '1hour', '1day'].map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedReminder(time)}
                    className={`py-2 rounded-lg text-sm ${
                      selectedReminder === time
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                    }`}
                  >
                    {time === '15min' ? '15 min' : time === '1hour' ? '1 hour' : '1 day'} before
                  </button>
                ))}
              </div>
              <button
                onClick={handleSetReminder}
                disabled={reminderSet}
                className={`w-full py-2 rounded-lg ${
                  reminderSet
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {reminderSet ? '✓ Reminder Set' : '🔔 Set Reminder'}
              </button>
            </div>

            {/* Post-Registration Actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={addToCalendar}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
              >
                📅 Add to Calendar
              </button>
              <button
                onClick={() => setIsRegistered(false)}
                className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium"
              >
                ❌ Unregister
              </button>
            </div>

            {/* Event Preparation */}
            <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg p-4">
              <h4 className="text-white font-bold mb-2">🎯 Event Preparation</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span>📝</span>
                  <span className="text-gray-300">Prepare questions for Q&A</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💻</span>
                  <span className="text-gray-300">Test your camera and microphone</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>📚</span>
                  <span className="text-gray-300">Review related materials</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Info */}
        <div className="mt-6 pt-4 border-t border-gray-600">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Event will be recorded for replay</span>
            <span>Live Q&A included</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventRegistration;
