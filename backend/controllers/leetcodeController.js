import User from '../models/User.js';
import LeetCodeData from '../models/LeetCodeData.js';
import { fetchLeetCodeData } from '../utils/leetcodeApi.js';
import { generateInsightsAndPredictions } from '../utils/aiHelper.js';

// Calculate streaks from submission calendar map
function calculateStreaks(submissionCalendar) {
  if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Convert timestamps to date strings YYYY-MM-DD
  const activeDates = new Set();
  Object.keys(submissionCalendar).forEach(ts => {
    const date = new Date(parseInt(ts) * 1000);
    const dateStr = date.toISOString().split('T')[0];
    activeDates.add(dateStr);
  });

  const sortedDates = Array.from(activeDates).sort();
  if (sortedDates.length === 0) return { currentStreak: 0, longestStreak: 0 };

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // Calculate longest streak historically
  let prevDate = null;
  for (let i = 0; i < sortedDates.length; i++) {
    const currentDate = new Date(sortedDates[i]);
    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = Math.abs(currentDate - prevDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        tempStreak = 1;
      }
    }
    prevDate = currentDate;
  }
  if (tempStreak > longestStreak) longestStreak = tempStreak;

  // Calculate current streak backward from today
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (activeDates.has(todayStr)) {
    currentStreak = 1;
    let checkDate = new Date();
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const checkStr = checkDate.toISOString().split('T')[0];
      if (activeDates.has(checkStr)) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else if (activeDates.has(yesterdayStr)) {
    currentStreak = 1;
    let checkDate = yesterday;
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const checkStr = checkDate.toISOString().split('T')[0];
      if (activeDates.has(checkStr)) {
        currentStreak++;
      } else {
        break;
      }
    }
  } else {
    currentStreak = 0;
  }

  // Ensure longest streak is at least current streak
  if (currentStreak > longestStreak) longestStreak = currentStreak;

  return { currentStreak, longestStreak };
}

// Check and unlock achievements
async function checkAchievements(user, stats, currentStreak) {
  const currentBadges = new Set(user.achievements.map(a => a.badgeId));
  const newBadges = [];

  const addBadge = (badgeId) => {
    if (!currentBadges.has(badgeId)) {
      user.achievements.push({ badgeId, unlockedAt: new Date() });
      newBadges.push(badgeId);
    }
  };

  // 1. Solved counts
  if (stats.totalSolved >= 100) addBadge('100_solved');
  if (stats.totalSolved >= 250) addBadge('250_solved');

  // 2. Streaks
  if (currentStreak >= 7) addBadge('7_streak');
  if (currentStreak >= 30) addBadge('30_streak');

  // 3. Contests
  if (stats.attendedContestsCount >= 1) addBadge('contest_warrior');
  if (stats.contestRating >= 1900) addBadge('knight_rating');

  // 4. Topics
  const tagMap = {};
  stats.tagSolvedCount.forEach(t => {
    tagMap[t.tagName.toLowerCase()] = t.solvedCount;
  });

  const dpCount = tagMap['dynamic programming'] || 0;
  const graphCount = (tagMap['depth-first search'] || 0) + (tagMap['breadth-first search'] || 0) + (tagMap['graph'] || 0);

  if (dpCount >= 10) addBadge('dp_master');
  if (graphCount >= 12) addBadge('graph_expert');

  if (newBadges.length > 0) {
    await user.save();
  }

  return newBadges;
}

