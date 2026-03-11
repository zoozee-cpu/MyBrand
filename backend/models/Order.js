'use strict';

const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id:        { type: String, required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  qty:       { type: Number, required: true, min: 1 },
  lineTotal: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  items: {
    type: [itemSchema],
    required: true,
    validate: { validator: v => v.length > 0, message: 'Order must have at least one item.' }
  },
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  source:          { type: String, default: 'whatsapp' },
  customerName:    { type: String, default: null },
  deliveryAddress: { type: String, default: null },
  createdAt:       { type: Date, default: Date.now, index: true },
  updatedAt:       { type: Date, default: Date.now }
});

// Update updatedAt on save
orderSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
