// client/src/components/dashboard/MessagesSimple.js
import React, { useState } from 'react';

const MessagesSimple = ({ user }) => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Alex Chen',
      avatar: 'AC',
      lastMessage: 'Great session today! How did your deadlifts go?',
      timestamp: '2 min ago',
      unread: 2,
      online: true
    },
    {
      id: 2,
      name: 'Training Group',
      avatar: 'TG',
      lastMessage: 'Sarah: Anyone up for a weekend session?',
      timestamp: '1h ago',
      unread: 0,
      online: false,
      isGroup: true
    },
    {
      id: 3,
      name: 'Mike Rodriguez',
      avatar: 'MR',
      lastMessage: 'Thanks for the form tips!',
      timestamp: '3h ago',
      unread: 1,
      online: false
    },
    {
      id: 4,
      name: 'Emma Wilson',
      avatar: 'EW',
      lastMessage: 'Check out this new program I found',
      timestamp: 'Yesterday',
      unread: 0,
      online: true
    }
  ];

  const messages = {
    1: [
      {
        id: 1,
        sender: 'Alex Chen',
        avatar: 'AC',
        message: 'Hey! How was your training today?',
        timestamp: '14:30',
        isOwn: false
      },
      {
        id: 2,
        sender: 'You',
        avatar: 'DP',
        message: 'Really good! Hit a new PR on deadlift - 220kg!',
        timestamp: '14:32',
        isOwn: true
      },
      {
        id: 3,
        sender: 'Alex Chen',
        avatar: 'AC',
        message: 'Wow, thats amazing! 🔥 What was your previous best?',
        timestamp: '14:33',
        isOwn: false
      },
      {
        id: 4,
        sender: 'You',
        avatar: 'DP',
        message: '215kg, so only 5kg improvement but it felt much easier this time',
        timestamp: '14:35',
        isOwn: true
      },
      {
        id: 5,
        sender: 'Alex Chen',
        avatar: 'AC',
        message: 'Great session today! How did your deadlifts go?',
        timestamp: '15:42',
        isOwn: false
      }
    ]
  };

  const currentChat = chats.find(chat => chat.id === selectedChat);
  const currentMessages = messages[selectedChat] || [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Messages Header */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Messages</h1>
          <div className="flex space-x-2">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm">
              💬 New Chat
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm">
              👥 Groups
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-gray-800 rounded-xl overflow-hidden h-[700px] flex">
        {/* Chat List Sidebar */}
        <div className="w-80 bg-gray-800 border-r border-gray-700">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-lg font-medium text-white">Conversations</h3>
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-700 ${
                selectedChat === chat.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                    chat.isGroup ? 'bg-blue-500' : 'bg-orange-500'
                  }`}>
                    {chat.avatar}
                  </div>
                  {chat.online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium truncate">{chat.name}</h3>
                    <span className="text-gray-400 text-xs">{chat.timestamp}</span>
                  </div>
                  <p className="text-gray-400 text-sm truncate">{chat.lastMessage}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      currentChat.isGroup ? 'bg-blue-500' : 'bg-orange-500'
                    }`}>
                      {currentChat.avatar}
                    </div>
                    {currentChat.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{currentChat.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {currentChat.online ? 'Online' : 'Last seen recently'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-white p-2">📞</button>
                  <button className="text-gray-400 hover:text-white p-2">📹</button>
                  <button className="text-gray-400 hover:text-white p-2">⋯</button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {currentMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                    message.isOwn ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      message.isOwn ? 'bg-orange-500' : 'bg-gray-600'
                    }`}>
                      {message.avatar}
                    </div>
                    <div>
                      <div className={`p-3 rounded-lg ${
                        message.isOwn 
                          ? 'bg-orange-500 text-white' 
                          : 'bg-gray-700 text-white'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                      </div>
                      <p className={`text-xs text-gray-400 mt-1 ${
                        message.isOwn ? 'text-right' : 'text-left'
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-gray-800 border-t border-gray-700 p-4">
              <div className="flex items-center space-x-3">
                <button className="text-gray-400 hover:text-white">📎</button>
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                    rows="1"
                  />
                </div>
                <button className="text-gray-400 hover:text-white">😊</button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-lg ${
                    newMessage.trim()
                      ? 'bg-orange-500 hover:bg-orange-600 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  ➤
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl">💬</span>
              <h3 className="text-xl font-semibold text-white mt-4">Select a conversation</h3>
              <p className="text-gray-400 mt-2">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default MessagesSimple;
