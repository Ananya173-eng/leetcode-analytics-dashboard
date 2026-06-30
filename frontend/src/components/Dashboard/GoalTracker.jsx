import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Target, Award, Edit2, Check, RefreshCw, Star } from 'lucide-react';
import confetti from 'canvas-confetti';

// Custom SVG Circular Progress Ring
const ProgressRing = ({ progress, target, colorClass, strokeColor }) => {
  const pct = Math.min(100, Math.round((progress / target) * 100)) || 0;
  
  const radius = 45;
  const stroke = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-28 h-28 transform -rotate-90">
        {/* Background circle */}
        <circle
          className="text-slate-200 dark:text-white/5"
          strokeWidth={stroke}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="56"
          cy="56"
        />
        {/* Progress circle */}
        <circle
          style={{ strokeDashoffset, strokeDasharray: circumference, transition: 'stroke-dashoffset 0.8s ease-in-out' }}
          strokeWidth={stroke}
          stroke={strokeColor}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx="56"
          cy="56"
        />
      </svg>
      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-lg font-black">{pct}%</span>
        <span className="text-4xs text-slate-500 font-bold uppercase tracking-wider">
          {progress}/{target}
        </span>
      </div>
    </div>
  );
};

export default function GoalTracker({ stats, onUpdate }) {
  const { updateGoals } = useAuth();
  const { goals = {} } = stats;

  const {
    dailyTarget = 2,
    weeklyTarget = 10,
    monthlyTarget = 40,
    dailyProgress = 0,
    weeklyProgress = 0,
    monthlyProgress = 0
  } = goals;

  const [isEditing, setIsEditing] = useState(false);
  const [dailyVal, setDailyVal] = useState(dailyTarget);
  const [weeklyVal, setWeeklyVal] = useState(weeklyTarget);
  const [monthlyVal, setMonthlyVal] = useState(monthlyTarget);
  const [saving, setSaving] = useState(false);

  // Trigger confetti if daily/weekly/monthly is completed (hits 100%)
  useEffect(() => {
    if (dailyProgress >= dailyTarget && dailyTarget > 0) {
      confetti({ particleCount: 50, spread: 45, origin: { y: 0.7 } });
    }
  }, [dailyProgress, dailyTarget]);

  const handleSaveGoals = async (e) => {
    e.preventDefault();
    setSaving(true);
    const res = await updateGoals(Number(dailyVal), Number(weeklyVal), Number(monthlyVal));
    setSaving(false);
    if (res.success) {
      setIsEditing(false);
      onUpdate();
    }
  };

  const getMotivationalInsight = () => {
    const dailyPct = (dailyProgress / dailyTarget) * 100;
    if (dailyPct >= 100) {
      return "Fantastic! Daily target reached. Take a break or challenge yourself with a LeetCode Medium/Hard question.";
    }
    if (dailyProgress > 0) {
      return "Great job! You've made progress today. Just one more problem to lock in your daily goal.";
    }
    return "Ready to practice? Solve a quick problem now to start your daily consistency counter.";
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-[450px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Target className="h-4 w-4 text-primary-violet" /> Goal Tracking
        </h3>
        <button
          onClick={() => {
            setIsEditing(!isEditing);
            setDailyVal(dailyTarget);
            setWeeklyVal(weeklyTarget);
            setMonthlyVal(monthlyTarget);
          }}
          className="text-slate-400 hover:text-slate-900 dark:hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
        >
          {isEditing ? <Check className="h-4 w-4 text-green-500" /> : <Edit2 className="h-4 w-4" />}
        </button>
      </div>

      {isEditing ? (
        /* Edit targets form */
        <form onSubmit={handleSaveGoals} className="space-y-4 my-auto">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-4xs uppercase tracking-widest font-bold text-slate-400 mb-1">Daily Target</label>
              <input
                type="number"
                min="1"
                value={dailyVal}
                onChange={e => setDailyVal(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-2 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-4xs uppercase tracking-widest font-bold text-slate-400 mb-1">Weekly Target</label>
              <input
                type="number"
                min="1"
                value={weeklyVal}
                onChange={e => setWeeklyVal(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-2 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-4xs uppercase tracking-widest font-bold text-slate-400 mb-1">Monthly Target</label>
              <input
                type="number"
                min="1"
                value={monthlyVal}
                onChange={e => setMonthlyVal(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 p-2 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-gradient-to-r from-primary-violet to-secondary-teal py-2 text-xs font-bold text-white flex items-center justify-center gap-1.5"
          >
            {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Save Targets'}
          </button>
        </form>
      ) : (
        /* Progress rings display */
        <div className="grid grid-cols-3 gap-4 my-auto">
          <div className="flex flex-col items-center">
            <ProgressRing progress={dailyProgress} target={dailyTarget} colorClass="text-primary-violet" strokeColor="#8B5CF6" />
            <span className="text-3xs font-bold mt-2 text-slate-400">Daily Target</span>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing progress={weeklyProgress} target={weeklyTarget} colorClass="text-secondary-teal" strokeColor="#14B8A6" />
            <span className="text-3xs font-bold mt-2 text-slate-400">Weekly Target</span>
          </div>
          <div className="flex flex-col items-center">
            <ProgressRing progress={monthlyProgress} target={monthlyTarget} colorClass="text-orange-500" strokeColor="#F97316" />
            <span className="text-3xs font-bold mt-2 text-slate-400">Monthly Target</span>
          </div>
        </div>
      )}

      {/* Motivational Insights */}
      <div className="border-t border-slate-200/50 pt-4 dark:border-white/5 mt-4 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500">
          <Star className="h-4 w-4 fill-current" /> Motivational Insights
        </div>
        <p className="text-3xs text-slate-400 leading-relaxed">
          {getMotivationalInsight()}
        </p>
      </div>
    </div>
  );
}
