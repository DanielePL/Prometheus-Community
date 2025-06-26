// client/src/components/admin/ContentManager.js
import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';

const ContentManager = ({ user }) => {
  const { apiCall, loading, error } = useApi();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [posts, searchTerm, filterType]);

  const fetchPosts = async () => {
    try {
      const response = await apiCall('/api/posts', 'GET');
      if (response.success) {
        setPosts(response.data);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const filterPosts = () => {
    let filtered = posts;
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterType !== 'all') {
      filtered = filtered.filter(post => post.type === filterType);
    }
    
    setFilteredPosts(filtered);
  };

  const handleCreatePost = async (postData) => {
    try {
      const response = await apiCall('/api/posts', 'POST', postData);
      if (response.success) {
        setPosts([response.data, ...posts]);
        setShowCreateModal(false);
      }
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
  };

  const handleUpdatePost = async (postData) => {
    try {
      const response = await apiCall(`/api/posts/${editingPost._id}`, 'PUT', postData);
      if (response.success) {
        setPosts(posts.map(p => p._id === editingPost._id ? response.data : p));
        setShowEditModal(false);
        setEditingPost(null);
      }
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await apiCall(`/api/posts/${postId}`, 'DELETE');
        if (response.success) {
          setPosts(posts.filter(p => p._id !== postId));
        }
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  const togglePostVisibility = async (postId, currentVisibility) => {
    try {
      const response = await apiCall(`/api/posts/${postId}`, 'PUT', {
        isVisible: !currentVisibility
      });
      if (response.success) {
        setPosts(posts.map(p => p._id === postId ? response.data : p));
      }
    } catch (err) {
      console.error('Error updating post visibility:', err);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'workout': return 'text-blue-400 bg-blue-500/20';
      case 'nutrition': return 'text-green-400 bg-green-500/20';
      case 'motivation': return 'text-orange-400 bg-orange-500/20';
      case 'progress': return 'text-purple-400 bg-purple-500/20';
      case 'general': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Content Management</h2>
          <p className="text-gray-400 mt-1">Manage community posts, articles, and content</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
        >
          📝 Create Post
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-orange-500">{posts.length}</div>
          <div className="text-gray-400">Total Posts</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-green-500">{posts.filter(p => p.isVisible).length}</div>
          <div className="text-gray-400">Published</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-yellow-500">{posts.filter(p => !p.isVisible).length}</div>
          <div className="text-gray-400">Hidden</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-blue-500">{posts.reduce((sum, p) => sum + (p.likes || 0), 0)}</div>
          <div className="text-gray-400">Total Likes</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-purple-500">{posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0)}</div>
          <div className="text-gray-400">Total Comments</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Search Content</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              placeholder="Search posts..."
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="workout">Workout</option>
              <option value="nutrition">Nutrition</option>
              <option value="motivation">Motivation</option>
              <option value="progress">Progress</option>
              <option value="general">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Posts ({filteredPosts.length})</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-400">Loading posts...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-400">Error loading posts: {error}</div>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/50">
            {filteredPosts.map((post) => (
              <div key={post._id} className="p-6 hover:bg-gray-800/20">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {post.author.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="text-white font-medium">{post.author.name}</div>
                        <div className="text-gray-400 text-sm">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(post.type)}`}>
                        {post.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        post.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {post.isVisible ? 'Published' : 'Hidden'}
                      </span>
                    </div>
                    
                    <div className="text-white mb-3">
                      {post.content}
                    </div>
                    
                    {post.image && (
                      <div className="mb-3">
                        <img src={post.image} alt="Post" className="rounded-lg max-w-xs" />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-6 text-gray-400 text-sm">
                      <span>❤️ {post.likes || 0} likes</span>
                      <span>💬 {post.comments?.length || 0} comments</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => togglePostVisibility(post._id, post.isVisible)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        post.isVisible
                          ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                          : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      }`}
                    >
                      {post.isVisible ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <PostModal
          onSave={handleCreatePost}
          onCancel={() => setShowCreateModal(false)}
          title="Create New Post"
        />
      )}

      {/* Edit Post Modal */}
      {showEditModal && editingPost && (
        <PostModal
          post={editingPost}
          onSave={handleUpdatePost}
          onCancel={() => {
            setShowEditModal(false);
            setEditingPost(null);
          }}
          title="Edit Post"
        />
      )}
    </div>
  );
};

const PostModal = ({ post, onSave, onCancel, title }) => {
  const [formData, setFormData] = useState({
    content: post?.content || '',
    type: post?.type || 'general',
    isVisible: post?.isVisible ?? true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-lg border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              rows="6"
              placeholder="What's on your mind?"
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
            >
              <option value="general">General</option>
              <option value="workout">Workout</option>
              <option value="nutrition">Nutrition</option>
              <option value="motivation">Motivation</option>
              <option value="progress">Progress</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isVisible}
              onChange={(e) => setFormData({...formData, isVisible: e.target.checked})}
              className="mr-2"
            />
            <label className="text-white">Publish immediately</label>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex-1"
            >
              {post ? 'Update Post' : 'Create Post'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentManager;
