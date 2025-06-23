// client/src/components/dashboard/LearnSimple.js
import React, { useState } from 'react';

const LearnSimple = ({ user }) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'Powerlifting Fundamentals',
      description: 'Master the basics of squat, bench press, and deadlift',
      category: 'powerlifting',
      level: 'Beginner',
      duration: '4 weeks',
      lessons: 16,
      enrolled: 2341,
      rating: 4.8,
      progress: 75,
      thumbnail: '🏋️'
    },
    {
      id: 2,
      title: 'Advanced Programming',
      description: 'Learn periodization and program design principles',
      category: 'programming',
      level: 'Advanced',
      duration: '8 weeks',
      lessons: 24,
      enrolled: 892,
      rating: 4.9,
      progress: 0,
      thumbnail: '📊'
    },
    {
      id: 3,
      title: 'Mobility & Recovery',
      description: 'Improve movement quality and recovery strategies',
      category: 'mobility',
      level: 'Intermediate',
      duration: '3 weeks',
      lessons: 12,
      enrolled: 1567,
      rating: 4.7,
      progress: 100,
      thumbnail: '🤸'
    },
    {
      id: 4,
      title: 'Competition Prep',
      description: 'Everything you need to know for your first meet',
      category: 'competition',
      level: 'Intermediate',
      duration: '6 weeks',
      lessons: 20,
      enrolled: 445,
      rating: 4.9,
      progress: 45,
      thumbnail: '🏆'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Courses', icon: '📚' },
    { id: 'powerlifting', label: 'Powerlifting', icon: '🏋️' },
    { id: 'programming', label: 'Programming', icon: '📊' },
    { id: 'mobility', label: 'Mobility', icon: '🤸' },
    { id: 'competition', label: 'Competition', icon: '🏆' }
  ];

  const filteredCourses = courses.filter(course => 
    activeCategory === 'all' || course.category === activeCategory
  );

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'text-green-500 bg-green-500/10';
      case 'Intermediate': return 'text-yellow-500 bg-yellow-500/10';
      case 'Advanced': return 'text-red-500 bg-red-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-white">Learn</h1>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium">
            Browse All Courses
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">3</div>
            <div className="text-gray-300 text-sm">Enrolled</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">1</div>
            <div className="text-gray-300 text-sm">Completed</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">32</div>
            <div className="text-gray-300 text-sm">Lessons</div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg text-center">
            <div className="text-orange-500 text-2xl font-bold">18h</div>
            <div className="text-gray-300 text-sm">Watch Time</div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                activeCategory === category.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCourses.map(course => (
          <div key={course.id} className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{course.thumbnail}</div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${getLevelColor(course.level)}`}>
                      {course.level}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-4">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="text-white">{course.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Lessons:</span>
                  <span className="text-white">{course.lessons}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Students:</span>
                  <span className="text-white">{course.enrolled.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Rating:</span>
                  <span className="text-white">⭐ {course.rating}</span>
                </div>
              </div>

              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Progress</span>
                    <span className="text-orange-500">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button 
                className={`w-full py-3 rounded-lg font-medium ${
                  course.progress > 0
                    ? 'bg-orange-500 hover:bg-orange-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {course.progress === 100 ? 'Review Course' : 
                 course.progress > 0 ? 'Continue Learning' : 'Start Course'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnSimple;
