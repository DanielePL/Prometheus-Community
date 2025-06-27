// client/src/components/dashboard/MessagesSimple.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MessagesSimple = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();

  // API Base URL
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://sea-turtle-app-4ojwp.ondigitalocean.app/api'
    : 'http://localhost:5000/api';

  // Fetch conversations from real API
  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch conversations: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setConversations(data.data);
      } else {
        setConversations([]);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching conversations:', err);
      setError('Failed to load messages. Please try again.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  // Load conversations on component mount
  useEffect(() => {
    if (token) {
      fetchConversations();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Messages</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-2/3"></div>
              </div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Messages</h3>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm mb-2">{error}</p>
          <button 
            onClick={fetchConversations}
            className="text-orange-500 hover:text-orange-400 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Messages</h3>
        <button 
          onClick={fetchConversations}
          className="text-orange-500 hover:text-orange-400 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💬</span>
          </div>
          <p className="text-gray-400 mb-2">No messages yet.</p>
          <p className="text-gray-500 text-sm">
            Start a conversation with community members!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map(conversation => (
            <div 
              key={conversation.id} 
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {conversation.participant?.avatar || conversation.participant?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                    </span>
                  </div>
                )}
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-white truncate">
                    {conversation.participant?.name || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(conversation.lastMessage?.timestamp)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {conversation.lastMessage?.isFromMe && (
                    <span className="text-gray-500 text-sm">You:</span>
                  )}
                  <p className={`text-sm truncate ${
                    conversation.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'
                  }`}>
                    {conversation.lastMessage?.content || 'No messages'}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex-shrink-0">
                {conversation.unreadCount > 0 ? (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                ) : (
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <button className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
          <span>✍️</span>
          <span className="text-white font-medium">New Message</span>
        </button>
      </div>
    </div>
  );
};

export default MessagesSimple;
