import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Percent, 
  Award,
  Zap,
  TrendingUp,
  Target
} from 'lucide-react';

// Custom CountUp Component
const CountUp = ({ end, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const startValue = 0;
    const endValue = Number(end) || 0;
    if (endValue === 0) {
      setCount(0);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing function: easeOutQuad
      const easedProgress = progress * (2 - progress);
      
      setCount(Math.floor(easedProgress * (endValue - startValue) + startValue));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(endValue);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function OverviewCards({ stats }) {
  const {
    totalSolved = 0,
    easySolved = 0,
    mediumSolved = 0,
    hardSolved = 0,
    acceptanceRate = 0,
    contestRating = 0,
    currentStreak = 0,
    longestStreak = 0
  } = stats;

  const cardData = [
    {
      title: 'Total Solved',
      value: totalSolved,
      icon: <Target className="h-5 w-5 text-primary-violet" />,
      description: 'Questions completed',
      borderColor: 'border-primary-violet/20 hover:border-primary-violet/50',
      badge: null
    },
    {
      title: 'Easy Solved',
      value: easySolved,
      icon: <Award className="h-5 w-5 text-success" />,
      description: 'Foundational puzzles',
      borderColor: 'border-success/20 hover:border-success/50',
      badge: 'Green'
    },
    {
      title: 'Medium Solved',
      value: mediumSolved,
      icon: <Zap className="h-5 w-5 text-highlight-orange" />,
      description: 'Intermediate puzzles',
      borderColor: 'border-orange-500/20 hover:border-orange-500/50',
      badge: 'Orange'
    },
    {
      title: 'Hard Solved',
      value: hardSolved,
      icon: <Trophy className="h-5 w-5 text-red-500" />,
      description: 'Advanced algorithms',
      borderColor: 'border-red-500/20 hover:border-red-500/50',
      badge: 'Crimson'
    },
    {
      title: 'Contest Rating',
      value: contestRating > 0 ? contestRating : 1500,
      icon: <TrendingUp className="h-5 w-5 text-secondary-teal" />,
      description: contestRating > 0 ? 'Active Contestant' : 'Baseline Rating',
      borderColor: 'border-secondary-teal/20 hover:border-secondary-teal/50',
      badge: contestRating > 0 ? 'Knight' : 'Newcomer'
    },
    {
      title: 'Acceptance Rate',
      value: Math.round(acceptanceRate),
      icon: <Percent className="h-5 w-5 text-indigo-400" />,
      description: 'Submission accuracy',
      borderColor: 'border-indigo-500/20 hover:border-indigo-500/50',
      suffix: '%',
      badge: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic Count Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className={`glass-card glass-card-hover rounded-2xl p-6 border ${card.borderColor} flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-slate-400">{card.title}</span>
              <div className="rounded-lg bg-slate-50 dark:bg-white/5 p-2 border border-slate-200/50 dark:border-white/5">
                {card.icon}
              </div>
            </div>
            
            <div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-baseline">
                <CountUp end={card.value} />
                {card.suffix && <span className="text-lg font-bold ml-0.5">{card.suffix}</span>}
              </div>
              <div className="text-3xs text-slate-500 mt-1 flex items-center justify-between">
                <span>{card.description}</span>
                {card.badge && (
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/5 text-slate-400 text-4xs font-extrabold uppercase tracking-wide">
                    {card.badge}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Dedicated Consistency Streak Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="glass-card glass-card-hover rounded-2xl p-6 border border-orange-500/20 hover:border-orange-500/40 col-span-1 md:col-span-2 lg:col-span-3 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 flex items-center justify-center pulse-neon-violet">
              <Flame className="h-7 w-7 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Consistency Streak Tracker</h3>
              <p className="text-xs text-slate-400">Keep coding daily to preserve your active progress streak.</p>
            </div>
          </div>

          <div className="flex gap-12 text-center">
            <div>
              <div className="text-3xl font-extrabold text-orange-500">
                <CountUp end={currentStreak} />
              </div>
              <div className="text-4xs uppercase tracking-widest text-slate-500 font-bold mt-1">Current Streak</div>
            </div>
            <div className="border-l border-slate-200/50 dark:border-white/5"></div>
            <div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                <CountUp end={longestStreak} />
              </div>
              <div className="text-4xs uppercase tracking-widest text-slate-500 font-bold mt-1">Longest Streak</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
