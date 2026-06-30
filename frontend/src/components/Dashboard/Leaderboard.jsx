import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Trophy, Flame, Target, Star, RefreshCw, Globe, Users } from 'lucide-react';

export default function Leaderboard() {
  const { fetchLeaderboards } = useAuth();
  
  const [boardType, setBoardType] = useState('global'); // 'global' or 'friends'
  const [sortBy, setSortBy] = useState('problems'); // 'problems', 'rating', 'streak'
  const [leaderboardData, setLeaderboardData] = useState({ global: [], friends: [] });
  const [loading, setLoading] = useState(true);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await fetchLeaderboards(sortBy);
      setLeaderboardData(data);
    } catch (e) {
      console.error('Failed to load leaderboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, [sortBy]);

  const activeList = boardType === 'global' ? leaderboardData.global : leaderboardData.friends;

  return (
    <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
      {/* Leaderboard Header Settings */}
      <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Trophy className="h-4.5 w-4.5 text-yellow-500" /> Leaderboard Rankings
          </h3>
          <p className="text-3xs text-slate-400 mt-0.5">Compete with registered CodePulse coders globally or in your circle.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Board Toggle */}
          <div className="flex rounded-xl bg-slate-50 dark:bg-black/25 p-1 border border-slate-200/50 dark:border-white/5">
            <button
              onClick={() => setBoardType('global')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-bold transition-all ${
                boardType === 'global' ? 'bg-primary-violet text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="h-3.5 w-3.5" /> Global
            </button>
            <button
              onClick={() => setBoardType('friends')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-2xs font-bold transition-all ${
                boardType === 'friends' ? 'bg-primary-violet text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Friends
            </button>
          </div>

          {/* Sort By selector */}
          <div className="flex rounded-xl bg-slate-50 dark:bg-black/25 p-1 border border-slate-200/50 dark:border-white/5">
            {[
              { id: 'problems', name: 'Solved', icon: <Target className="h-3.5 w-3.5" /> },
              { id: 'rating', name: 'Rating', icon: <Star className="h-3.5 w-3.5" /> },
              { id: 'streak', name: 'Streak', icon: <Flame className="h-3.5 w-3.5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSortBy(tab.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-2xs font-bold transition-all ${
                  sortBy === tab.id ? 'bg-secondary-teal text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      {loading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin text-primary-violet" />
          <span className="text-3xs text-slate-400">Updating standings...</span>
        </div>
      ) : activeList.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th>Rank</th>
                <th>User Profile</th>
                <th>LeetCode</th>
                <th>Problems Solved</th>
                <th>Contest Rating</th>
                <th>Current Streak</th>
              </tr>
            </thead>
            <tbody>
              {activeList.map((row, idx) => {
                const rankNum = boardType === 'global' ? row.rank : row.friendRank;
                // Highlight rank numbers
                let rankBadge = <span className="font-bold text-xs text-slate-400">{rankNum}</span>;
                if (rankNum === 1) rankBadge = <span className="flex items-center justify-center w-5 h-5 rounded-full bg-yellow-500 text-slate-900 font-extrabold text-3xs">1</span>;
                if (rankNum === 2) rankBadge = <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-300 text-slate-900 font-extrabold text-3xs">2</span>;
                if (rankNum === 3) rankBadge = <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-400 text-slate-900 font-extrabold text-3xs">3</span>;

                return (
                  <tr key={row.id} className="hover:bg-white/2 bg-transparent transition-colors">
                    <td className="w-12 text-center py-4">{rankBadge}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img src={row.avatar} className="h-6 w-6 rounded-full border border-white/5" alt="avatar" />
                        <span className="font-semibold text-xs text-slate-900 dark:text-white">{row.username}</span>
                      </div>
                    </td>
                    <td className="text-slate-400 font-semibold text-2xs">@{row.leetcodeUsername}</td>
                    <td className="font-bold text-slate-700 dark:text-slate-200">{row.totalSolved}</td>
                    <td className="font-bold text-primary-violet">{row.contestRating > 0 ? row.contestRating : 1500}</td>
                    <td className="font-bold text-orange-500">
                      <span className="flex items-center gap-1 text-xs">
                        <Flame className="h-3.5 w-3.5 fill-current" /> {row.streak} Days
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="py-12 text-center text-3xs text-slate-400 italic">
          No records matched in this section yet. Link friends to compare circle status!
        </div>
      )}
    </div>
  );
}
