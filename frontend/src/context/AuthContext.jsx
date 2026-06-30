import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Configure axios authorization header
  const setAuthHeader = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        setAuthHeader(token);
        try {
          const response = await axios.get('/api/auth/me');
          setUser(response.data.user);
        } catch (error) {
          console.error('Failed to load user session:', error.message);
          localStorage.removeItem('token');
          setAuthHeader(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // LOGIN
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setAuthHeader(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  // SIGNUP
  const signup = async (username, email, password) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/signup', { username, email, password });
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setAuthHeader(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Signup failed. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  // GOOGLE LOGIN / SOCIAL SIGN-IN
  const googleLogin = async (googlePayload) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/google', googlePayload);
      const { token, user: userData } = response.data;
      localStorage.setItem('token', token);
      setAuthHeader(token);
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Google Auth error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Google Auth failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setAuthHeader(null);
    setUser(null);
  };

  // SYNC LEETCODE PROFILE
  const syncLeetCode = async (leetcodeUsername) => {
    try {
      const response = await axios.post('/api/leetcode/sync', { leetcodeUsername });
      
      // Update local user details with newly synced info (leetcodeUsername, goals, achievements)
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          leetcodeUsername: response.data.data.leetcodeUsername,
          goals: response.data.data.goals,
          achievements: response.data.data.achievements
        };
      });
      return { success: true, data: response.data.data };
    } catch (error) {
      console.error('LeetCode sync error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Synchronization failed.'
      };
    }
  };

  // GET LEETCODE PROFILE
  const getLeetCodeProfile = async () => {
    try {
      const response = await axios.get('/api/leetcode/profile');
      return response.data;
    } catch (error) {
      console.error('Failed to retrieve profile info:', error);
      throw error;
    }
  };

  // UPDATE GOALS
  const updateGoals = async (dailyTarget, weeklyTarget, monthlyTarget) => {
    try {
      const response = await axios.put('/api/dashboard/goals', { dailyTarget, weeklyTarget, monthlyTarget });
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, goals: response.data.goals };
      });
      return { success: true };
    } catch (error) {
      console.error('Failed to update goals:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to update targets' };
    }
  };

  // ADD JOURNAL ENTRY
  const addJournalEntry = async (entry) => {
    try {
      const response = await axios.post('/api/dashboard/journal', entry);
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, journal: response.data.journal };
      });
      return { success: true, journal: response.data.journal };
    } catch (error) {
      console.error('Failed to add journal:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to save entry' };
    }
  };

  // ADD BOOKMARK PROBLEM
  const addBookmark = async (bookmark) => {
    try {
      const response = await axios.post('/api/dashboard/bookmarks', bookmark);
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, bookmarks: response.data.bookmarks };
      });
      return { success: true, bookmarks: response.data.bookmarks };
    } catch (error) {
      console.error('Failed to bookmark problem:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to bookmark' };
    }
  };

  // DELETE BOOKMARK
  const removeBookmark = async (id) => {
    try {
      const response = await axios.delete(`/api/dashboard/bookmarks/${id}`);
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, bookmarks: response.data.bookmarks };
      });
      return { success: true, bookmarks: response.data.bookmarks };
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to delete' };
    }
  };

  // ADD FRIEND BY EMAIL
  const addFriend = async (email) => {
    try {
      const response = await axios.post('/api/dashboard/friends/add', { email });
      setUser(prev => {
        if (!prev) return null;
        return { ...prev, friends: response.data.friends };
      });
      return { success: true, friends: response.data.friends };
    } catch (error) {
      console.error('Failed to add friend:', error);
      return { success: false, message: error.response?.data?.message || 'Failed to add friend' };
    }
  };

  // GET LEADERBOARDS
  const fetchLeaderboards = async (category) => {
    try {
      const response = await axios.get(`/api/dashboard/leaderboard?category=${category}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      throw error;
    }
  };

  // COMPARE FRIEND STATS
  const compareFriend = async (friendId) => {
    try {
      const response = await axios.get(`/api/leetcode/compare/${friendId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to compare friend stats:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      googleLogin,
      logout,
      syncLeetCode,
      getLeetCodeProfile,
      updateGoals,
      addJournalEntry,
      addBookmark,
      removeBookmark,
      addFriend,
      fetchLeaderboards,
      compareFriend
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
