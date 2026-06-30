import React from 'react';
import { Sparkles, BrainCircuit, ArrowUpRight, CheckSquare } from 'lucide-react';

// Half-Circle SVG Gauge Dial for Interview Readiness
const GaugeDial = ({ score }) => {
  const radius = 50;
  const stroke = 10;
  const circumference = Math.PI * radius; // 157.08
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-36 h-20 text-slate-200 dark:text-white/5">
        {/* Background semicircle */}
        <path
          d="M 18,70 A 50,50 0 0,1 118,70"
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Progress semicircle */}
        <path
          style={{ strokeDashoffset: offset, strokeDasharray: circumference, transition: 'stroke-dashoffset 1s ease-in-out' }}
          d="M 18,70 A 50,50 0 0,1 118,70"
          fill="none"
          stroke="url(#gauge-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      {/* Center value */}
      <div className="absolute top-10 flex flex-col items-center">
        <span className="text-2xl font-black">{score}%</span>
        <span className="text-4xs text-slate-500 font-bold uppercase tracking-wider">Readiness</span>
      </div>
    </div>
  );
};

export default function AiInsights({ stats }) {
  const { aiInsights = {}, predictions = {} } = stats;

  const {
    performanceSummary = 'You have a good start. Focus on solving Easy/Medium level tags to gain confidence.',
    weakTopicSuggestions = ['Dynamic Programming', 'Graphs'],
    contestImprovementTips = ['Practice virtual contests', 'Avoid silly submission penalties'],
    personalizedPracticePlan = ['Phase 1: Solve Arrays', 'Phase 2: Solve Trees']
  } = aiInsights;

  const { interviewReadinessScore = 70 } = predictions;

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-[450px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-violet" /> AI Practice Advisor
        </h3>
        <span className="px-2 py-0.5 rounded bg-primary-violet/15 text-primary-violet text-4xs font-bold uppercase tracking-wider">
          AI Engine
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 items-center">
        {/* Gauge Dial Panel */}
        <div className="flex flex-col items-center justify-center">
          <GaugeDial score={interviewReadinessScore} />
          <div className="text-4xs text-slate-400 text-center max-w-[120px] mt-1.5 leading-relaxed">
            Readiness calculated from hard/medium solved ratio.
          </div>
        </div>

        {/* Performance Summary Text */}
        <div className="col-span-2 space-y-3">
          <div className="text-3xs uppercase tracking-widest font-bold text-slate-500">Performance Summary</div>
          <p className="text-3xs text-slate-400 leading-relaxed max-h-[140px] overflow-y-auto pr-1">
            {performanceSummary}
          </p>
        </div>
      </div>

      {/* Practice Plan Steps */}
      <div className="border-t border-slate-200/50 pt-4 dark:border-white/5 mt-4 space-y-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-secondary-teal">
          <CheckSquare className="h-4 w-4" /> Customized Practice Plan
        </div>
        <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
          {personalizedPracticePlan.map((step, idx) => (
            <div key={idx} className="flex gap-2 text-3xs text-slate-400 leading-relaxed">
              <span className="text-secondary-teal font-extrabold shrink-0">•</span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
