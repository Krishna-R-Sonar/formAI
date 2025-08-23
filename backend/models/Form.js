// formAI/backend/models/Form.js
const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  questions: [
    {
      type: { type: String, enum: ['text', 'mcq', 'checkbox', 'dropdown', 'file', 'rating'], required: true },
      label: { type: String, required: true },
      options: { type: [String], default: [] }, // For mcq, checkbox, dropdown
      required: { type: Boolean, default: false },
    },
  ],
  theme: {
    primaryColor: { type: String, default: '#3B82F6' },
    logoUrl: { type: String },
  },
  isPublic: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Create compound index to prevent duplicate titles per user
formSchema.index({ userId: 1, title: 1 }, { unique: true });

// Add validation to ensure title is not empty or just whitespace
formSchema.path('title').validate(function(value) {
  return value && value.trim().length > 0;
}, 'Form title cannot be empty');

module.exports = mongoose.model('Form', formSchema);
