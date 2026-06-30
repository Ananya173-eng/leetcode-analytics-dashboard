import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Sparkles, BrainCircuit, Activity, BarChart2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function Predictions({ stats }) {
  const { theme } = useTheme();
  const { predictions = {}, contestRating = 0, totalSolved = 0 } = stats;

  const {
    predictedRating = 1750,
    interviewReadinessScore = 70,
    consistencyForecast = 'High',
    monthlyGrowthPrediction = 15
  } = predictions;

  const currentRating = contestRating > 0 ? contestRating : 1842;

  // Generate 3 month forecast progression coordinates
  const forecastData = [
    { name: 'Current', Rating: currentRating },
    { name: 'Month 1', Rating: Math.round(currentRating + monthlyGrowthPrediction * 0.4 + 10) },
    { name: 'Month 2', Rating: Math.round(currentRating + monthlyGrowthPrediction * 0.9 + 22) },
    { name: 'Month 3', Rating: predictedRating > currentRating ? predictedRating : Math.round(currentRating + monthlyGrowthPrediction * 1.5 + 35) }
  ];

  return (
    <div className="space-y-6">
      {/* Dynamic predictions cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Interview Readiness */}
        <div className="glass-card rounded-2xl p-6 border border-primary-violet/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xs uppercase tracking-widest font-bold text-slate-400">Interview Readiness</span>
            <div className="p-2 bg-primary-violet/10 rounded-lg text-primary-violet">
              <BrainCircuit className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-primary-violet">{interviewReadinessScore}%</div>
            <p className="text-3xs text-slate-400 mt-2">
              Based on solved difficulty ratios (Easy vs. Medium vs. Hard weights). A target of 85%+ is recommended for FAANG-level preparation.
            </p>
          </div>
        </div>

        {/* Consistency Forecast */}
        <div className="glass-card rounded-2xl p-6 border border-secondary-teal/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xs uppercase tracking-widest font-bold text-slate-400">Consistency Forecast</span>
            <div className="p-2 bg-secondary-teal/10 rounded-lg text-secondary-teal">
              <Activity className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-secondary-teal truncate">{consistencyForecast}</div>
            <p className="text-3xs text-slate-400 mt-2">
              Measures daily active status. Consistency correlates highly with contest execution success and retention of algorithms.
            </p>
          </div>
        </div>

        {/* Monthly growth projection */}
        <div className="glass-card rounded-2xl p-6 border border-orange-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <span className="text-4xs uppercase tracking-widest font-bold text-slate-400">Monthly Solve Rate</span>
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <BarChart2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold text-orange-500">+{monthlyGrowthPrediction}</div>
            <p className="text-3xs text-slate-400 mt-2">
              Predicted quantity of questions solved next month, calculated using submissions calendar activity.
            </p>
          </div>
        </div>
      </div>

      {/* Forecast Line Chart */}
      <div className="glass-card rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary-violet" /> Rating Projection curve
            </h3>
            <p className="text-3xs text-slate-400">Calculates predicted rating trajectory over the next 90 days.</p>
          </div>
        </div>

        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={forecastData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
              <XAxis dataKey="name" tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
              <YAxis domain={['dataMin - 50', 'dataMax + 100']} tickLine={false} tick={{ fill: '#64748B', fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#FFF'
                }}
              />
              <Line type="monotone" dataKey="Rating" stroke="#F97316" strokeWidth={3} strokeDasharray="4 4" dot={{ fill: '#F97316', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
