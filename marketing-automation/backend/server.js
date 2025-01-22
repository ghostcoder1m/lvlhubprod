require('dotenv').config();
const express = require('express');
const cors = require('cors');
const workflowRoutes = require('./routes/workflow');
const emailRoutes = require('./routes/email');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/workflows', workflowRoutes);
app.use('/api/email', emailRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Something went wrong!' });
});

// Try different ports if default port is in use
const startServer = (port) => {
  // Ensure port stays within valid range (1-65535)
  if (port >= 65535) {
    console.error('No available ports found');
    process.exit(1);
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
};

const PORT = parseInt(process.env.PORT || '5001', 10);
startServer(PORT); 