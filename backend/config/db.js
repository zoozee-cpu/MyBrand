'use strict';

const mongoose = require('mongoose');

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

async function connectDB(attempt = 1) {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI environment variable is not set.');

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });

    console.log(`✓ MongoDB connected (${mongoose.connection.host})`);

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected. Attempting reconnect…');
      setTimeout(() => connectDB(), RETRY_DELAY_MS);
    });

    mongoose.connection.on('error', err => {
      console.error('[MongoDB] Connection error:', err.message);
    });

  } catch (err) {
    console.error(`[MongoDB] Connection attempt ${attempt} failed: ${err.message}`);

    if (attempt < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s… (${attempt}/${MAX_RETRIES})`);
      await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
      return connectDB(attempt + 1);
    }

    console.error('[MongoDB] Max retries exceeded. Exiting.');
    process.exit(1);
  }
}

module.exports = connectDB;
