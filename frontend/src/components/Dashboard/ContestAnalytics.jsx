import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Trophy, Award, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ContestAnalytics({ stats }) {
  const { theme } = useTheme();
  const {
    contestRating = 0,
    contestGlobalRanking = 0,
    contestTopPercentage = 0,
    attendedContestsCount = 0,
    bestRank = 0,
    contestHistory = []
  } = stats;

  const showFallbackWarning = attendedContestsCount === 0;

  // Prepare line chart data
  // If no history, render mock contest milestones for demonstration
  const chartData = contestHistory.length > 0 
    ? contestHistory.map(c => ({ name: c.contestTitle.replace('Weekly Contest ', 'WC '), Rating: c.rating, Rank: c.rank }))
    : [
        { name: 'WC 290', Rating: 1500, Rank: 12000 },
        { name: 'WC 291', Rating: 1520, Rank: 9400 },
        { name: 'WC 292', Rating: 1490, Rank: 11000 },
        { name: 'WC 293', Rating: 1550, Rank: 7800 },
        { name: 'WC 294', Rating: 1610, Rank: 5200 },
        { name: 'WC 295', Rating: 1680, Rank: 3900 },
        { name: 'WC 296', Rating: 1740, Rank: 2800 },
        { name: 'WC 297', Rating: 1842, Rank: 1240 }
      ];

  const currentHistory = contestHistory.length > 0
    ? contestHistory
    : [
        { contestTitle: 'Weekly Contest 297', rating: 1842, rank: 1240, solvedProblems: 3, finishTime: 1683400000 },
        { contestTitle: 'Weekly Contest 296', rating: 1740, rank: 2800, solvedProblems: 3, finishTime: 1682790000 },
        { contestTitle: 'Weekly Contest 295', rating: 1680, rank: 3900, solvedProblems: 3, finishTime: 1682190000 },
        { contestTitle: 'Weekly Contest 294', rating: 1610, rank: 5200, solvedProblems: 2, finishTime: 1681580000 },
        { contestTitle: 'Weekly Contest 293', rating: 1550, rank: 7800, solvedProblems: 2, finishTime: 1680980000 }
      ];

  return (
    <div className="space-y-6">
      {showFallbackWarning && (
        <div className="rounded-xl bg-orange-500/10 border border-orange-500/25 p-4 text-xs text-orange-400 flex items-center gap-3">
          <Trophy className="h-5 w-5 shrink-0" />
          <div>
            <span className="font-extrabold">No active LeetCode contest data found!</span> Showing realistic mock contest progression history for demonstration purposes. Sync your account once you participate in a contest!
          </div>
        </div>
      )}

      {/* Overview stats cards for Contest */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Contest Rating', val: contestRating > 0 ? contestRating : 1842, icon: <TrendingUp className="text-secondary-teal" />, desc: 'Global Rating' },
          { label: 'Global Ranking', val: contestGlobalRanking > 0 ? contestGlobalRanking.toLocaleString() : '1,240', icon: <Trophy className="text-yellow-500" />, desc: 'Rank standing' },
          { label: 'Top Percentile', val: contestTopPercentage > 0 ? `${contestTopPercentage}%` : '4.2%', icon: <Award className="text-primary-violet" />, desc: 'Contest standings' },
          { label: 'Contests Attended', val: attendedContestsCount > 0 ? attendedContestsCount : 8, icon: <Calendar className="text-indigo-400" />, desc: 'Total participation' }
        ].map((c, i) => (
          <div key={i} className="glass-card rounded-2xl p-5 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-4xs uppercase tracking-widest font-bold text-slate-500">{c.label}</span>
              <div className="text-xl font-black mt-1">{c.val}</div>
              <span className="text-4xs text-slate-400">{c.desc}</span>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              {c.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Progression Line Chart */}
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary-violet" /> Rating Progression
            </h3>
            <p className="text-3xs text-slate-400">Contest rating progression trend line.</p>
          </div>
          <span className="px-2 py-0.5 rounded bg-secondary-teal/15 text-secondary-teal text-4xs font-bold uppercase tracking-wider">
            Active knight rank
          </span>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
              <YAxis domain={['dataMin - 100', 'dataMax + 100']} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#FFF'
                }}
              />
              <Line type="monotone" dataKey="Rating" stroke="#14B8A6" strokeWidth={3} dot={{ fill: '#14B8A6', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contest History Table */}
      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="text-sm font-bold">Contest Participation Logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th>Contest Event</th>
                <th>Global Rank</th>
                <th>Solved Count</th>
                <th>Performance Rating</th>
              </tr>
            </thead>
            <tbody>
              {currentHistory.map((c, i) => (
                <tr key={i} className="hover:bg-white/2 bg-transparent transition-colors">
                  <td className="font-semibold text-xs text-slate-900 dark:text-white">{c.contestTitle}</td>
                  <td>{c.rank.toLocaleString()}</td>
                  <td className="text-secondary-teal font-semibold">{c.solvedProblems || '3'} / 4</td>
                  <td className="font-bold text-primary-violet">{c.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
