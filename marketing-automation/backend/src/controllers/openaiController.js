const OpenAI = require('openai');
const dotenv = require('dotenv');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Generate image using DALL-E
exports.generateImage = async (req, res) => {
  try {
    const { prompt, n = 1, size = '1024x1024' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const response = await openai.images.generate({
      prompt,
      n,
      size,
      response_format: 'url'
    });

    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Failed to generate image', details: error.message });
  }
};

// Generate social media content
exports.generateContent = async (req, res) => {
  try {
    const { platform, topic, tone, length, systemPrompt } = req.body;

    if (!platform || !topic) {
      return res.status(400).json({ error: 'Platform and topic are required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Create a ${length} ${platform} post about: ${topic}` }
      ],
      temperature: 0.7,
      max_tokens: getMaxTokens(platform)
    });

    res.json({ content: response.choices[0].message.content });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content', details: error.message });
  }
};

// Generate hashtags
exports.generateHashtags = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a social media expert who creates relevant, trending hashtags. Generate 3-5 relevant hashtags for the given content. Return only the hashtags, separated by spaces.'
        },
        { role: 'user', content }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    res.json({ hashtags: response.choices[0].message.content });
  } catch (error) {
    console.error('Error generating hashtags:', error);
    res.status(500).json({ error: 'Failed to generate hashtags', details: error.message });
  }
};

// Improve content
exports.improveContent = async (req, res) => {
  try {
    const { content, platform, maxTokens } = req.body;

    if (!content || !platform) {
      return res.status(400).json({ error: 'Content and platform are required' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a ${platform} expert. Improve the given content following ${platform}'s best practices while maintaining the original message. Consider character limits, formatting, and engagement best practices.`
        },
        { role: 'user', content }
      ],
      temperature: 0.7,
      max_tokens: maxTokens || 500
    });

    res.json({ improvedContent: response.choices[0].message.content });
  } catch (error) {
    console.error('Error improving content:', error);
    res.status(500).json({ error: 'Failed to improve content', details: error.message });
  }
};

// Helper function to get max tokens based on platform
function getMaxTokens(platform) {
  const tokenLimits = {
    twitter: 100,
    facebook: 500,
    instagram: 400,
    linkedin: 600
  };
  return tokenLimits[platform] || 500;
} 