const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openaiController');

// Image generation endpoint
router.post('/generate-image', openaiController.generateImage);

// Content generation endpoint
router.post('/generate-content', openaiController.generateContent);

// Hashtag generation endpoint
router.post('/generate-hashtags', openaiController.generateHashtags);

// Content improvement endpoint
router.post('/improve-content', openaiController.improveContent);

module.exports = router; 