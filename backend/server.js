'use strict';

const express   = require('express');
const mongoose  = require('mongoose');
const rateLimit = require('express-rate-limit');
const corsMiddleware = require('./middleware/cors');
const errorHandler   = require('./middleware/errorHandler');
const ordersRouter   = require('./routes/orders');
const healthRouter   = require('./routes/health');
const connectDB      = require('./config/db');
require('dotenv').config();

const app = express();

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(corsMiddleware);
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// ─── RATE LIMITER ─────────────────────────────────────────────
const orderLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again in a minute.' }
});

// ─── ROUTES ───────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/orders', orderLimiter, ordersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// ─── GLOBAL ERROR HANDLER ─────────────────────────────────────
app.use(errorHandler);

// ─── START SERVER ─────────────────────────────────────────────
const PORT = process.env.PORT || 3000;

async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🌿 ZKS Fragrances API running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