// SYNC PROFILE
export const syncLeetCodeProfile = async (req, res) => {
  try {
    const { leetcodeUsername } = req.body;
    const userId = req.user.id;

    if (!leetcodeUsername) {
      return res.status(400).json({ message: 'LeetCode username is required' });
    }

    // Save leetcodeUsername to user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.leetcodeUsername = leetcodeUsername;
    await user.save();

    // Fetch LeetCode Data
    const rawStats = await fetchLeetCodeData(leetcodeUsername);
    const { aiInsights, predictions } = generateInsightsAndPredictions(rawStats);

    const mergedStats = {
      ...rawStats,
      aiInsights,
      predictions,
      userId
    };

    // Calculate streaks
    const { currentStreak, longestStreak } = calculateStreaks(mergedStats.submissionCalendar);

    // Save/Update LeetCodeData collection
    let leetcodeData = await LeetCodeData.findOne({ userId });

    if (leetcodeData) {
      Object.assign(leetcodeData, mergedStats);
      leetcodeData.lastSynced = new Date();
    } else {
      leetcodeData = new LeetCodeData(mergedStats);
    }
    await leetcodeData.save();

    // Check goals progress (increment progress according to today's submissions count)
    const todayStr = new Date().toISOString().split('T')[0];
    let todaySubmissionsCount = 0;
    
    // Find active count for today in calendar
    const todaySeconds = Math.floor(Date.now() / 1000);
    Object.entries(mergedStats.submissionCalendar).forEach(([ts, count]) => {
      const dateStr = new Date(parseInt(ts) * 1000).toISOString().split('T')[0];
      if (dateStr === todayStr) {
        todaySubmissionsCount += count;
      }
    });

    // Update goal progresses
    user.goals.dailyProgress = Math.min(user.goals.dailyTarget, todaySubmissionsCount);
    // Weekly progress: sum up past 7 days submissions
    let weeklyCount = 0;
    const oneWeekAgo = todaySeconds - (7 * 86400);
    Object.entries(mergedStats.submissionCalendar).forEach(([ts, count]) => {
      const tsVal = parseInt(ts);
      if (tsVal >= oneWeekAgo) {
        weeklyCount += count;
      }
    });
    user.goals.weeklyProgress = Math.min(user.goals.weeklyTarget, weeklyCount);
    
    // Monthly progress: sum up past 30 days
    let monthlyCount = 0;
    const oneMonthAgo = todaySeconds - (30 * 86400);
    Object.entries(mergedStats.submissionCalendar).forEach(([ts, count]) => {
      const tsVal = parseInt(ts);
      if (tsVal >= oneMonthAgo) {
        monthlyCount += count;
      }
    });
    user.goals.monthlyProgress = Math.min(user.goals.monthlyTarget, monthlyCount);

    await user.save();

    // Check and unlock achievements
    const newlyUnlockedBadges = await checkAchievements(user, mergedStats, currentStreak);

    res.status(200).json({
      message: 'LeetCode profile synchronized successfully',
      data: {
        ...mergedStats,
        currentStreak,
        longestStreak,
        newlyUnlockedBadges
      }
    });
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ message: 'Internal server error during synchronization' });
  }
};

// GET PROFILE DATA
export const getLeetCodeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const leetcodeData = await LeetCodeData.findOne({ userId });

    if (!leetcodeData) {
      return res.status(200).json({
        synced: false,
        message: 'No LeetCode profile linked. Please sync your account.'
      });
    }

    const user = await User.findById(userId);
    const { currentStreak, longestStreak } = calculateStreaks(leetcodeData.submissionCalendar);

    res.status(200).json({
      synced: true,
      data: {
        ...leetcodeData.toObject(),
        currentStreak,
        longestStreak,
        achievements: user.achievements,
        goals: user.goals
      }
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// COMPARE PROFILE WITH FRIEND
export const compareWithFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const myData = await LeetCodeData.findOne({ userId });
    const friendData = await LeetCodeData.findOne({ userId: friendId });
    const friendUser = await User.findById(friendId).select('username avatar leetcodeUsername');

    if (!myData) {
      return res.status(400).json({ message: 'Please sync your LeetCode profile first' });
    }

    if (!friendData || !friendUser) {
      return res.status(404).json({ message: 'Friend has not synchronized their LeetCode profile yet' });
    }

    const myStreaks = calculateStreaks(myData.submissionCalendar);
    const friendStreaks = calculateStreaks(friendData.submissionCalendar);

    res.status(200).json({
      me: {
        username: 'You',
        totalSolved: myData.totalSolved,
        easySolved: myData.easySolved,
        mediumSolved: myData.mediumSolved,
        hardSolved: myData.hardSolved,
        contestRating: myData.contestRating,
        ranking: myData.ranking,
        streak: myStreaks.currentStreak,
        tagSolvedCount: myData.tagSolvedCount
      },
      friend: {
        username: friendUser.username,
        avatar: friendUser.avatar,
        totalSolved: friendData.totalSolved,
        easySolved: friendData.easySolved,
        mediumSolved: friendData.mediumSolved,
        hardSolved: friendData.hardSolved,
        contestRating: friendData.contestRating,
        ranking: friendData.ranking,
        streak: friendStreaks.currentStreak,
        tagSolvedCount: friendData.tagSolvedCount
      }
    });
  } catch (err) {
    console.error('Compare error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
