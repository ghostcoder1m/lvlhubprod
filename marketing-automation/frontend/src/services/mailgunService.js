import axios from 'axios';
import FormData from 'form-data';

class MailgunService {
  constructor() {
    // Default configuration will be overridden by campaign-specific config
    this.defaultConfig = {
      apiKey: process.env.REACT_APP_MAILGUN_API_KEY,
      domain: process.env.REACT_APP_MAILGUN_DOMAIN,
      senderEmail: process.env.REACT_APP_MAILGUN_SENDER_EMAIL
    };
  }

  createClient(config) {
    const { apiKey, domain } = config;
    return axios.create({
      baseURL: `https://api.mailgun.net/v3/${domain}`,
      auth: {
        username: 'api',
        password: apiKey
      }
    });
  }

  async sendEmail(emailData, config) {
    const { apiKey, domain, senderEmail } = config || this.defaultConfig;
    const client = this.createClient({ apiKey, domain });

    try {
      const formData = new FormData();
      formData.append('from', senderEmail);
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('html', emailData.content);

      const response = await client.post('/messages', formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      
      return {
        success: true,
        messageId: response.data.id
      };
    } catch (error) {
      console.error('Mailgun Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to send email');
    }
  }

  async getEmailStats(startDate, endDate, config) {
    const { apiKey, domain } = config || this.defaultConfig;
    const client = this.createClient({ apiKey, domain });

    try {
      const response = await client.get('/stats/total', {
        params: {
          event: ['accepted', 'delivered', 'opened', 'clicked'],
          start: startDate,
          end: endDate
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get email stats:', error);
      throw new Error('Failed to get email statistics');
    }
  }

  async validateDomain(config) {
    const { apiKey, domain } = config || this.defaultConfig;
    const client = this.createClient({ apiKey, domain });

    try {
      const response = await client.get('');
      return response.data.domain.state === 'active';
    } catch (error) {
      if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      } else if (error.response?.status === 404) {
        throw new Error('Domain not found');
      }
      console.error('Failed to validate domain:', error);
      return false;
    }
  }

  async testConfiguration(config) {
    try {
      const isValid = await this.validateDomain(config);
      return {
        success: isValid,
        message: isValid ? 'Configuration is valid' : 'Domain is not active'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
}

export default new MailgunService(); 