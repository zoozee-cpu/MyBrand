'use strict';

const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose');

// GET /api/health
router.get('/', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status:    'ok',
    service:   'ZKS Fragrances API',
    database:  dbStatus,
    timestamp: new Date().toISOString(),
    uptime:    Math.floor(process.uptime()) + 's'
  });
});

module.exports = router;
