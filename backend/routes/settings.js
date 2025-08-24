// File: formAI/backend/routes/settings.js
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).send('Invalid token');
  }
};

router.post('/retention', authenticate, async (req, res) => {
  try {
    const { days } = req.body;
    const user = await User.findById(req.userId);
    user.dataRetentionDays = Number(days);
    await user.save();
    res.send('Retention updated');
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/retention', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json({ days: user.dataRetentionDays });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;