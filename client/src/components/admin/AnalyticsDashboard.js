// client/src/components/admin/AnalyticsDashboard.js
import React, { useState, useEffect } from 'react';
import { useAsyncOperation } from '../../hooks/useApi';

const AnalyticsDashboard = ({ user }) => {
  const { apiCall, loading, error } = useAsyncOperation();
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      activeUsers: 0,
      totalPosts: 0,
      totalEvents: 0,
      totalRevenue: 0
    },
    userGrowth: [],
    contentStats: {},
    eventStats: {},
    subscriptionStats: {}
  });

  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Simulate analytics API calls
      const [usersRes, postsRes, eventsRes] = await Promise.all([
        apiCall('/api/users', 'GET'),
        apiCall('/api/posts', 'GET'),
        apiCall('/api/events', 'GET')
      ]);

      if (usersRes.success && postsRes.success && eventsRes.success) {
        const users = usersRes.data;
        const posts = postsRes.data;
        const events = eventsRes.data;

        // Calculate analytics
        const totalUsers = users.length;
        const activeUsers = users.filter(u => {
          const lastActive = new Date(u.lastActive || u.createdAt);
          const daysAgo = (new Date() - lastActive) / (1000 * 60 * 60 * 24);
          return daysAgo <= 30;
        }).length;

        const subscriptionStats = users.reduce((acc, user) => {
          acc[user.subscription] = (acc[user.subscription] || 0) + 1;
          return acc;
        }, {});

        const contentStats = posts.reduce((acc, post) => {
          acc[post.type] = (acc[post.type] || 0) + 1;
          return acc;
        }, {});

        // Mock revenue calculation
        const totalRevenue = users.reduce((sum, user) => {
          const prices = {
            'free': 0,
            'academy': 29,
            'coach-lab': 79,
            'leadership': 149,
            'business-builder': 299
          };
          return sum + (prices[user.subscription] || 0);
        }, 0);

        setAnalytics({
          overview: {
            totalUsers,
            activeUsers,
            totalPosts: posts.length,
            totalEvents: events.length,
            totalRevenue
          },
          userGrowth: generateUserGrowthData(users),
          contentStats,
          eventStats: generateEventStats(events),
          subscriptionStats
        });
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    }
  };

  const generateUserGrowthData = (users) => {
    const now = new Date();
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const data = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const usersUntilDate = users.filter(user => 
        new Date(user.createdAt) <= date
      ).length;
      
      data.push({
        date: date.toISOString().split('T')[0],
        users: usersUntilDate
      });
    }

    return data;
  };

  const generateEventStats = (events) => {
    const upcoming = events.filter(event => new Date(event.date) > new Date()).length;
    const past = events.filter(event => new Date(event.date) <= new Date()).length;
    const totalRegistrations = events.reduce((sum, event) => sum + (event.registered || 0), 0);

    return { upcoming, past, totalRegistrations };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value, total) => {
    if (total === 0) return '0%';
    return `${Math.round((value / total) * 100)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
          <p className="text-gray-400 mt-1">Community insights and performance metrics</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-blue-500">{analytics.overview.totalUsers}</div>
              <div className="text-gray-400">Total Users</div>
            </div>
            <div className="text-2xl">👥</div>
          </div>
        </div>
        
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-green-500">{analytics.overview.activeUsers}</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-2xl">🟢</div>
          </div>
        </div>
        
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-purple-500">{analytics.overview.totalPosts}</div>
              <div className="text-gray-400">Total Posts</div>
            </div>
            <div className="text-2xl">📝</div>
          </div>
        </div>
        
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-orange-500">{analytics.overview.totalEvents}</div>
              <div className="text-gray-400">Total Events</div>
            </div>
            <div className="text-2xl">📅</div>
          </div>
        </div>
        
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold text-yellow-500">{formatCurrency(analytics.overview.totalRevenue)}</div>
              <div className="text-gray-400">Revenue</div>
            </div>
            <div className="text-2xl">💰</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">User Growth</h3>
          <div className="space-y-2">
            {analytics.userGrowth.slice(-7).map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {new Date(data.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(data.users / analytics.overview.totalUsers) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-medium w-8 text-right">{data.users}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscription Distribution */}
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">Subscription Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analytics.subscriptionStats).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    type === 'business-builder' ? 'bg-yellow-500' :
                    type === 'leadership' ? 'bg-purple-500' :
                    type === 'coach-lab' ? 'bg-blue-500' :
                    type === 'academy' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-white capitalize">{type.replace('-', ' ')}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{count}</div>
                  <div className="text-gray-400 text-sm">
                    {formatPercentage(count, analytics.overview.totalUsers)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Stats */}
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">Content Statistics</h3>
          <div className="space-y-4">
            {Object.entries(analytics.contentStats).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">
                    {type === 'workout' ? '💪' :
                     type === 'nutrition' ? '🥗' :
                     type === 'motivation' ? '🔥' :
                     type === 'progress' ? '📈' : '💬'}
                  </div>
                  <span className="text-white capitalize">{type}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{count}</div>
                  <div className="text-gray-400 text-sm">
                    {formatPercentage(count, analytics.overview.totalPosts)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Stats */}
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <h3 className="text-xl font-bold text-white mb-6">Event Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-lg">🔮</div>
                <span className="text-white">Upcoming Events</span>
              </div>
              <div className="text-white font-medium">{analytics.eventStats.upcoming}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-lg">✅</div>
                <span className="text-white">Past Events</span>
              </div>
              <div className="text-white font-medium">{analytics.eventStats.past}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-lg">🎫</div>
                <span className="text-white">Total Registrations</span>
              </div>
              <div className="text-white font-medium">{analytics.eventStats.totalRegistrations}</div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-lg">📊</div>
                <span className="text-white">Avg per Event</span>
              </div>
              <div className="text-white font-medium">
                {analytics.overview.totalEvents > 0 
                  ? Math.round(analytics.eventStats.totalRegistrations / analytics.overview.totalEvents)
                  : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-6">Engagement Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">
              {formatPercentage(analytics.overview.activeUsers, analytics.overview.totalUsers)}
            </div>
            <div className="text-gray-400">Active User Rate</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {analytics.overview.totalUsers > 0 
                ? (analytics.overview.totalPosts / analytics.overview.totalUsers).toFixed(1)
                : '0'}
            </div>
            <div className="text-gray-400">Posts per User</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {formatPercentage(
                Object.values(analytics.subscriptionStats).reduce((sum, count) => sum + count, 0) - (analytics.subscriptionStats.free || 0),
                analytics.overview.totalUsers
              )}
            </div>
            <div className="text-gray-400">Premium Users</div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500">
              {analytics.overview.totalUsers > 0 
                ? (analytics.eventStats.totalRegistrations / analytics.overview.totalUsers).toFixed(1)
                : '0'}
            </div>
            <div className="text-gray-400">Events per User</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
