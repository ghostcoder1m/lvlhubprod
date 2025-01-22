import React, { useState } from 'react';
import { toast } from 'react-toastify';
import openaiService from '../../services/openaiService';

const AIContentGenerator = ({ onContentGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [imagePrompt, setImagePrompt] = useState('');
  const [contentForm, setContentForm] = useState({
    platform: 'twitter',
    topic: '',
    tone: 'professional',
    length: 'short'
  });
  const [generatedImage, setGeneratedImage] = useState(null);

  const platforms = [
    { id: 'twitter', name: 'Twitter', maxLength: 280 },
    { id: 'facebook', name: 'Facebook', maxLength: 2000 },
    { id: 'instagram', name: 'Instagram', maxLength: 2200 },
    { id: 'linkedin', name: 'LinkedIn', maxLength: 3000 }
  ];

  const tones = [
    { id: 'professional', name: 'Professional' },
    { id: 'casual', name: 'Casual' },
    { id: 'humorous', name: 'Humorous' },
    { id: 'formal', name: 'Formal' }
  ];

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Please enter an image prompt');
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await openaiService.generateImage(imagePrompt);
      setGeneratedImage(imageUrl);
      toast.success('Image generated successfully!');
    } catch (error) {
      toast.error('Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!contentForm.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      // Generate main content
      const content = await openaiService.generateContent(contentForm);
      
      // Generate hashtags if platform is Instagram or Twitter
      let hashtags = '';
      if (['instagram', 'twitter'].includes(contentForm.platform)) {
        hashtags = await openaiService.generateHashtags(content);
      }

      // Combine content and hashtags
      const finalContent = hashtags ? `${content}\n\n${hashtags}` : content;

      // Improve content based on platform best practices
      const improvedContent = await openaiService.improveContent(finalContent, contentForm.platform);

      onContentGenerated({
        content: improvedContent,
        image: generatedImage,
        platform: contentForm.platform
      });

      toast.success('Content generated successfully!');
    } catch (error) {
      toast.error('Failed to generate content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">AI Content Generator</h2>

      {/* Image Generation Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Image with DALL-E</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image Description
            </label>
            <textarea
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder="Describe the image you want to generate..."
            />
          </div>
          <button
            onClick={handleGenerateImage}
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Image'}
          </button>
          {generatedImage && (
            <div className="mt-4">
              <img
                src={generatedImage}
                alt="Generated content"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Content Generation Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Generate Social Media Content</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform
              </label>
              <select
                value={contentForm.platform}
                onChange={(e) => setContentForm({ ...contentForm, platform: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {platforms.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={contentForm.tone}
                onChange={(e) => setContentForm({ ...contentForm, tone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {tones.map(tone => (
                  <option key={tone.id} value={tone.id}>
                    {tone.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Topic or Key Message
            </label>
            <textarea
              value={contentForm.topic}
              onChange={(e) => setContentForm({ ...contentForm, topic: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              rows="3"
              placeholder="What would you like to post about?"
            />
          </div>
          <button
            onClick={handleGenerateContent}
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Content'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIContentGenerator; 