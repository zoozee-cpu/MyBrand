'use strict';

const cors = require('cors');

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: Origin ${origin} not allowed.`));
  },
  methods:          ['GET', 'POST', 'OPTIONS'],
  allowedHeaders:   ['Content-Type', 'Authorization'],
  credentials:      true,
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
