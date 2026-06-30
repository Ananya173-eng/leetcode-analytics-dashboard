import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Award, Star, Flame, Calendar, Sparkles } from 'lucide-react';

export default function Timeline({ stats }) {
  const timelineRef = useRef(null);
  const {
    totalSolved = 0,
    contestRating = 0,
    currentStreak = 0,
    lastSynced,
    leetcodeUsername
  } = stats;

  const milestones = [
    {
      title: 'Joined CodePulse telemetry',
      desc: 'Registered account and unlocked dashboard analytics tracking.',
      icon: <Calendar className="h-5 w-5 text-indigo-400" />,
      date: 'Step 1'
    },
    {
      title: `Linked LeetCode: @${leetcodeUsername}`,
      desc: 'Synchronized LeetCode GraphQL statistics successfully.',
      icon: <Sparkles className="h-5 w-5 text-primary-violet" />,
      date: lastSynced ? new Date(lastSynced).toLocaleDateString() : 'Linked'
    },
    {
      title: `${totalSolved} Problems Solved`,
      desc: 'Completed milestone problem solves and tag records.',
      icon: <Star className="h-5 w-5 text-yellow-500 fill-current" />,
      date: 'Solved Milestone'
    },
    {
      title: `${currentStreak} Days Streak Record`,
      desc: 'Achieved current consistency streak solving questions daily.',
      icon: <Flame className="h-5 w-5 text-orange-500 fill-current" />,
      date: 'Streak Counter'
    }
  ];

  if (contestRating > 0) {
    milestones.push({
      title: `Knight Rating: ${contestRating}`,
      desc: 'Benchmarks achieved in active competitive contest brackets.',
      icon: <Award className="h-5 w-5 text-secondary-teal" />,
      date: 'Contest Rank'
    });
  }

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline) return;

    // Select all timeline blocks
    const blocks = timeline.querySelectorAll('.timeline-block');
    
    // Animate items into view using GSAP
    gsap.fromTo(
      blocks,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out'
      }
    );
  }, [stats]);

  return (
    <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-6">
      <div>
        <h3 className="text-sm font-bold flex items-center gap-2 mb-1">
          <Calendar className="h-4.5 w-4.5 text-primary-violet" /> Personal Analytics Timeline
        </h3>
        <p className="text-3xs text-slate-400">Trace your chronological milestones and key problem-solving breakthroughs.</p>
      </div>

      {/* Vertical Timeline container */}
      <div ref={timelineRef} className="relative border-l-2 border-white/5 dark:border-white/5 ml-4 pl-8 py-4 space-y-8">
        {milestones.map((item, idx) => (
          <div key={idx} className="timeline-block relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Timeline Dot Node */}
            <div className="absolute -left-[43px] flex items-center justify-center h-8 w-8 rounded-full bg-[#0B1020] border-2 border-primary-violet p-1.5 z-20 shadow-md">
              {item.icon}
            </div>

            <div className="space-y-1 max-w-lg">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">{item.title}</h4>
              <p className="text-3xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
            
            <div className="text-5xs text-slate-500 font-bold uppercase tracking-wider bg-white/2 border border-white/5 px-2.5 py-1 rounded-full w-fit shrink-0">
              {item.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
