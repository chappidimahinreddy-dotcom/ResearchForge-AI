const express = require('express');
const router = express.Router();
const { checkDatabaseConnection, isSupabaseConfigured } = require('../database/supabase');
const env = require('../config/env');

const startTime = Date.now();

router.get('/health', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  
  const healthData = {
    status: 'healthy',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '1.0.0',
    services: {
      api: 'operational',
      database: dbStatus.connected ? 'connected' : 'unconfigured_or_disconnected',
      gemini: env.GEMINI_API_KEY && !env.GEMINI_API_KEY.includes('placeholder') ? 'configured' : 'unconfigured',
      webSearch: env.WEB_SEARCH_API_KEY ? 'configured' : 'optional_fallback'
    },
    databaseDetails: dbStatus.message
  };

  res.status(200).json(healthData);
});

module.exports = router;

