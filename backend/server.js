const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const cron = require('node-cron');
const User = require('./models/User');
const Response = require('./models/Response');
const authRoutes = require('./routes/auth');
const formRoutes = require('./routes/forms');
const aiRoutes = require('./routes/ai');
const settingsRoutes = require('./routes/settings');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.info('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/settings', settingsRoutes);

// Cron job: Daily at midnight, delete expired responses
cron.schedule('0 0 * * *', async () => {
  console.info('Running data cleanup');
  try {
    const users = await User.find({ dataRetentionDays: { $gt: 0 } });
    for (const user of users) {
      const threshold = new Date();
      threshold.setDate(threshold.getDate() - user.dataRetentionDays);
      await Response.deleteMany({
        userId: user._id,
        createdAt: { $lt: threshold },
      });
    }
  } catch (err) {
    console.error('Cleanup error:', err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
