import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns';

const ContentCalendar = ({ posts, onUpdatePost, onDeletePost }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState(null);

  // Generate calendar days
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Platform colors
  const platformColors = {
    facebook: 'bg-blue-100 text-blue-800 border-blue-200',
    instagram: 'bg-pink-100 text-pink-800 border-pink-200',
    twitter: 'bg-sky-100 text-sky-800 border-sky-200',
    linkedin: 'bg-blue-100 text-blue-800 border-blue-200'
  };

  // Group posts by date
  const postsByDate = posts.reduce((acc, post) => {
    const date = format(parseISO(post.scheduledFor), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(post);
    return acc;
  }, {});

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-semibold text-gray-900">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <span className="material-icons">chevron_left</span>
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => {/* Handle new post */}}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <span className="material-icons mr-2">add</span>
            New Post
          </button>
        </div>

        {/* Platform Legend */}
        <div className="flex items-center space-x-4 mt-4">
          {Object.entries(platformColors).map(([platform, colors]) => (
            <div key={platform} className="flex items-center">
              <span className={`w-3 h-3 rounded-full ${colors.split(' ')[0]}`}></span>
              <span className="ml-2 text-sm text-gray-600 capitalize">{platform}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-sm font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-4">
          {calendarDays.map((day, index) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const dayPosts = postsByDate[dateKey] || [];
            
            return (
              <div
                key={dateKey}
                className={`min-h-[120px] p-2 border rounded-lg ${
                  !isSameMonth(day, currentDate)
                    ? 'bg-gray-50 border-gray-100'
                    : isToday(day)
                    ? 'bg-indigo-50 border-indigo-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="text-right">
                  <span className={`text-sm ${
                    !isSameMonth(day, currentDate)
                      ? 'text-gray-400'
                      : isToday(day)
                      ? 'text-indigo-600 font-semibold'
                      : 'text-gray-900'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>

                {/* Posts for the day */}
                <div className="mt-2 space-y-1">
                  {dayPosts.map(post => (
                    <div
                      key={post.id}
                      onClick={() => setSelectedPost(post)}
                      className={`p-2 rounded cursor-pointer text-xs border ${
                        platformColors[post.platform]
                      } hover:opacity-80 transition-opacity`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="material-icons text-sm">
                          {post.platform === 'facebook' ? 'facebook' :
                           post.platform === 'instagram' ? 'photo_camera' :
                           post.platform === 'twitter' ? 'twitter' : 'work'}
                        </span>
                        <span>{format(parseISO(post.scheduledFor), 'HH:mm')}</span>
                      </div>
                      <p className="mt-1 line-clamp-2">{post.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-gray-900">Post Details</h3>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="material-icons">close</span>
                </button>
              </div>

              <div className="mt-4">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${platformColors[selectedPost.platform]}`}>
                    {selectedPost.platform}
                  </span>
                  <span className="text-gray-600">
                    {format(parseISO(selectedPost.scheduledFor), 'PPp')}
                  </span>
                </div>

                <div className="prose max-w-none">
                  <p>{selectedPost.content}</p>
                </div>

                {selectedPost.media && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {selectedPost.media.map((item, index) => (
                      <img
                        key={index}
                        src={item.url}
                        alt={item.alt || 'Post media'}
                        className="rounded-lg w-full h-48 object-cover"
                      />
                    ))}
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      onDeletePost(selectedPost.id);
                      setSelectedPost(null);
                    }}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => {/* Handle edit */}}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Edit Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendar; 