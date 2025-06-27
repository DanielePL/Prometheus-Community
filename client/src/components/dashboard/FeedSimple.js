// client/src/components/dashboard/FeedSimple.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const FeedSimple = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, token } = useAuth();

  // API Base URL
  const API_BASE = process.env.NODE_ENV === 'production' 
    ? 'https://sea-turtle-app-4ojwp.ondigitalocean.app/api'
    : 'http://localhost:5000/api';

  // Fetch posts from real API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_BASE}/posts/feed`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data && data.data.posts) {
        setPosts(data.data.posts);
      } else {
        setPosts([]);
      }
      
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Like/Unlike post
  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${API_BASE}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // Update post in local state
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post._id === postId 
              ? { ...post, likeCount: (post.likeCount || 0) + 1, isLiked: !post.isLiked }
              : post
          )
        );
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    if (token) {
      fetchPosts();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Community Feed</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-700 rounded w-1/6"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Community Feed</h3>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm mb-2">{error}</p>
          <button 
            onClick={fetchPosts}
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
        <h3 className="text-xl font-semibold text-white">Community Feed</h3>
        <button 
          onClick={fetchPosts}
          className="text-orange-500 hover:text-orange-400 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">No posts found.</p>
          <p className="text-gray-500 text-sm">
            Be the first to share something with the community!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post._id} className="border-b border-gray-700 pb-4 last:border-b-0">
              {/* Author Info */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {post.author?.avatar || post.author?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">
                    {post.author?.name || 'Unknown User'}
                    {post.author?.verified && (
                      <span className="ml-1 text-blue-500">✓</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {post.type && (
                  <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                    {post.type}
                  </span>
                )}
              </div>

              {/* Post Content */}
              <div className="mb-3">
                <p className="text-gray-300 leading-relaxed">
                  {post.content}
                </p>
                
                {/* Hashtags */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.hashtags.map(tag => (
                      <span key={tag} className="text-orange-500 text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="flex items-center space-x-4 text-sm">
                <button 
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    post.isLiked 
                      ? 'text-red-500 hover:text-red-400' 
                      : 'text-gray-400 hover:text-red-500'
                  }`}
                >
                  <span>{post.isLiked ? '❤️' : '🤍'}</span>
                  <span>{post.likeCount || 0}</span>
                </button>
                
                <button className="flex items-center space-x-1 text-gray-400 hover:text-blue-500 transition-colors">
                  <span>💬</span>
                  <span>{post.commentCount || 0}</span>
                </button>
                
                <button className="flex items-center space-x-1 text-gray-400 hover:text-green-500 transition-colors">
                  <span>📤</span>
                  <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedSimple;
