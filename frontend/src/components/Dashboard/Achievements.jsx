import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Target, Trophy, Brain, Sparkles, CheckCircle2, Lock } from 'lucide-react';

export default function Achievements({ stats }) {
  const { achievements = [] } = stats;

  const unlockedSet = new Set(achievements.map(a => a.badgeId));

  const badges = [
    {
      id: '7_streak',
      name: '7 Day Streak',
      desc: 'Maintain consecutive coding days for one week.',
      icon: <Flame className="h-8 w-8 text-orange-500 fill-current" />,
      colorClass: 'from-orange-500/20 to-yellow-500/20 border-orange-500/30'
    },
    {
      id: '30_streak',
      name: '30 Day Streak',
      desc: 'Achieve legendary 30-day coding consistency.',
      icon: <Flame className="h-8 w-8 text-red-500 fill-current" />,
      colorClass: 'from-red-500/20 to-orange-500/20 border-red-500/30'
    },
    {
      id: '100_solved',
      name: 'Centurion Coder',
      desc: 'Solve 100+ LeetCode problems successfully.',
      icon: <Target className="h-8 w-8 text-indigo-400" />,
      colorClass: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30'
    },
    {
      id: 'contest_warrior',
      name: 'Contest Warrior',
      desc: 'Participate in at least 1 competitive weekly contest.',
      icon: <Trophy className="h-8 w-8 text-yellow-500" />,
      colorClass: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
    },
    {
      id: 'dp_master',
      name: 'DP Master',
      desc: 'Solve 10+ Dynamic Programming problems.',
      icon: <Brain className="h-8 w-8 text-pink-500" />,
      colorClass: 'from-pink-500/20 to-purple-500/20 border-pink-500/30'
    },
    {
      id: 'graph_expert',
      name: 'Graph Expert',
      desc: 'Solve 12+ Graph, DFS or BFS problems.',
      icon: <Sparkles className="h-8 w-8 text-secondary-teal" />,
      colorClass: 'from-secondary-teal/20 to-emerald-500/20 border-secondary-teal/30'
    }
  ];

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
      <div>
        <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
          <Award className="h-4.5 w-4.5 text-yellow-500" /> Unlockable Badges
        </h3>
        <p className="text-3xs text-slate-400">Complete milestones on LeetCode to synchronize and unlock gamified trophies.</p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {badges.map((badge, idx) => {
          const isUnlocked = unlockedSet.has(badge.id);
          const unlockInfo = achievements.find(a => a.badgeId === badge.id);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className={`relative rounded-2xl border p-5 flex flex-col justify-between h-[160px] overflow-hidden transition-all duration-300 ${
                isUnlocked
                  ? `bg-gradient-to-br ${badge.colorClass} shadow-glass`
                  : 'bg-white/1 border-white/5 dark:bg-black/15 opacity-60 filter grayscale'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-white/10`}>
                  {badge.icon}
                </div>
                {isUnlocked ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-slate-500" />
                )}
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900 dark:text-white">{badge.name}</h4>
                <p className="text-4xs text-slate-400 mt-1">{badge.desc}</p>
                {isUnlocked && unlockInfo && (
                  <div className="text-5xs text-green-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                    Unlocked on: {new Date(unlockInfo.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
