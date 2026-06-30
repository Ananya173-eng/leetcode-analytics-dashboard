import User from '../models/User.js';
import LeetCodeData from '../models/LeetCodeData.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'super_secret_codepulse_key_123';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

// SIGN UP
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // Default avatar
    const avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`;

    const user = new User({
      username,
      email,
      password: hashedPassword,
      avatar,
      goals: {
        dailyTarget: 2,
        weeklyTarget: 10,
        monthlyTarget: 40,
        dailyProgress: 0,
        weeklyProgress: 0,
        monthlyProgress: 0
      }
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        leetcodeUsername: user.leetcodeUsername,
        goals: user.goals,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Internal server error during signup' });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).populate('friends', 'username email avatar leetcodeUsername');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Google-only users might not have a password set
    if (!user.password) {
      return res.status(400).json({ message: 'Please sign in using Google' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        leetcodeUsername: user.leetcodeUsername,
        goals: user.goals,
        createdAt: user.createdAt,
        friends: user.friends,
        bookmarks: user.bookmarks,
        journal: user.journal,
        achievements: user.achievements
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error during login' });
  }
};

// MOCK GOOGLE AUTH LOGIN
export const googleAuth = async (req, res) => {
  try {
    const { email, username, googleId, avatar } = req.body;

    if (!email || !username) {
      return res.status(400).json({ message: 'Google email and profile info are required' });
    }

    let user = await User.findOne({ email }).populate('friends', 'username email avatar leetcodeUsername');

    if (!user) {
      // Create user if they don't exist
      user = new User({
        username,
        email,
        googleId,
        avatar: avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`,
        goals: {
          dailyTarget: 2,
          weeklyTarget: 10,
          monthlyTarget: 40,
          dailyProgress: 0,
          weeklyProgress: 0,
          monthlyProgress: 0
        }
      });
      await user.save();
    } else if (!user.googleId && googleId) {
      // Link google account if they registered with email previously
      user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save();
    }

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        leetcodeUsername: user.leetcodeUsername,
        goals: user.goals,
        createdAt: user.createdAt,
        friends: user.friends,
        bookmarks: user.bookmarks,
        journal: user.journal,
        achievements: user.achievements
      }
    });
  } catch (err) {
    console.error('Google Auth error:', err);
    res.status(500).json({ message: 'Internal server error during Google Authentication' });
  }
};

// GET ME
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('friends', 'username email avatar leetcodeUsername');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error('GetMe error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
