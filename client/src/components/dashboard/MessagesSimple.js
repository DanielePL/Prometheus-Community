import React, { useState, useEffect } from 'react';

const MessagesSimple = ({ user }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages from API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/messages', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Group messages by conversation
        const groupedMessages = {};
        const conversationsList = [];
        
        data.forEach(message => {
          const conversationId = message.conversation?._id || message.conversationId;
          if (!groupedMessages[conversationId]) {
            groupedMessages[conversationId] = [];
            
            // Add to conversations list
            conversationsList.push({
              id: conversationId,
              name: message.sender?.name !== user?.name ? message.sender?.name : message.recipient?.name,
              avatar: (message.sender?.name !== user?.name ? message.sender?.name : message.recipient?.name)?.charAt(0) || 'U',
              lastMessage: message.content,
              timestamp: message.createdAt,
              unread: message.sender?._id !== user?._id && !message.read ? 1 : 0,
              online: false // You can implement online status later
            });
          }
          groupedMessages[conversationId].push(message);
        });

        // Sort messages in each conversation by timestamp
        Object.keys(groupedMessages).forEach(conversationId => {
          groupedMessages[conversationId].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });

        // Sort conversations by last message timestamp
        conversationsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setChats(conversationsList);
        setMessages(groupedMessages);
        
        // Select first chat if exists
        if (conversationsList.length > 0) {
          setSelectedChat(conversationsList[0].id);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          conversationId: selectedChat,
          content: newMessage
        })
      });

      if (response.ok) {
        const message = await response.json();
        
        // Add message to local state
        setMessages(prev => ({
          ...prev,
          [selectedChat]: [...(prev[selectedChat] || []), message]
        }));

        // Update last message in chat list
        setChats(prev => prev.map(chat => 
          chat.id === selectedChat 
            ? { ...chat, lastMessage: newMessage, timestamp: new Date().toISOString() }
            : chat
        ));

        setNewMessage('');
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
        <p className="text-red-400 mb-4">Error loading messages: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-700 h-96 flex">
      {/* Chat List */}
      <div className="w-1/3 border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Messages</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              No conversations yet
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selectedChat === chat.id ? 'bg-gray-800' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold relative ${
                    chat.online ? 'ring-2 ring-green-400' : ''
                  }`}>
                    {chat.avatar}
                    {chat.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-medium truncate">{chat.name}</h4>
                      <span className="text-xs text-gray-400">{formatTime(chat.timestamp)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <span className="bg-orange-500 text-white text-xs rounded-full px-2 py-1 min-w-5 text-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {chats.find(c => c.id === selectedChat)?.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold">
                    {chats.find(c => c.id === selectedChat)?.name}
                  </h4>
                  <p className="text-xs text-gray-400">
                    {chats.find(c => c.id === selectedChat)?.online ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages[selectedChat]?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender?._id === user?._id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender?._id === user?._id
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-700 text-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {formatMessageTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-400">
                  No messages in this conversation yet
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-orange-500 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesSimple;
