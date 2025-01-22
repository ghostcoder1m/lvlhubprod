const express = require('express');
const router = express.Router();
const mailgunService = require('../services/mailgunService');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Add a new domain
router.post('/domains', async (req, res) => {
  try {
    const { domain } = req.body;
    const result = await mailgunService.addDomain(domain);
    
    if (result.success) {
      res.json({ success: true, domain: result.domain });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify domain setup
router.post('/domains/:domain/verify', async (req, res) => {
  try {
    const { domain } = req.params;
    const result = await mailgunService.verifyDomain(domain);
    
    if (result.success) {
      res.json({ success: true, status: result.status });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get domain stats
router.get('/domains/:domain/stats', async (req, res) => {
  try {
    const { domain } = req.params;
    const result = await mailgunService.getDomainStats(domain);
    
    if (result.success) {
      res.json({ success: true, stats: result.stats });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send an email
router.post('/send', async (req, res) => {
  try {
    const { 
      to, 
      subject, 
      html, 
      fromName,
      fromEmail,
      replyTo,
      tags,
      userId,
      campaignId,
      headers 
    } = req.body;
    
    if (!to || !subject || !html) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: to, subject, and html are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipient email format'
      });
    }

    // If fromEmail is provided, validate its format
    if (fromEmail && !emailRegex.test(fromEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid sender email format'
      });
    }

    const result = await mailgunService.sendEmail({ 
      to, 
      subject, 
      html, 
      fromName,
      fromEmail,
      replyTo,
      tags,
      userId,
      campaignId,
      headers
    });
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error,
        details: result.details
      });
    }
    
    // Store in email logs
    try {
      const emailLogs = JSON.parse(localStorage.getItem('email_logs') || '[]');
      emailLogs.push({
        ...result,
        subject,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('email_logs', JSON.stringify(emailLogs));
    } catch (error) {
      console.warn('Failed to store email log:', error);
    }

    res.json({ 
      success: true, 
      messageId: result.messageId,
      from: result.from,
      to: result.to,
      timestamp: result.timestamp
    });
  } catch (error) {
    console.error('Error in /send route:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send email',
      details: error.message 
    });
  }
});

// Validate email address
router.post('/validate', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await mailgunService.validateEmail(email);
    
    if (result.success) {
      res.json({ success: true, isValid: result.isValid });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get email logs
router.get('/logs', async (req, res) => {
  try {
    const emailLogs = JSON.parse(localStorage.getItem('email_logs') || '[]');
    res.json({
      success: true,
      logs: emailLogs
    });
  } catch (error) {
    console.error('Error getting email logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get email logs'
    });
  }
});

// Generate email content using OpenAI
router.post('/generate-content', async (req, res) => {
  try {
    const { messages } = req.body;

    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedContent = completion.data.choices[0].message.content;

    res.json({
      success: true,
      content: generatedContent
    });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content'
    });
  }
});

module.exports = router; 