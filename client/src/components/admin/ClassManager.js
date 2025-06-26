// client/src/components/admin/ClassManager.js
import React, { useState } from 'react';

const ClassManager = ({ user }) => {
  const [classes, setClasses] = useState([
    {
      id: 1,
      title: 'Beginner Powerlifting',
      description: 'Introduction to powerlifting fundamentals',
      instructor: 'Marcus Thompson',
      schedule: 'Mon, Wed, Fri - 6:00 PM',
      duration: '8 weeks',
      capacity: 15,
      enrolled: 12,
      price: 299,
      level: 'beginner',
      status: 'active',
      startDate: '2025-08-01',
      tags: ['powerlifting', 'strength', 'fundamentals']
    },
    {
      id: 2,
      title: 'Advanced Olympic Lifting',
      description: 'Master the snatch and clean & jerk techniques',
      instructor: 'Sarah Chen',
      schedule: 'Tue, Thu - 7:00 PM',
      duration: '12 weeks',
      capacity: 8,
      enrolled: 6,
      price: 449,
      level: 'advanced',
      status: 'active',
      startDate: '2025-08-05',
      tags: ['olympic', 'technique', 'advanced']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [newClass, setNewClass] = useState({
    title: '',
    description: '',
    instructor: '',
    schedule: '',
    duration: '',
    capacity: 15,
    price: 0,
    level: 'beginner',
    startDate: '',
    tags: []
  });

  const [newTag, setNewTag] = useState('');

  const handleAddClass = () => {
    const classData = {
      id: classes.length + 1,
      ...newClass,
      enrolled: 0,
      status: 'draft'
    };
    setClasses([...classes, classData]);
    resetForm();
  };

  const handleEditClass = (classData) => {
    setEditingClass(classData);
    setNewClass(classData);
    setShowAddForm(true);
  };

  const handleUpdateClass = () => {
    setClasses(classes.map(c => c.id === editingClass.id ? { ...newClass } : c));
    resetForm();
  };

  const resetForm = () => {
    setNewClass({
      title: '',
      description: '',
      instructor: '',
      schedule: '',
      duration: '',
      capacity: 15,
      price: 0,
      level: 'beginner',
      startDate: '',
      tags: []
    });
    setShowAddForm(false);
    setEditingClass(null);
  };

  const handleDeleteClass = (classId) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      setClasses(classes.filter(c => c.id !== classId));
    }
  };

  const toggleClassStatus = (classId) => {
    setClasses(classes.map(c => 
      c.id === classId 
        ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' }
        : c
    ));
  };

  const addTag = () => {
    if (newTag && !newClass.tags.includes(newTag)) {
      setNewClass({
        ...newClass,
        tags: [...newClass.tags, newTag]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewClass({
      ...newClass,
      tags: newClass.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Class Management</h2>
          <p className="text-gray-400 mt-1">Create and manage training classes and programs</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105"
        >
          🏫 Add New Class
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-orange-500">{classes.length}</div>
          <div className="text-gray-400">Total Classes</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-green-500">{classes.filter(c => c.status === 'active').length}</div>
          <div className="text-gray-400">Active Classes</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-blue-500">{classes.reduce((sum, c) => sum + c.enrolled, 0)}</div>
          <div className="text-gray-400">Total Students</div>
        </div>
        <div className="bg-gray-900/60 rounded-xl p-6 border border-gray-800">
          <div className="text-3xl font-bold text-yellow-500">
            ${classes.reduce((sum, c) => sum + (c.enrolled * c.price), 0).toLocaleString()}
          </div>
          <div className="text-gray-400">Revenue</div>
        </div>
      </div>

      {/* Add/Edit Class Form */}
      {showAddForm && (
        <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
          <h3 className="text-xl font-bold text-white mb-6">
            {editingClass ? 'Edit Class' : 'Add New Class'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">Class Title</label>
              <input
                type="text"
                value={newClass.title}
                onChange={(e) => setNewClass({...newClass, title: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                placeholder="Enter class title"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Instructor</label>
              <input
                type="text"
                value={newClass.instructor}
                onChange={(e) => setNewClass({...newClass, instructor: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                placeholder="Instructor name"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Schedule</label>
              <input
                type="text"
                value={newClass.schedule}
                onChange={(e) => setNewClass({...newClass, schedule: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                placeholder="e.g., Mon, Wed, Fri - 6:00 PM"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Duration</label>
              <input
                type="text"
                value={newClass.duration}
                onChange={(e) => setNewClass({...newClass, duration: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                placeholder="e.g., 8 weeks"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={newClass.startDate}
                onChange={(e) => setNewClass({...newClass, startDate: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Level</label>
              <select
                value={newClass.level}
                onChange={(e) => setNewClass({...newClass, level: e.target.value})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all">All Levels</option>
              </select>
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Capacity</label>
              <input
                type="number"
                value={newClass.capacity}
                onChange={(e) => setNewClass({...newClass, capacity: parseInt(e.target.value)})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">Price ($)</label>
              <input
                type="number"
                value={newClass.price}
                onChange={(e) => setNewClass({...newClass, price: parseFloat(e.target.value)})}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                min="0"
                step="0.01"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-white font-medium mb-2">Description</label>
            <textarea
              value={newClass.description}
              onChange={(e) => setNewClass({...newClass, description: e.target.value})}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
              rows="4"
              placeholder="Class description"
            />
          </div>

          {/* Tags Section */}
          <div className="mt-6">
            <label className="block text-white font-medium mb-2">Tags</label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                placeholder="Add a tag"
              />
              <button
                onClick={addTag}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {newClass.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-orange-400 hover:text-orange-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex space-x-4 mt-6">
            <button
              onClick={editingClass ? handleUpdateClass : handleAddClass}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              {editingClass ? 'Update Class' : 'Create Class'}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Classes List */}
      <div className="bg-gray-900/60 rounded-xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">All Classes</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Class</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Schedule</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Enrollment</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Level</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Status</th>
                <th className="text-left py-3 px-6 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classData) => (
                <tr key={classData.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="py-4 px-6">
                    <div>
                      <div className="text-white font-medium">{classData.title}</div>
                      <div className="text-gray-400 text-sm">{classData.instructor}</div>
                      <div className="text-orange-500 text-sm">${classData.price}</div>
                      <div className="flex space-x-1 mt-1">
                        {classData.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="bg-gray-700 text-gray-300 px-2 py-0.5 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white">{classData.schedule}</div>
                    <div className="text-gray-400 text-sm">{classData.duration}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-white">{classData.enrolled}/{classData.capacity}</div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-1">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(classData.enrolled / classData.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      classData.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                      classData.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                      classData.level === 'advanced' ? 'bg-red-500/20 text-red-400' :
                      'bg-blue-500/20 text-blue-400'
                    }`}>
                      {classData.level}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      classData.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {classData.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClass(classData)}
                        className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 px-3 py-1 rounded text-sm transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleClassStatus(classData.id)}
                        className={`px-3 py-1 rounded text-sm transition-colors ${
                          classData.status === 'active'
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {classData.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classData.id)}
                        className="bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1 rounded text-sm transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassManager;
