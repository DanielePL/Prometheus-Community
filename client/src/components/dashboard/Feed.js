// client/src/components/dashboard/Feed.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';

const Feed = ({ user, handleUserClick }) => {
  const [activeTab, setActiveTab] = useState('All Posts');
  
  // Debug log to verify Feed component is loading
  console.log('Feed component rendering for user:', user);

  const feedPosts = [
    {
      id: 1,
      user: { name: 'Mike Johnson', avatar: 'MJ', time: '2 hours ago' },
      type: 'NEW PR',
      content: '🔥 Just hit a new deadlift PR! 220kg at 82kg bodyweight! The VBT analysis showed perfect velocity throughout the lift. Prometheus AI suggested this was the perfect day to test my max - and it was right! 💪',
      videoTitle: 'Deadlift PR Video - 220kg',
      videoSubtitle: 'VBT Analysis: 0.15 m/s average velocity',
      reactions: 47,
      comments: 12,
      shares: 8
    },
    {
      id: 2,
      user: { name: 'Sarah Lopez', avatar: 'SL', time: '4 hours ago' },
      type: 'WOD COMPLETE',
      content: 'Crushed today\'s WOD! "Prometheus Power" - 5x3 Back Squat @ 85% 1RM. The AI coach nailed the RPE recommendations. Every set felt challenging but doable. Bar path analysis showed 98% consistency! 🎯',
      reactions: 31,
      comments: 7,
      shares: 4
    },
    {
      id: 3,
      user: { name: 'Alex Chen', avatar: 'AC', time: '6 hours ago' },
      type: 'EXPERT TIP',
      content: '🎯 VBT Masterclass: Understanding your force-velocity curve. When your average velocity drops below 20% of your max velocity for that load, you\'re entering the strength-endurance zone. This is when form typically breaks down...',
      reactions: 89,
      comments: 23,
      shares: 45
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Alex Chen', avatar: 'AC', prs: 6, badge: '🏆' },
    { rank: 2, name: 'Maria Santos', avatar: 'MS', prs: 5, badge: '🥈' },
    { rank: 3, name: 'Jake Wilson', avatar: 'JW', prs: 4, badge: '🥉' }
  ];

  const upcomingEvents = [
    { date: '24', month: 'NOV', title: 'VBT Masterclass', time: '2:00 PM EST' },
    { date: '1', month: 'DEC', title: 'Beta Launch Party', time: '6:00 PM EST' },
    { date: '15', month: 'DEC', title: 'Winter Challenge', time: 'All Day' }
  ];

  return (
    <div className="w-full px-8 py-8">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Main Feed */}
        <main className="xl:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Feed Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Community Feed</h1>
              <p className="text-prometheus-text-muted text-lg">Stay connected with the strongest community on earth</p>
            </div>

            {/* Feed Tabs */}
            <div className="bg-prometheus-dark-card rounded-lg p-1 mb-8 border border-prometheus-gray-medium">
              <div className="grid grid-cols-4 gap-1">
                {['All Posts', 'PRs & Achievements', 'Tutorials', 'Announcements'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-prometheus-orange text-white'
                        : 'text-prometheus-text-muted hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-6">
              <AnimatePresence>
                {feedPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="feed-post p-8"
                  >
                    {/* Post Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => handleUserClick(post.user)}
                          className="avatar w-10 h-10 text-sm mr-3 hover:scale-105 transition-transform"
                        >
                          {post.user.avatar}
                        </button>
                        <div>
                          <button
                            onClick={() => handleUserClick(post.user)}
                            className="font-medium text-white hover:text-prometheus-orange transition-colors"
                          >
                            {post.user.name}
                          </button>
                          <p className="text-prometheus-text-muted text-sm">{post.user.time}</p>
                        </div>
                      </div>
                      {post.type && (
                        <span className="badge">
                          {post.type}
                        </span>
                      )}
                    </div>

                    {/* Post Content */}
                    <p className="text-prometheus-text-light mb-4 leading-relaxed">{post.content}</p>

                    {/* Video Section */}
                    {post.videoTitle && (
                      <div className="bg-prometheus-gray-dark rounded-lg p-4 mb-4 border border-prometheus-gray-medium">
                        <div className="flex items-center justify-center h-48 bg-prometheus-gray-medium rounded-lg mb-3">
                          <button className="w-12 h-12 bg-prometheus-orange rounded-full flex items-center justify-center hover:scale-105 transition-transform glow-orange">
                            <Play className="w-5 h-5 text-white ml-1" />
                          </button>
                        </div>
                        <h4 className="font-medium text-white text-sm">{post.videoTitle}</h4>
                        {post.videoSubtitle && (
                          <p className="text-prometheus-text-muted text-xs mt-1">{post.videoSubtitle}</p>
                        )}
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-prometheus-gray-medium">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-prometheus-text-muted hover:text-prometheus-orange transition-colors">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.reactions}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-prometheus-text-muted hover:text-prometheus-orange transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-prometheus-text-muted hover:text-prometheus-orange transition-colors">
                          <Share2 className="w-4 h-4" />
                          <span className="text-sm">{post.shares}</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>

        {/* Right Sidebar */}
        <aside className="xl:col-span-5 space-y-6">
          {/* Workout of the Day */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="widget"
          >
            <div className="bg-prometheus-dark-lighter px-6 py-4 border-b border-prometheus-gray-medium">
              <h3 className="font-bold text-white">Workout of the Day</h3>
            </div>
            <div className="p-6">
              <div className="bg-prometheus-orange rounded-lg p-6 text-white text-center">
                <h4 className="text-lg font-bold mb-3">Prometheus Power</h4>
                <div className="space-y-1 text-sm mb-4">
                  <p>5 x 3 Back Squat</p>
                  <p>@ 85% 1RM</p>
                  <p className="text-xs opacity-80">3 min rest between sets</p>
                </div>
                <p className="text-xs opacity-80 mb-4">347 athletes participating</p>
                <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-medium py-2 px-4 rounded-lg transition-all">
                  Start Workout
                </button>
              </div>
            </div>
          </motion.div>

          {/* Weekly Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="widget"
          >
            <div className="bg-prometheus-dark-lighter px-6 py-4 border-b border-prometheus-gray-medium">
              <h3 className="font-bold text-white">Weekly Leaderboard</h3>
            </div>
            <div className="p-6 space-y-4">
              {leaderboard.map((athlete) => (
                <div key={athlete.rank} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-prometheus-orange rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {athlete.rank}
                    </div>
                    <div>
                      <button
                        onClick={() => handleUserClick({ name: athlete.name, avatar: athlete.avatar, title: 'Community Champion' })}
                        className="font-medium text-white hover:text-prometheus-orange transition-colors text-sm"
                      >
                        {athlete.name}
                      </button>
                      <p className="text-prometheus-text-muted text-xs">{athlete.prs} PRs this week</p>
                    </div>
                  </div>
                  <span className="text-lg">{athlete.badge}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="widget"
          >
            <div className="bg-prometheus-dark-lighter px-6 py-4 border-b border-prometheus-gray-medium">
              <h3 className="font-bold text-white">Upcoming Events</h3>
            </div>
            <div className="p-6 space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center">
                  <div className="bg-prometheus-orange rounded-lg p-3 text-white text-center mr-4 min-w-0">
                    <div className="text-lg font-bold leading-none">{event.date}</div>
                    <div className="text-xs opacity-80">{event.month}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">{event.title}</h4>
                    <p className="text-prometheus-text-muted text-xs">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="widget"
          >
            <div className="bg-prometheus-dark-lighter px-6 py-4 border-b border-prometheus-gray-medium">
              <h3 className="font-bold text-white">Community Stats</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center bg-prometheus-orange bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-prometheus-orange">2.3K</div>
                  <div className="text-xs text-prometheus-text-muted">Members</div>
                </div>
                <div className="text-center bg-prometheus-orange bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-prometheus-orange">847</div>
                  <div className="text-xs text-prometheus-text-muted">PRs This Week</div>
                </div>
                <div className="text-center bg-prometheus-orange bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-prometheus-orange">156</div>
                  <div className="text-xs text-prometheus-text-muted">Active Challenges</div>
                </div>
                <div className="text-center bg-prometheus-orange bg-opacity-10 rounded-lg p-4">
                  <div className="text-2xl font-bold text-prometheus-orange animate-pulse">LIVE</div>
                  <div className="text-xs text-prometheus-text-muted">Beta Access</div>
                </div>
              </div>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
};

export default Feed;