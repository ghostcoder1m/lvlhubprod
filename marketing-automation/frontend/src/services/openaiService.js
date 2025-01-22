import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class OpenAIService {
  async generateImage(prompt) {
    try {
      const response = await axios.post(`${API_URL}/openai/generate-image`, {
        prompt,
        n: 1,
        size: '1024x1024'
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  async generateContent({ platform, topic, tone, length }) {
    try {
      const response = await axios.post(`${API_URL}/openai/generate-content`, {
        platform,
        topic,
        tone,
        length,
        systemPrompt: this.getSystemPrompt(platform, tone)
      });
      return response.data.content;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }

  async generateHashtags(content) {
    try {
      const response = await axios.post(`${API_URL}/openai/generate-hashtags`, {
        content
      });
      return response.data.hashtags;
    } catch (error) {
      console.error('Error generating hashtags:', error);
      throw error;
    }
  }

  async improveContent(content, platform) {
    try {
      const response = await axios.post(`${API_URL}/openai/improve-content`, {
        content,
        platform,
        maxTokens: this.getMaxTokens(platform)
      });
      return response.data.improvedContent;
    } catch (error) {
      console.error('Error improving content:', error);
      throw error;
    }
  }

  getSystemPrompt(platform, tone) {
    const prompts = {
      twitter: `You are a Twitter expert who creates engaging tweets. Write in a ${tone} tone, use appropriate emojis, and keep it under 280 characters.`,
      facebook: `You are a Facebook expert who creates engaging posts. Write in a ${tone} tone, use appropriate emojis, and optimize for engagement.`,
      instagram: `You are an Instagram expert who creates engaging captions. Write in a ${tone} tone, use appropriate emojis, and make it visually appealing with line breaks.`,
      linkedin: `You are a LinkedIn expert who creates professional content. Write in a ${tone} tone, focus on business value, and maintain professional credibility.`
    };
    return prompts[platform];
  }

  getMaxTokens(platform) {
    const tokenLimits = {
      twitter: 100,
      facebook: 500,
      instagram: 400,
      linkedin: 600
    };
    return tokenLimits[platform];
  }
}

export default new OpenAIService(); 