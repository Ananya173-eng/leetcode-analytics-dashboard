import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import controllers
import { signup, login, googleAuth, getMe } from './controllers/authController.js';
import { syncLeetCodeProfile, getLeetCodeProfile, compareWithFriend } from './controllers/leetcodeController.js';
import {
  updateGoals,
  getJournal,
  addJournal,
  getBookmarks,
  addBookmark,
  deleteBookmark,
  addFriend,
  getLeaderboards
} from './controllers/dashboardController.js';

// Import middleware
import auth from './middleware/auth.js';

dotenv.config();

const app = express();

// Configure Middleware
app.use(cors({
  origin: '*', // Allow all origins for dev/testing ease
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'CodePulse backend is running successfully' });
});

// Authentication Routes
app.post('/api/auth/signup', signup);
app.post('/api/auth/login', login);
app.post('/api/auth/google', googleAuth);
app.get('/api/auth/me', auth, getMe);

// LeetCode Integration Routes
app.post('/api/leetcode/sync', auth, syncLeetCodeProfile);
app.get('/api/leetcode/profile', auth, getLeetCodeProfile);
app.get('/api/leetcode/compare/:friendId', auth, compareWithFriend);

// Goals, Journal, Bookmarks, Friends & Leaderboard Routes
app.put('/api/dashboard/goals', auth, updateGoals);
app.get('/api/dashboard/journal', auth, getJournal);
app.post('/api/dashboard/journal', auth, addJournal);
app.get('/api/dashboard/bookmarks', auth, getBookmarks);
app.post('/api/dashboard/bookmarks', auth, addBookmark);
app.delete('/api/dashboard/bookmarks/:id', auth, deleteBookmark);
app.post('/api/dashboard/friends/add', auth, addFriend);
app.get('/api/dashboard/leaderboard', auth, getLeaderboards);

// Database connection & start server
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codepulse';

console.log('Connecting to MongoDB...');
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('MongoDB connection established successfully');
    app.listen(PORT, () => {
      console.log(`CodePulse server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('CRITICAL: MongoDB connection failed:', err.message);
    console.warn('Attempting to start server in mock-runtime mode (limited MongoDB storage functionalities)...');
    
    // Fallback to start server even if DB connection fails, so frontend developers can still test
    app.listen(PORT, () => {
      console.log(`CodePulse server running in fallback mock-runtime mode on port ${PORT}`);
    });
  });
