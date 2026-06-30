import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Users, UserPlus, AlertCircle, RefreshCw } from 'lucide-react';

export default function CompetitiveCompare({ stats }) {
  const { user, addFriend, compareFriend } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [friendError, setFriendError] = useState('');
  const [addingFriend, setAddingFriend] = useState(false);

  // Load comparison if a friend is selected
  useEffect(() => {
    if (!selectedFriendId) {
      setComparisonData(null);
      return;
    }

    const loadComparison = async () => {
      setLoadingCompare(true);
      try {
        const res = await compareFriend(selectedFriendId);
        setComparisonData(res);
      } catch (err) {
        console.error('Failed to load comparison:', err);
      } finally {
        setLoadingCompare(false);
      }
    };
    loadComparison();
  }, [selectedFriendId]);

  // Set default selected friend if friends exist
  useEffect(() => {
    if (user?.friends && user.friends.length > 0 && !selectedFriendId) {
      setSelectedFriendId(user.friends[0]._id);
    }
  }, [user?.friends]);

  const handleAddFriendSubmit = async (e) => {
    e.preventDefault();
    if (!emailInput) return;
    
    setAddingFriend(true);
    setFriendError('');
    
    const res = await addFriend(emailInput);
    setAddingFriend(false);
    
    if (res.success) {
      setEmailInput('');
      if (res.friends.length > 0) {
        setSelectedFriendId(res.friends[res.friends.length - 1]._id);
      }
    } else {
      setFriendError(res.message);
    }
  };

  // Format Recharts data
  const chartData = comparisonData ? [
    { name: 'Easy', You: comparisonData.me.easySolved, Friend: comparisonData.friend.easySolved },
    { name: 'Medium', You: comparisonData.me.mediumSolved, Friend: comparisonData.friend.mediumSolved },
    { name: 'Hard', You: comparisonData.me.hardSolved, Friend: comparisonData.friend.hardSolved },
    { name: 'Total', You: comparisonData.me.totalSolved, Friend: comparisonData.friend.totalSolved }
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar: Add Friend & Friends list selector */}
      <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
        <div>
          <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-primary-violet" /> Coding Buddies
          </h3>
          <p className="text-3xs text-slate-400">Add friends and compare problem-solving velocity.</p>
        </div>

        {/* Add Friend Form */}
        <form onSubmit={handleAddFriendSubmit} className="space-y-3">
          <div className="relative">
            <input
              type="email"
              required
              placeholder="Friend's registered email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              disabled={addingFriend}
              className="block w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-xs placeholder-slate-400 focus:outline-none dark:text-white"
            />
          </div>
          
          {friendError && (
            <div className="text-4xs font-bold text-red-500 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {friendError}
            </div>
          )}

          <button
            type="submit"
            disabled={addingFriend}
            className="w-full rounded-xl bg-gradient-to-r from-primary-violet to-secondary-teal py-2 text-xs font-bold text-white flex items-center justify-center gap-1.5"
          >
            {addingFriend ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <><UserPlus className="h-4 w-4" /> Link Buddy</>}
          </button>
        </form>

        {/* Friends Selector List */}
        <div className="space-y-2 border-t border-slate-200/50 pt-4 dark:border-white/5">
          <label className="block text-4xs uppercase tracking-widest font-bold text-slate-500 mb-2">Linked Friends</label>
          {user?.friends && user.friends.length > 0 ? (
            <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1">
              {user.friends.map(f => (
                <button
                  key={f._id}
                  onClick={() => setSelectedFriendId(f._id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
                    selectedFriendId === f._id
                      ? 'bg-primary-violet/10 text-primary-violet border border-primary-violet/20'
                      : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <img src={f.avatar} className="h-5 w-5 rounded-full" alt="avatar" />
                  <span className="truncate">{f.username}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-3xs text-slate-500 italic py-2">
              No friends linked yet. Share your email and link your peers!
            </div>
          )}
        </div>
      </div>

      {/* Main Panel: Side-by-side comparison charts */}
      <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between min-h-[300px]">
        {loadingCompare ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-primary-violet" />
            <span className="text-3xs text-slate-400">Loading side-by-side statistics...</span>
          </div>
        ) : comparisonData ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold">You vs. {comparisonData.friend.username}</h3>
              <span className="text-3xs text-slate-400">Compare solved counts</span>
            </div>

            {/* Solved comparison cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Solved', me: comparisonData.me.totalSolved, friend: comparisonData.friend.totalSolved, color: 'text-slate-900 dark:text-white' },
                { label: 'Contest Rating', me: comparisonData.me.contestRating, friend: comparisonData.friend.contestRating, color: 'text-primary-violet' },
                { label: 'Streak Status', me: comparisonData.me.streak, friend: comparisonData.friend.streak, color: 'text-secondary-teal' }
              ].map((row, i) => (
                <div key={i} className="bg-white/2 border border-white/5 rounded-xl p-3 text-center">
                  <span className="text-4xs font-bold text-slate-500 uppercase tracking-wider block">{row.label}</span>
                  <div className="flex justify-center items-baseline gap-2 mt-1 font-black text-sm">
                    <span className={row.color}>{row.me}</span>
                    <span className="text-slate-600 text-3xs">vs</span>
                    <span className="text-slate-600 dark:text-slate-400">{row.friend}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Double Bar Chart */}
            <div className="flex-1 h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#FFF'
                    }}
                  />
                  <Bar dataKey="You" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Friend" fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border border-dashed border-white/5 rounded-xl my-4 bg-white/1">
            <Users className="h-10 w-10 text-slate-500 mb-2" />
            <h4 className="font-bold text-xs">No Friend Comparison Loaded</h4>
            <p className="text-3xs text-slate-400 max-w-[280px] mt-1.5 leading-relaxed">
              Select an added buddy from the side column to visualize comparative problem stats side-by-side.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
