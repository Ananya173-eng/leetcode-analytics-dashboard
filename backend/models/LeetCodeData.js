import mongoose from 'mongoose';

const contestHistorySchema = new mongoose.Schema({
  contestTitle: { type: String, required: true },
  rating: { type: Number, required: true },
  rank: { type: Number, required: true },
  solvedProblems: { type: Number },
  finishTime: { type: Number }
});

const tagSolvedCountSchema = new mongoose.Schema({
  tagName: { type: String, required: true },
  solvedCount: { type: Number, default: 0 }
});

const languageStatsSchema = new mongoose.Schema({
  languageName: { type: String, required: true },
  solvedCount: { type: Number, default: 0 }
});

const aiInsightsSchema = new mongoose.Schema({
  performanceSummary: { type: String, default: '' },
  weakTopicSuggestions: [{ type: String }],
  contestImprovementTips: [{ type: String }],
  personalizedPracticePlan: [{ type: String }],
  lastGenerated: { type: Date }
});

const predictionsSchema = new mongoose.Schema({
  predictedRating: { type: Number, default: 0 },
  interviewReadinessScore: { type: Number, default: 0 },
  consistencyForecast: { type: String, default: '' },
  monthlyGrowthPrediction: { type: Number, default: 0 }
});

const leetcodeDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  leetcodeUsername: { type: String, required: true },
  totalSolved: { type: Number, default: 0 },
  easySolved: { type: Number, default: 0 },
  mediumSolved: { type: Number, default: 0 },
  hardSolved: { type: Number, default: 0 },
  acceptanceRate: { type: Number, default: 0 },
  ranking: { type: Number, default: 0 },
  contestRating: { type: Number, default: 0 },
  contestGlobalRanking: { type: Number, default: 0 },
  contestTopPercentage: { type: Number, default: 0 },
  attendedContestsCount: { type: Number, default: 0 },
  bestRank: { type: Number, default: 0 },
  contestHistory: [contestHistorySchema],
  tagSolvedCount: [tagSolvedCountSchema],
  submissionCalendar: { type: Map, of: Number, default: {} },
  languageStats: [languageStatsSchema],
  predictions: { type: predictionsSchema, default: () => ({}) },
  aiInsights: { type: aiInsightsSchema, default: () => ({}) },
  lastSynced: { type: Date, default: Date.now }
});

const LeetCodeData = mongoose.model('LeetCodeData', leetcodeDataSchema);
export default LeetCodeData;
