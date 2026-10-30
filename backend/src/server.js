const app = require('./app');
const env = require('./config/env');

const PORT = env.PORT || 5000;
const HOST = '0.0.0.0';

const server = app.listen(PORT, HOST, () => {
  console.log(`====================================================`);
  console.log(`🚀 ResearchForge AI Backend Server Running`);
  console.log(`📡 URL: http://${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${env.NODE_ENV}`);
  console.log(`🛡️  CORS Allowed Origin: ${env.CLIENT_URL}`);
  console.log(`====================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

