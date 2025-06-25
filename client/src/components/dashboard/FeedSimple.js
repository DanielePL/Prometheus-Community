// client/src/components/dashboard/FeedSimple.js
import React, { useState } from 'react';

const FeedSimple = ({ user, handleUserClick }) => {
  const [showStories, setShowStories] = useState(true);
  const [likedPosts, setLikedPosts] = useState(new Set([1]));
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState('');

  const stories = [
    { id: 1, user: 'You', avatar: 'DP', hasStory: true, isViewed: false },
    { id: 2, user: 'Alex', avatar: 'AC', hasStory: true, isViewed: false },
    { id: 3, user: 'Sarah', avatar: 'SJ', hasStory: true, isViewed: true },
    { id: 4, user: 'Mike', avatar: 'MR', hasStory: true, isViewed: false },
    { id: 5, user: 'Emma', avatar: 'EW', hasStory: true, isViewed: true }
  ];

  const [posts] = useState([
    {
      id: 1,
      user: { name: 'Alex Chen', avatar: 'AC', verified: true },
      timestamp: '2 hours ago',
      content: 'Just hit a new PR on deadlift! 220kg x 3 reps. The grind continues! 💪',
      type: 'workout',
      stats: { likes: 42, comments: 8, shares: 3 },
      images: ['🏋️‍♂️'], // Emoji as placeholder for workout video
      hashtags: ['#deadlift', '#PR', '#powerlifting'],
      location: 'Iron Paradise Gym',
      comments: [
        { id: 1, user: 'Sarah Johnson', avatar: 'SJ', comment: 'Beast mode! 🔥', timestamp: '1h ago' },
        { id: 2, user: 'Mike Rodriguez', avatar: 'MR', comment: 'Incredible lift! Form looked perfect', timestamp: '45m ago' }
      ]
    },
    {
      id: 2,
      user: { name: 'Sarah Johnson', avatar: 'SJ', verified: false },
      timestamp: '4 hours ago',
      content: 'Training tip: Focus on your breathing during heavy compounds. It makes all the difference! What are your favorite breathing techniques?',
      type: 'tip',
      stats: { likes: 28, comments: 12, shares: 7 },
      hashtags: ['#trainingtip', '#breathing', '#technique'],
      comments: [
        { id: 1, user: 'David Kim', avatar: 'DK', comment: 'Valsalva maneuver is game changing!', timestamp: '2h ago' }
      ]
    },
    {
      id: 3,
      user: { name: 'Emma Wilson', avatar: 'EW', verified: true },
      timestamp: '6 hours ago',
      content: 'Progress update! 6 months transformation 📸 Consistency beats perfection every time!',
      type: 'progress',
      stats: { likes: 156, comments: 24, shares: 15 },
      images: ['📸', '📸'], // Before/After photos placeholder
      hashtags: ['#transformation', '#progress', '#dedication'],
      badge: '6-Month Streak',
      comments: []
    },
    {
      id: 4,
      user: { name: 'Coach Marcus', avatar: 'CM', verified: true },
      timestamp: '8 hours ago',
      content: '🔴 LIVE: Free mobility session starting now! Join us for 20 minutes of movement that will change your training.',
      type: 'live',
      stats: { likes: 89, comments: 45, shares: 22 },
      isLive: true,
      viewers: 127,
      hashtags: ['#live', '#mobility', '#free'],
      comments: []
    }
  ]);

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
      } else {
        newLiked.add(postId);
      }
      return newLiked;
    });
  };

  const handleSave = (postId) => {
    setSavedPosts(prev => {
      const newSaved = new Set(prev);
      if (newSaved.has(postId)) {
        newSaved.delete(postId);
      } else {
        newSaved.add(postId);
      }
      return newSaved;
    });
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const getPostTypeInfo = (type, isLive) => {
    if (isLive) return { color: 'text-red-500 bg-red-500/10', icon: '🔴', label: 'LIVE' };
    switch (type) {
      case 'workout': return { color: 'text-orange-500 bg-orange-500/10', icon: '💪', label: 'Workout' };
      case 'tip': return { color: 'text-blue-500 bg-blue-500/10', icon: '💡', label: 'Tip' };
      case 'progress': return { color: 'text-green-500 bg-green-500/10', icon: '📈', label: 'Progress' };
      default: return { color: 'text-gray-500 bg-gray-500/10', icon: '📝', label: 'Post' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Stories Section */}
      {showStories && (
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Stories</h3>
            <button 
              onClick={() => setShowStories(false)}
              className="text-gray-400 hover:text-white text-sm"
            >
              Hide
            </button>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {stories.map(story => (
              <div key={story.id} className="flex flex-col items-center flex-shrink-0">
                <div className={`w-16 h-16 rounded-full p-1 ${
                  story.isViewed ? 'bg-gray-600' : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}>
                  <div className="w-full h-full bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{story.avatar}</span>
                  </div>
                </div>
                <span className="text-gray-300 text-xs mt-1">{story.user}</span>
              </div>
            ))}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center">
                <span className="text-gray-400 text-2xl">+</span>
              </div>
              <span className="text-gray-400 text-xs mt-1">Add</span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Feed</h1>
          <div className="flex space-x-2">
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm">
              🔥 Trending
            </button>
            <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-lg text-sm">
              👥 Following
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">156</div>
            <div className="text-gray-300 text-sm">Workouts</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">67</div>
            <div className="text-gray-300 text-sm">Day Streak</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">23</div>
            <div className="text-gray-300 text-sm">PRs</div>
          </div>
        </div>

        {/* Enhanced Create Post */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              {user?.avatar || 'U'}
            </div>
            <span className="text-white font-medium">{user?.name || 'User'}</span>
            <span className="text-gray-400 text-sm">What's on your mind?</span>
          </div>
          <textarea 
            placeholder="Share your workout, progress, tips, or ask the community..."
            className="w-full bg-gray-600 text-white p-3 rounded-lg border-0 resize-none"
            rows="3"
          />
          <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500">
                <span>📷</span><span>Photo</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500">
                <span>🎥</span><span>Video</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500">
                <span>📊</span><span>Workout</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-gray-300 rounded text-sm hover:bg-gray-500">
                <span>🔴</span><span>Live</span>
              </button>
            </div>
            <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium">
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts Column */}
        <div className="lg:col-span-2 space-y-6 bg-gray-800 rounded-xl p-6 min-h-[600px]">
      {posts.map(post => {
        const typeInfo = getPostTypeInfo(post.type, post.isLive);
        const isLiked = likedPosts.has(post.id);
        const isSaved = savedPosts.has(post.id);
        const showPostComments = showComments[post.id];
        
        return (
          <div key={post.id} className="bg-gray-700 rounded-xl overflow-hidden">
            {/* Post Header */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:bg-orange-400 transition-colors"
                    onClick={() => handleUserClick && handleUserClick(post.user)}
                  >
                    {post.user.avatar}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-semibold">{post.user.name}</span>
                      {post.user.verified && <span className="text-orange-500">✓</span>}
                      {post.badge && (
                        <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full text-xs">
                          🏆 {post.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <span>{post.timestamp}</span>
                      {post.location && (
                        <>
                          <span>•</span>
                          <span>📍 {post.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${typeInfo.color}`}>
                    {typeInfo.icon} {typeInfo.label}
                  </span>
                  {post.isLive && post.viewers && (
                    <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full text-xs">
                      👁️ {post.viewers} watching
                    </span>
                  )}
                  <button className="text-gray-400 hover:text-white p-1">
                    ⋯
                  </button>
                </div>
              </div>
              
              {/* Post Content */}
              <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
              
              {/* Hashtags */}
              {post.hashtags && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.hashtags.map((tag, index) => (
                    <button key={index} className="text-orange-400 hover:text-orange-300 text-sm">
                      {tag}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Images/Media */}
              {post.images && (
                <div className={`grid gap-2 mb-4 ${
                  post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
                }`}>
                  {post.images.map((image, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-8 text-center text-4xl">
                      {image}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Interaction Stats */}
            <div className="px-6 py-2 border-t border-b border-gray-700">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <div className="flex items-center space-x-4">
                  <span>❤️ {post.stats.likes + (isLiked ? 1 : 0)} likes</span>
                  <span>💬 {post.stats.comments} comments</span>
                  <span>🔄 {post.stats.shares} shares</span>
                </div>
                <span>{isSaved ? '🔖 Saved' : ''}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <span className={isLiked ? '❤️' : '🤍'}></span>
                    <span>Like</span>
                  </button>
                  <button 
                    onClick={() => toggleComments(post.id)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    <span>💬</span>
                    <span>Comment</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                    <span>�</span>
                    <span>Share</span>
                  </button>
                </div>
                <button 
                  onClick={() => handleSave(post.id)}
                  className={`transition-colors ${
                    isSaved ? 'text-orange-500' : 'text-gray-400 hover:text-orange-500'
                  }`}
                >
                  {isSaved ? '🔖' : '📄'}
                </button>
              </div>
            </div>

            {/* Comments Section */}
            {showPostComments && (
              <div className="px-6 pb-4 border-t border-gray-700">
                <div className="space-y-3 mb-4">
                  {post.comments.map(comment => (
                    <div key={comment.id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {comment.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-700 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-white font-medium text-sm">{comment.user}</span>
                            <span className="text-gray-400 text-xs">{comment.timestamp}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{comment.comment}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                          <button className="hover:text-white">Like</button>
                          <button className="hover:text-white">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Add Comment */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.avatar || 'U'}
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button className="text-orange-500 hover:text-orange-400">
                      ➤
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Trending Section */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="mr-2">🔥</span>
              Trending in Community
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <span className="text-orange-400 font-medium">#deadliftchallenge</span>
                  <p className="text-gray-400 text-sm">1,247 posts this week</p>
                </div>
                <span className="text-2xl">🏋️‍♂️</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <span className="text-orange-400 font-medium">#transformationtuesday</span>
                  <p className="text-gray-400 text-sm">892 posts today</p>
                </div>
                <span className="text-2xl">📸</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <span className="text-orange-400 font-medium">#motivationmonday</span>
                  <p className="text-gray-400 text-sm">543 posts today</p>
                </div>
                <span className="text-2xl">💪</span>
              </div>
            </div>
          </div>

          {/* Suggested Follows */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <span className="mr-2">👥</span>
              Suggested for You
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Pro Lifter Jake', avatar: 'PJ', followers: '12.5K', verified: true },
                { name: 'Fitness Coach Anna', avatar: 'FA', followers: '8.2K', verified: true },
                { name: 'Strength Community', avatar: 'SC', followers: '25.1K', verified: false }
              ].map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {suggestion.avatar}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-white font-medium">{suggestion.name}</span>
                        {suggestion.verified && <span className="text-orange-500">✓</span>}
                      </div>
                      <span className="text-gray-400 text-sm">{suggestion.followers} followers</span>
                    </div>
                  </div>
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-lg text-sm font-medium">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedSimple;
