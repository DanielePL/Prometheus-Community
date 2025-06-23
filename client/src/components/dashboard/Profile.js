// client/src/components/dashboard/Profile.js
import React from 'react';
import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

const Profile = ({ user, selectedUser }) => {
  const profileUser = selectedUser || user;
  const isOwnProfile = !selectedUser || selectedUser.name === user?.name;

  return (
    <div className="w-full px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Profile Header */}
        <div className="card mb-8">
          <div className="relative">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-prometheus-orange to-orange-600 rounded-t-lg" />
            
            {/* Profile Info */}
            <div className="relative px-8 pb-8">
              <div className="flex flex-col md:flex-row md:items-end md:space-x-8 -mt-16">
                {/* Avatar */}
                <div className="relative mb-4 md:mb-0">
                  <div className="w-32 h-32 bg-prometheus-gray-dark border-4 border-prometheus-dark rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                    {profileUser?.avatar}
                  </div>
                  {isOwnProfile && (
                    <button className="absolute bottom-2 right-2 w-8 h-8 bg-prometheus-orange rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform">
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl font-bold text-white mb-2">
                        {profileUser?.name}
                      </h1>
                      <p className="text-xl text-prometheus-orange mb-3">
                        {profileUser?.title}
                      </p>
                      <div className="flex items-center space-x-6 text-sm text-prometheus-text-muted">
                        <span>🏆 Rank #5 Global</span>
                        <span>📅 Joined Nov 2023</span>
                        <span>🔥 67 Day Streak</span>
                      </div>
                    </div>
                    
                    {!isOwnProfile && (
                      <div className="flex space-x-3 mt-4 md:mt-0">
                        <button className="btn-primary">Follow</button>
                        <button className="btn-secondary">Message</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6 max-w-2xl">
                <p className="text-prometheus-text-light leading-relaxed">
                  IPF World Champion and VBT enthusiast. Helping athletes optimize their training through science-based methods. 
                  Passionate about sharing knowledge and building the strongest community on earth. 💪
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                <div className="text-center bg-prometheus-gray-dark rounded-lg p-4">
                  <div className="text-2xl font-bold text-prometheus-orange">10,567</div>
                  <div className="text-xs text-prometheus-text-muted">Points</div>
                </div>
                <div className="text-center bg-prometheus-gray-dark rounded-lg p-4">
                  <div className="text-2xl font-bold text-prometheus-orange">1,876</div>
                  <div className="text-xs text-prometheus-text-muted">Total Lifts</div>
                </div>
                <div className="text-center bg-prometheus-gray-dark rounded-lg p-4">
                  <div className="text-2xl font-bold text-prometheus-orange">234</div>
                  <div className="text-xs text-prometheus-text-muted">Followers</div>
                </div>
                <div className="text-center bg-prometheus-gray-dark rounded-lg p-4">
                  <div className="text-2xl font-bold text-prometheus-orange">189</div>
                  <div className="text-xs text-prometheus-text-muted">Following</div>
                </div>
                <div className="text-center bg-prometheus-gray-dark rounded-lg p-4">
                  <div className="text-2xl font-bold text-prometheus-orange">67</div>
                  <div className="text-xs text-prometheus-text-muted">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Records */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="bg-prometheus-dark-lighter px-6 py-4 border-b border-prometheus-gray-medium">
                <h3 className="font-bold text-white text-lg">Personal Records</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { exercise: 'Squat', weight: '525 lbs', velocity: '0.45 m/s', date: 'Nov 15, 2024' },
                    { exercise: 'Bench Press', weight: '365 lbs', velocity: '0.38 m/s', date: 'Nov 10, 2024' },
                    { exercise: 'Deadlift', weight: '705 lbs', velocity: '0.41 m/s', date: 'Nov 20, 2024' }
                  ].map((pr, index) => (
                    <div key={index} className="bg-prometheus-gray-dark rounded-lg p-4 text-center">
                      <h4 className="font-medium text-white mb-2">{pr.exercise}</h4>
                      <div className="text-2xl font-bold text-prometheus-orange mb-1">{pr.weight}</div>
                      <div className="text-sm text-prometheus-text-muted mb-1">Velocity: {pr.velocity}</div>
                      <div className="text-xs text-prometheus-text-muted">{pr.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="bg-prometheus-dark-lighter px-6 py-4 border-b border-prometheus-gray-medium">
                <h3 className="font-bold text-white text-lg">Recent Activity</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { action: 'Hit a new deadlift PR', detail: '705 lbs', time: '2 hours ago', icon: '🏆' },
                  { action: 'Completed November Power Challenge', detail: '30/30 days', time: '1 day ago', icon: '⚡' },
                  { action: 'Joined VBT Masterclass', detail: 'Nov 24 workshop', time: '3 days ago', icon: '📚' },
                  { action: 'Achieved 60-day streak', detail: 'Consistency Champion', time: '1 week ago', icon: '🔥' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-white font-medium">{activity.action}</p>
                      <p className="text-prometheus-text-muted text-xs mb-1">
                        {activity.detail}
                      </p>
                      <p className="text-prometheus-text-muted text-xs">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <div className="bg-prometheus-dark-lighter px-6 py-4 border-b border-prometheus-gray-medium">
                <h3 className="font-bold text-white">Achievements</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { badge: '👑', title: 'VIP Member' },
                    { badge: '🏆', title: 'Champion' },
                    { badge: '🔥', title: 'Streak Master' },
                    { badge: '💪', title: 'Power Lifter' },
                    { badge: '⚡', title: 'Speed Demon' },
                    { badge: '📈', title: 'Progress King' }
                  ].map((achievement, index) => (
                    <div key={index} className="text-center p-3 bg-prometheus-gray-dark rounded-lg hover:bg-prometheus-gray-medium transition-colors cursor-pointer">
                      <div className="text-2xl mb-1">{achievement.badge}</div>
                      <div className="text-xs text-prometheus-text-muted">{achievement.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;