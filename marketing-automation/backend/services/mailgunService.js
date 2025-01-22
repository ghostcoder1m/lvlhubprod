const formData = require('form-data');
const Mailgun = require('mailgun.js');

class MailgunService {
  constructor() {
    this.mailgun = new Mailgun(formData);
    this.client = this.mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
    });
    this.domain = process.env.MAILGUN_DOMAIN;
    this.isSandbox = this.domain.includes('sandbox');
  }

  async sendEmail(data) {
    try {
      // Validate required fields
      if (!data.to || !data.subject || !data.html) {
        return {
          success: false,
          error: 'Missing required fields: to, subject, and html are required'
        };
      }

      // Handle the from address properly
      let fromAddress;
      if (data.fromName && data.fromEmail) {
        // If user provides their name and email, use it with proper formatting
        fromAddress = `${data.fromName} <${data.fromEmail}@${this.domain}>`;
      } else if (data.fromName) {
        // If only name is provided, use it with the default domain
        fromAddress = `${data.fromName} <noreply@${this.domain}>`;
      } else if (data.from) {
        // For backward compatibility
        fromAddress = data.from;
      } else {
        // Default fallback
        fromAddress = `Marketing Automation <noreply@${this.domain}>`;
      }

      const messageData = {
        from: fromAddress,
        to: data.to,
        subject: data.subject,
        html: data.html,
        'h:Reply-To': data.replyTo || data.fromEmail, // Allow replies to original sender
        'o:tracking': true,
        'o:tracking-clicks': true,
        'o:tracking-opens': true,
        'o:tag': data.tags || ['marketing-automation'],
        'v:user_id': data.userId || 'anonymous',
        'v:campaign_id': data.campaignId || 'none'
      };

      // Add custom headers if provided
      if (data.headers) {
        Object.keys(data.headers).forEach(key => {
          messageData[`h:${key}`] = data.headers[key];
        });
      }

      console.log('Attempting to send email to:', data.to);
      const response = await this.client.messages.create(this.domain, messageData);
      console.log('Email sent successfully:', response.id);
      
      return { 
        success: true, 
        messageId: response.id,
        from: fromAddress,
        to: data.to,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return { 
        success: false, 
        error: error.message,
        details: error.details || {}
      };
    }
  }

  async addDomain(domain) {
    try {
      const response = await this.client.domains.create({
        name: domain,
        spam_action: 'tag',
        wildcard: true,
      });
      return { success: true, domain: response };
    } catch (error) {
      console.error('Error adding domain:', error);
      return { success: false, error: error.message };
    }
  }

  async verifyDomain(domain) {
    try {
      const response = await this.client.domains.get(domain);
      return { success: true, status: response.domain.state };
    } catch (error) {
      console.error('Error verifying domain:', error);
      return { success: false, error: error.message };
    }
  }

  async getDomainStats(domain) {
    try {
      const response = await this.client.stats.getDomain(domain);
      return { success: true, stats: response };
    } catch (error) {
      console.error('Error getting domain stats:', error);
      return { success: false, error: error.message };
    }
  }

  async validateEmail(email) {
    try {
      const response = await this.client.validate.get(email);
      return { success: true, isValid: response.is_valid };
    } catch (error) {
      console.error('Error validating email:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new MailgunService(); 