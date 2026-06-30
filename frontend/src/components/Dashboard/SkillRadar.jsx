import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { BrainCircuit, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function SkillRadar({ stats }) {
  const { theme } = useTheme();
  const { tagSolvedCount = [], aiInsights = {} } = stats;

  const topicsList = [
    { name: 'Array', label: 'Arrays' },
    { name: 'String', label: 'Strings' },
    { name: 'Dynamic Programming', label: 'DP' },
    { name: 'Tree', label: 'Trees' },
    { name: 'Depth-First Search', label: 'Graphs' },
    { name: 'Greedy', label: 'Greedy' },
    { name: 'Binary Search', label: 'Binary Search' },
    { name: 'Sliding Window', label: 'Sliding Window' }
  ];

  // Map tagSolvedCount database format to radar subjects
  const tagMap = {};
  tagSolvedCount.forEach(t => {
    tagMap[t.tagName] = t.solvedCount;
  });

  const radarData = topicsList.map(topic => {
    let count = tagMap[topic.name] || 0;
    // Map DFS to graph counts (grouping DFS, BFS, Graph)
    if (topic.name === 'Depth-First Search') {
      const dfs = tagMap['Depth-First Search'] || 0;
      const bfs = tagMap['Breadth-First Search'] || 0;
      const graph = tagMap['Graph'] || 0;
      count = Math.max(dfs, Math.round((dfs + bfs + graph) / 2));
    }

    return {
      subject: topic.label,
      solvedCount: count,
      fullMark: Math.max(80, (tagMap['Array'] || 50)) // scale relative to Arrays
    };
  });

  const weakTopics = aiInsights.weakTopicSuggestions || ['Dynamic Programming', 'Graphs'];

  // Calculate mastery percentages
  const masteryScores = radarData.map(d => {
    const pct = Math.min(100, Math.round((d.solvedCount / d.fullMark) * 100)) || 10;
    let label = 'Beginner';
    let color = 'text-red-400 bg-red-500/10 border-red-500/20';

    if (pct > 75) {
      label = 'Master';
      color = 'text-green-400 bg-green-500/10 border-green-500/20';
    } else if (pct > 40) {
      label = 'Intermediate';
      color = 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    }

    return {
      subject: d.subject,
      percentage: pct,
      levelLabel: label,
      colorClass: color
    };
  });

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col justify-between h-[665px]">
      <div>
        <h3 className="text-sm font-bold flex items-center gap-2 mb-2">
          <BrainCircuit className="h-4 w-4 text-primary-violet" /> Skill Intelligence
        </h3>
        <p className="text-3xs text-slate-400">Algorithmic topic solved ratios mapped globally.</p>
      </div>

      {/* Radar Chart Container */}
      <div className="h-[220px] w-full flex items-center justify-center my-4">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
            <PolarGrid stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748B', fontSize: 10, fontWeight: 600 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fill: '#475569', fontSize: 8 }} />
            <Radar
              name="Solved Count"
              dataKey="solvedCount"
              stroke="#8B5CF6"
              fill="#8B5CF6"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Mastery List */}
      <div className="space-y-3 flex-1 overflow-y-auto pr-1">
        <h4 className="text-2xs font-bold text-slate-400 uppercase tracking-wider mb-2">Topic Mastery Ratios</h4>
        {masteryScores.slice(0, 5).map((score, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{score.subject}</span>
            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded-full border text-4xs font-bold uppercase ${score.colorClass}`}>
                {score.levelLabel}
              </span>
              <span className="font-extrabold w-8 text-right">{score.percentage}%</span>
            </div>
          </div>
        ))}
      </div>

      {/* Weak Areas Detected */}
      <div className="border-t border-slate-200/50 pt-4 dark:border-white/5 mt-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-500">
          <AlertCircle className="h-4 w-4" /> Weak Areas Detected
        </div>
        <div className="flex flex-wrap gap-2">
          {weakTopics.map((t, i) => (
            <span key={i} className="text-3xs font-semibold px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400">
              {t}
            </span>
          ))}
        </div>
        <div className="flex gap-2 text-3xs text-slate-400 mt-1 leading-relaxed">
          <CheckCircle2 className="h-4 w-4 text-secondary-teal shrink-0" />
          <span>Recommended study order: practice easy recursive solutions in {weakTopics[0] || 'DP'} first.</span>
        </div>
      </div>
    </div>
  );
}
