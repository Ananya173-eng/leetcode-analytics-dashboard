import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  dailyTarget: { type: Number, default: 2 },
  weeklyTarget: { type: Number, default: 10 },
  monthlyTarget: { type: Number, default: 40 },
  dailyProgress: { type: Number, default: 0 },
  weeklyProgress: { type: Number, default: 0 },
  monthlyProgress: { type: Number, default: 0 },
  lastResetDaily: { type: Date, default: Date.now },
  lastResetWeekly: { type: Date, default: Date.now },
  lastResetMonthly: { type: Date, default: Date.now }
});

const journalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problemLink: { type: String },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard', 'None'], default: 'None' },
  notes: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const bookmarkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  notes: { type: String },
  addedAt: { type: Date, default: Date.now }
});

const achievementSchema = new mongoose.Schema({
  badgeId: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String },
  googleId: { type: String, sparse: true },
  username: { type: String, required: true, trim: true },
  avatar: { type: String },
  leetcodeUsername: { type: String, trim: true, default: '' },
  goals: { type: goalSchema, default: () => ({}) },
  journal: [journalSchema],
  bookmarks: [bookmarkSchema],
  achievements: [achievementSchema],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
