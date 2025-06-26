// client/src/components/admin/UserManager.js
import React, { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';

const UserManager = ({ user }) => {
  const { apiCall, loading, error } = useApi();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterRole]);

  const fetchUsers = async () => {
    try {
      const response = await apiCall('/api/users', 'GET');
      if (response.success) {
        setUsers(response.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const filterUsers = () => {
    let filtered = users;
    
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === filterRole);
    }
    
    setFilteredUsers(filtered);
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      const response = await apiCall(`/api/users/${editingUser._id}`, 'PUT', updatedData);
      if (response.success) {
        setUsers(users.map(u => u._id === editingUser._id ? response.data : u));
        setShowEditModal(false);
        setEditingUser(null);
      }
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        const response = await apiCall(`/api/users/${userId}`, 'DELETE');
        if (response.success) {
          setUsers(users.filter(u => u._id !== userId));
        }
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-500/20';
      case 'moderator': return 'text-purple-400 bg-purple-500/20';
      case 'coach': return 'text-blue-400 bg-blue-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getSubscriptionColor = (subscription) => {
    switch (subscription) {
      case 'business-builder': return 'text-yellow-400 bg-yellow-500/20';
      case 'leadership': return 'text-purple-400 bg-purple-500/20';
      case 'coach-lab': return 'text-blue-400 bg-blue-500/20';
      case 'academy': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">User Management</h2>
          <p className="text-gray-400 mt-1">Manage community members, roles, and permissions</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-orange-500">{users.length}</div>
          <div className="text-gray-400">Total Users</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-red-500">{users.filter(u => u.role === 'admin').length}</div>
          <div className="text-gray-400">Admins</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-blue-500">{users.filter(u => u.role === 'coach').length}</div>
          <div className="text-gray-400">Coaches</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-green-500">{users.filter(u => u.verified).length}</div>
          <div className="text-gray-400">Verified</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-yellow-500">{users.filter(u => u.subscription !== 'free').length}</div>
          <div className="text-gray-400">Premium</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white font-medium mb-2">Search Users</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              placeholder="Search by name or email..."
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-2">Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Roles</option>
              <option value="member">Members</option>
              <option value="coach">Coaches</option>
              <option value="moderator">Moderators</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Users ({filteredUsers.length})</h3>
        </div>
        
        {loading ? (
          <div className="p-8 text-center">
            <div className="text-gray-400">Loading users...</div>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <div className="text-red-400">Error loading users: {error}</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left py-3 px-6 text-gray-300 font-medium">User</th>
                  <th className="text-left py-3 px-6 text-gray-300 font-medium">Role</th>
                  <th className="text-left py-3 px-6 text-gray-300 font-medium">Subscription</th>
                  <th className="text-left py-3 px-6 text-gray-300 font-medium">Status</th>
                  <th className="text-left py-3 px-6 text-gray-300 font-medium">Joined</th>
                  <th className="text-left py-3 px-6 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((userItem) => (
                  <tr key={userItem._id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                          {userItem.avatar || userItem.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="text-white font-medium">{userItem.name}</div>
                          <div className="text-gray-400 text-sm">{userItem.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(userItem.role)}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSubscriptionColor(userItem.subscription)}`}>
                        {userItem.subscription}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        userItem.verified ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {userItem.verified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-white text-sm">
                        {new Date(userItem.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(userItem)}
                          className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1 rounded text-sm transition-colors"
                        >
                          Edit
                        </button>
                        {userItem._id !== user._id && (
                          <button
                            onClick={() => handleDeleteUser(userItem._id)}
                            className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded text-sm transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <UserEditModal
          user={editingUser}
          onSave={handleUpdateUser}
          onCancel={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

const UserEditModal = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    subscription: user.subscription,
    verified: user.verified
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl p-6 w-full max-w-md border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-6">Edit User</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-medium mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
            >
              <option value="member">Member</option>
              <option value="coach">Coach</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <div>
            <label className="block text-white font-medium mb-2">Subscription</label>
            <select
              value={formData.subscription}
              onChange={(e) => setFormData({...formData, subscription: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
            >
              <option value="free">Free</option>
              <option value="academy">Academy</option>
              <option value="coach-lab">Coach Lab</option>
              <option value="leadership">Leadership</option>
              <option value="business-builder">Business Builder</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.verified}
              onChange={(e) => setFormData({...formData, verified: e.target.checked})}
              className="mr-2"
            />
            <label className="text-white">Verified User</label>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all flex-1"
            >
              Save Changes
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

export default UserManager;
