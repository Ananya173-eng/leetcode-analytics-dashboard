import User from '../models/User.js';
import LeetCodeData from '../models/LeetCodeData.js';

// Streaks calculation helper (cloned to avoid circular issues)
function getStreakValue(submissionCalendar) {
  if (!submissionCalendar || Object.keys(submissionCalendar).length === 0) return 0;
  const activeDates = new Set();
  Object.keys(submissionCalendar).forEach(ts => {
    const date = new Date(parseInt(ts) * 1000);
    activeDates.add(date.toISOString().split('T')[0]);
  });
  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  
  let currentStreak = 0;
  if (activeDates.has(todayStr)) {
    currentStreak = 1;
    let checkDate = new Date();
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      if (activeDates.has(checkDate.toISOString().split('T')[0])) currentStreak++;
      else break;
    }
  } else if (activeDates.has(yesterdayStr)) {
    currentStreak = 1;
    let checkDate = new Date(Date.now() - 86400000);
    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      if (activeDates.has(checkDate.toISOString().split('T')[0])) currentStreak++;
      else break;
    }
  }
  return currentStreak;
}

// UPDATE GOALS
export const updateGoals = async (req, res) => {
  try {
    const { dailyTarget, weeklyTarget, monthlyTarget } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (dailyTarget !== undefined) user.goals.dailyTarget = dailyTarget;
    if (weeklyTarget !== undefined) user.goals.weeklyTarget = weeklyTarget;
    if (monthlyTarget !== undefined) user.goals.monthlyTarget = monthlyTarget;

    await user.save();
    res.status(200).json({ message: 'Goals updated successfully', goals: user.goals });
  } catch (err) {
    console.error('Update goals error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET JOURNAL ENTRIES
export const getJournal = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('journal');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.journal);
  } catch (err) {
    console.error('Get journal error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ADD JOURNAL ENTRY
export const addJournal = async (req, res) => {
  try {
    const { title, problemLink, difficulty, notes } = req.body;
    if (!title || !notes) {
      return res.status(400).json({ message: 'Title and notes are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.journal.unshift({ title, problemLink, difficulty, notes });
    await user.save();

    res.status(201).json({ message: 'Journal entry added', journal: user.journal });
  } catch (err) {
    console.error('Add journal error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET BOOKMARKS
export const getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('bookmarks');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user.bookmarks);
  } catch (err) {
    console.error('Get bookmarks error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ADD BOOKMARK
export const addBookmark = async (req, res) => {
  try {
    const { title, link, difficulty, notes } = req.body;
    if (!title || !link || !difficulty) {
      return res.status(400).json({ message: 'Title, link, and difficulty are required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if already bookmarked
    const exists = user.bookmarks.some(b => b.link === link);
    if (exists) return res.status(400).json({ message: 'Problem is already bookmarked' });

    user.bookmarks.unshift({ title, link, difficulty, notes });
    await user.save();

    res.status(201).json({ message: 'Bookmark added', bookmarks: user.bookmarks });
  } catch (err) {
    console.error('Add bookmark error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// DELETE BOOKMARK
export const deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bookmarks = user.bookmarks.filter(b => b._id.toString() !== id);
    await user.save();

    res.status(200).json({ message: 'Bookmark deleted', bookmarks: user.bookmarks });
  } catch (err) {
    console.error('Delete bookmark error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ADD FRIEND BY EMAIL
export const addFriend = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const currentUserId = req.user.id;
    const friend = await User.findOne({ email: email.toLowerCase() });

    if (!friend) return res.status(404).json({ message: 'User with this email not found' });
    if (friend._id.toString() === currentUserId) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' });
    }

    const user = await User.findById(currentUserId);
    if (user.friends.includes(friend._id)) {
      return res.status(400).json({ message: 'User is already your friend' });
    }

    user.friends.push(friend._id);
    await user.save();

    // Populate and return updated friends list
    const updatedUser = await User.findById(currentUserId).populate('friends', 'username email avatar leetcodeUsername');

    res.status(200).json({ message: 'Friend added successfully', friends: updatedUser.friends });
  } catch (err) {
    console.error('Add friend error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// GET LEADERBOARDS
export const getLeaderboards = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category = 'problems' } = req.query; // 'problems', 'rating', 'streak'

    // Fetch all synchronized profiles
    const allData = await LeetCodeData.find().populate('userId', 'username avatar email');

    // Map profiles into uniform leaderboard rows
    const leaderboardRows = allData.map(data => {
      const userObj = data.userId || {};
      const streak = getStreakValue(data.submissionCalendar);
      return {
        id: userObj._id || data._id,
        username: userObj.username || data.leetcodeUsername,
        avatar: userObj.avatar || '',
        leetcodeUsername: data.leetcodeUsername,
        totalSolved: data.totalSolved,
        contestRating: data.contestRating || 1500,
        streak: streak,
        ranking: data.ranking
      };
    });

    // Sort according to category
    if (category === 'rating') {
      leaderboardRows.sort((a, b) => b.contestRating - a.contestRating);
    } else if (category === 'streak') {
      leaderboardRows.sort((a, b) => b.streak - a.streak);
    } else { // default: problems
      leaderboardRows.sort((a, b) => b.totalSolved - a.totalSolved);
    }

    // Add rank indices
    const globalLeaderboard = leaderboardRows.map((row, idx) => ({
      ...row,
      rank: idx + 1
    }));

    // Filter to build friends leaderboard (including self)
    const user = await User.findById(userId);
    const friendIds = new Set(user.friends.map(f => f.toString()));
    friendIds.add(userId.toString()); // add self

    const friendsLeaderboard = globalLeaderboard
      .filter(row => friendIds.has(row.id.toString()))
      .map((row, idx) => ({
        ...row,
        friendRank: idx + 1
      }));

    res.status(200).json({
      global: globalLeaderboard.slice(0, 100), // top 100
      friends: friendsLeaderboard
    });
  } catch (err) {
    console.error('Get leaderboard error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
