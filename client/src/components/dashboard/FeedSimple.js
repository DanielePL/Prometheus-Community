// client/src/components/dashboard/FeedSimple.js
import React, { useState, useEffect } from 'react';
import apiService from '../../services/api';

const FeedSimple = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Fetch posts on component mount
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await apiService.getPosts();
        if (response.success) {
          setPosts(response.data || []);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const response = await apiService.createPost({
        content: newPost.trim(),
        type: 'text'
      });
      
      if (response.success) {
        setPosts([response.data, ...posts]);
        setNewPost('');
        setShowCreatePost(false);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      setError('Failed to create post');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await apiService.likePost(postId);
      if (response.success) {
        setPosts(posts.map(post => 
          post._id === postId 
            ? { ...post, likes: response.data.likes, likeCount: response.data.likeCount }
            : post
        ));
      }
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6 animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 text-center">
          <div className="text-red-400 text-xl mb-2">⚠️ Error Loading Feed</div>
          <p className="text-red-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Feed Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">🔥 Community Feed</h2>
        <button
          onClick={() => setShowCreatePost(!showCreatePost)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium"
        >
          ✍️ Create Post
        </button>
      </div>

      {/* Create Post Form */}
      {showCreatePost && (
        <div className="bg-gray-800 rounded-xl p-6">
          <form onSubmit={handleCreatePost}>
            <div className="mb-4">
              <label className="block text-white font-medium mb-2">
                What's on your mind?
              </label>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none resize-none"
                rows="4"
                placeholder="Share your thoughts with the community..."
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={!newPost.trim()}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium"
              >
                Post
              </button>
              <button
                type="button"
                onClick={() => setShowCreatePost(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
          <div className="text-gray-400 text-xl mb-4">📝 No Posts Yet</div>
          <p className="text-gray-500 mb-4">Be the first to share something with the community!</p>
          <button
            onClick={() => setShowCreatePost(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-gray-800 rounded-xl p-6">
              {/* Post Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                  {post.author?.name?.charAt(0) || post.author?.firstName?.charAt(0) || 'U'}
                </div>
                <div>
                  <div className="text-white font-medium">
                    {post.author?.name || `${post.author?.firstName || ''} ${post.author?.lastName || ''}`.trim() || 'Anonymous'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="text-gray-300 mb-4">
                {post.content}
              </div>

              {/* Post Actions */}
              <div className="flex items-center space-x-6 text-gray-400">
                <button
                  onClick={() => handleLikePost(post._id)}
                  className="flex items-center space-x-2 hover:text-orange-400 transition-colors"
                >
                  <span>👍</span>
                  <span>{post.likeCount || 0} Likes</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-400 transition-colors">
                  <span>💬</span>
                  <span>{post.commentCount || 0} Comments</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-400 transition-colors">
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
