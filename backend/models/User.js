// File: formAI/backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dataRetentionDays: { type: Number, default: 30 }, // 0 for never delete
  formsCreated: { type: Number, default: 0 }, // Track for limits
  totalResponses: { type: Number, default: 0 }, // Track for limits
  totalUploads: { type: Number, default: 0 }, // Bytes, track for limits
});

module.exports = mongoose.model('User', userSchema);
