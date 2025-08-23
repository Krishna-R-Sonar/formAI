const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  data: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
  ip: { type: String },
  spamScore: { type: Number, default: 0 }, // AI-assessed spam score (0-1)
  anomalyReason: { type: String, default: '' }, // AI-detected reason if response is an anomaly
});

module.exports = mongoose.model('Response', responseSchema);
