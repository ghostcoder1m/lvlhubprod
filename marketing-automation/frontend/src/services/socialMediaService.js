import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class SocialMediaService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Account Management
  async connectAccount(platform, authCode) {
    const response = await this.api.post('/social/connect', { platform, authCode });
    return response.data;
  }

  async disconnectAccount(accountId) {
    await this.api.delete(`/social/accounts/${accountId}`);
  }

  async getConnectedAccounts() {
    const response = await this.api.get('/social/accounts');
    return response.data;
  }

  // Post Management
  async createPost(postData) {
    const response = await this.api.post('/social/posts', postData);
    return response.data;
  }

  async schedulePost(postId, scheduleData) {
    const response = await this.api.post(`/social/posts/${postId}/schedule`, scheduleData);
    return response.data;
  }

  async getScheduledPosts(filters = {}) {
    const response = await this.api.get('/social/posts/scheduled', { params: filters });
    return response.data;
  }

  async updatePost(postId, postData) {
    const response = await this.api.put(`/social/posts/${postId}`, postData);
    return response.data;
  }

  async deletePost(postId) {
    await this.api.delete(`/social/posts/${postId}`);
  }

  // Content Library
  async uploadMedia(file, metadata) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await this.api.post('/social/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async getMediaLibrary(filters = {}) {
    const response = await this.api.get('/social/media', { params: filters });
    return response.data;
  }

  // Analytics
  async getAccountAnalytics(accountId, timeframe = '30d') {
    const response = await this.api.get(`/social/analytics/accounts/${accountId}`, {
      params: { timeframe }
    });
    return response.data;
  }

  async getPostAnalytics(postId) {
    const response = await this.api.get(`/social/analytics/posts/${postId}`);
    return response.data;
  }

  async getEngagementMetrics(filters = {}) {
    const response = await this.api.get('/social/analytics/engagement', { params: filters });
    return response.data;
  }

  // Monitoring
  async getActivityFeed(accountId) {
    const response = await this.api.get(`/social/monitoring/${accountId}/feed`);
    return response.data;
  }

  async getMentions(filters = {}) {
    const response = await this.api.get('/social/monitoring/mentions', { params: filters });
    return response.data;
  }

  async getNotifications() {
    const response = await this.api.get('/social/notifications');
    return response.data;
  }

  // Automation
  async createAutomation(automationData) {
    const response = await this.api.post('/social/automations', automationData);
    return response.data;
  }

  async getAutomations() {
    const response = await this.api.get('/social/automations');
    return response.data;
  }

  async toggleAutomation(automationId, enabled) {
    const response = await this.api.patch(`/social/automations/${automationId}`, { enabled });
    return response.data;
  }

  // Platform-specific utilities
  async getHashtagSuggestions(keyword, platform) {
    const response = await this.api.get('/social/utils/hashtags', {
      params: { keyword, platform }
    });
    return response.data;
  }

  async getBestPostingTimes(accountId) {
    const response = await this.api.get(`/social/utils/best-times/${accountId}`);
    return response.data;
  }

  // Bulk Operations
  async bulkSchedulePosts(posts) {
    const response = await this.api.post('/social/posts/bulk-schedule', { posts });
    return response.data;
  }

  async bulkDeletePosts(postIds) {
    await this.api.post('/social/posts/bulk-delete', { postIds });
  }
}

export default new SocialMediaService(); 