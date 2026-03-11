'use strict';

const Order           = require('../models/Order');
const { appendOrderToSheet } = require('../services/googleSheets');

/**
 * POST /api/orders
 * Create a new order: save to MongoDB + append to Google Sheets
 */
async function createOrder(req, res, next) {
  try {
    const { orderId, items, total, timestamp, source } = req.body;

    // Validation
    if (!orderId || !items || !Array.isArray(items) || items.length === 0 || total == null) {
      return res.status(400).json({ success: false, error: 'Missing required order fields: orderId, items, total.' });
    }

    if (total < 0) {
      return res.status(400).json({ success: false, error: 'Invalid total amount.' });
    }

    // Build structured items
    const structuredItems = items.map(item => ({
      id:        item.id        || 'unknown',
      name:      item.name      || 'Unknown Product',
      price:     Number(item.price) || 0,
      qty:       Number(item.qty)   || 1,
      lineTotal: Number(item.price) * Number(item.qty) || 0
    }));

    // Save to MongoDB
    const order = new Order({
      orderId,
      items: structuredItems,
      total:     Number(total),
      source:    source || 'whatsapp',
      createdAt: timestamp ? new Date(timestamp) : new Date()
    });

    await order.save();

    // Append to Google Sheets (non-blocking — don't fail order if Sheets fails)
    appendOrderToSheet(order).catch(err => {
      console.error('[GoogleSheets] Failed to append order:', err.message);
    });

    return res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      orderId: order.orderId
    });

  } catch (err) {
    // Handle duplicate orderId
    if (err.code === 11000) {
      return res.status(409).json({ success: false, error: 'Order ID already exists.' });
    }
    next(err);
  }
}

module.exports = { createOrder };
