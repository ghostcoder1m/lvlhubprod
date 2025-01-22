import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class OAuthService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // OAuth configuration for different platforms
    this.platforms = {
      facebook: {
        authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
        scope: ['pages_manage_posts', 'pages_read_engagement', 'instagram_basic', 'instagram_content_publish'],
        responseType: 'code'
      },
      instagram: {
        authUrl: 'https://api.instagram.com/oauth/authorize',
        scope: ['basic', 'comments', 'relationships', 'public_content'],
        responseType: 'code'
      },
      twitter: {
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        scope: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
        responseType: 'code'
      },
      linkedin: {
        authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
        scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social'],
        responseType: 'code'
      }
    };
  }

  // Initialize OAuth flow
  initializeOAuth(platform) {
    const config = this.platforms[platform];
    if (!config) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const params = new URLSearchParams({
      client_id: process.env[`REACT_APP_${platform.toUpperCase()}_CLIENT_ID`],
      redirect_uri: `${window.location.origin}/oauth/callback/${platform}`,
      response_type: config.responseType,
      scope: config.scope.join(' '),
      state: this.generateState(platform)
    });

    return `${config.authUrl}?${params.toString()}`;
  }

  // Generate state parameter for security
  generateState(platform) {
    const state = {
      platform,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substring(2)
    };
    return btoa(JSON.stringify(state));
  }

  // Validate state parameter
  validateState(state) {
    try {
      const decoded = JSON.parse(atob(state));
      const now = Date.now();
      const stateAge = now - decoded.timestamp;
      
      // State is valid for 5 minutes
      return stateAge < 300000;
    } catch {
      return false;
    }
  }

  // Exchange authorization code for access token
  async exchangeCodeForToken(platform, code) {
    const response = await this.api.post('/oauth/token', {
      platform,
      code,
      redirect_uri: `${window.location.origin}/oauth/callback/${platform}`
    });
    return response.data;
  }

  // Refresh access token
  async refreshToken(platform, refreshToken) {
    const response = await this.api.post('/oauth/refresh', {
      platform,
      refresh_token: refreshToken
    });
    return response.data;
  }

  // Revoke access token
  async revokeAccess(platform, accountId) {
    await this.api.post('/oauth/revoke', {
      platform,
      account_id: accountId
    });
  }

  // Get connected accounts
  async getConnectedAccounts() {
    const response = await this.api.get('/oauth/accounts');
    return response.data;
  }

  // Check connection status
  async checkConnectionStatus(platform, accountId) {
    const response = await this.api.get(`/oauth/status/${platform}/${accountId}`);
    return response.data;
  }

  // Handle OAuth callback
  async handleCallback(platform, params) {
    if (!this.validateState(params.state)) {
      throw new Error('Invalid state parameter');
    }

    if (params.error) {
      throw new Error(`OAuth error: ${params.error}`);
    }

    return this.exchangeCodeForToken(platform, params.code);
  }
}

export default new OAuthService(); 