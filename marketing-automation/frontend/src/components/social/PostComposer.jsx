import React, { useState } from 'react';
import { toast } from 'react-toastify';
import AIContentGenerator from './AIContentGenerator';

const PostComposer = ({ accounts, onCreatePost, onUploadMedia }) => {
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [postForm, setPostForm] = useState({
    content: '',
    scheduledFor: '',
    platforms: [],
    media: []
  });

  const handlePlatformToggle = (platform) => {
    setPostForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleMediaUpload = async (event) => {
    const files = Array.from(event.target.files);
    try {
      const uploadedMedia = await Promise.all(
        files.map(file => onUploadMedia(file))
      );
      setPostForm(prev => ({
        ...prev,
        media: [...prev.media, ...uploadedMedia]
      }));
      toast.success('Media uploaded successfully');
    } catch (error) {
      toast.error('Error uploading media');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!postForm.content.trim()) {
      toast.error('Please enter post content');
      return;
    }
    if (postForm.platforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    try {
      await onCreatePost(postForm);
      setPostForm({
        content: '',
        scheduledFor: '',
        platforms: [],
        media: []
      });
      toast.success('Post created successfully');
    } catch (error) {
      toast.error('Error creating post');
    }
  };

  const handleAIContentGenerated = ({ content, image, platform }) => {
    setPostForm(prev => ({
      ...prev,
      content,
      platforms: [platform],
      media: image ? [...prev.media, { url: image, type: 'image' }] : prev.media
    }));
    setShowAIGenerator(false);
  };

  return (
    <div className="space-y-6">
      {/* AI Generator Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAIGenerator(!showAIGenerator)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700"
        >
          <span className="material-icons mr-2">auto_awesome</span>
          {showAIGenerator ? 'Hide AI Generator' : 'Use AI Generator'}
        </button>
      </div>

      {/* AI Content Generator */}
      {showAIGenerator && (
        <AIContentGenerator onContentGenerated={handleAIContentGenerated} />
      )}

      {/* Manual Post Composer */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Compose Post</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Platforms
            </label>
            <div className="flex flex-wrap gap-4">
              {accounts.map(account => (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => handlePlatformToggle(account.platform)}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    postForm.platforms.includes(account.platform)
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-icons mr-2">
                    {account.platform === 'facebook' ? 'facebook' :
                     account.platform === 'instagram' ? 'photo_camera' :
                     account.platform === 'twitter' ? 'twitter' : 'work'}
                  </span>
                  {account.username}
                </button>
              ))}
            </div>
          </div>

          {/* Content Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Post Content
            </label>
            <textarea
              value={postForm.content}
              onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="What would you like to share?"
            />
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Media
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                <span className="material-icons mr-2">add_photo_alternate</span>
                Add Media
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaUpload}
                />
              </label>
              {postForm.media.length > 0 && (
                <span className="text-sm text-gray-600">
                  {postForm.media.length} file(s) selected
                </span>
              )}
            </div>
            {postForm.media.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {postForm.media.map((media, index) => (
                  <div key={index} className="relative">
                    <img
                      src={media.url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setPostForm(prev => ({
                        ...prev,
                        media: prev.media.filter((_, i) => i !== index)
                      }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <span className="material-icons text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Schedule Post
            </label>
            <input
              type="datetime-local"
              value={postForm.scheduledFor}
              onChange={(e) => setPostForm({ ...postForm, scheduledFor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Schedule Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostComposer; 