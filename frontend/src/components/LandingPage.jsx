import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sparkles, 
  Terminal, 
  LineChart, 
  Trophy, 
  BrainCircuit, 
  Flame, 
  ShieldCheck, 
  Sun, 
  Moon, 
  ArrowRight,
  TrendingUp,
  Cpu,
  Share2,
  Lock,
  ChevronDown
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  const faqData = [
    {
      q: "How does CodePulse sync with LeetCode?",
      a: "We use LeetCode's public GraphQL endpoint. You simply enter your LeetCode username (no password needed), and we dynamically fetch your solved counts, tag distribution, and contest histories."
    },
    {
      q: "Is there a local fallback if LeetCode is offline?",
      a: "Yes! CodePulse includes a high-fidelity Mock Data Generator that simulates a realistic, fully-featured user history and contest tracker so you can explore all platform tools immediately."
    },
    {
      q: "How does the AI Insights engine work?",
      a: "The backend contains a sophisticated rule-based analysis script. It inspects your solved problem counts across difficulty metrics and tag classes (e.g. DP, graphs) to outline specific practice phases."
    },
    {
      q: "Can I compare my stats with friends?",
      a: "Absolutely. Once you add friends by their email address, you can view side-by-side performance cards, tag distribution charts, and race together on the Friends Leaderboard."
    }
  ];

  return (
    <div className="z-10 min-h-screen">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200/50 bg-white/70 backdrop-blur-lg dark:border-white/5 dark:bg-[#0B1020]/75">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-violet to-secondary-teal text-white shadow-md shadow-primary-violet/10">
              <Terminal className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary-violet to-secondary-teal bg-clip-text text-transparent">
              CodePulse
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="rounded-full bg-slate-100 p-2 text-slate-600 transition-colors hover:bg-slate-200 dark:bg-white/5 dark:text-slate-400 dark:hover:bg-white/10"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
            </button>
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-violet to-secondary-teal px-4 py-2 text-sm font-semibold text-white shadow-md hover:brightness-110"
              >
                Dashboard <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-16 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div 
            variants={itemVariants} 
            className="mx-auto flex max-w-fit items-center gap-1.5 rounded-full border border-primary-violet/20 bg-primary-violet/5 px-4 py-1.5 text-xs font-semibold text-primary-violet"
          >
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen LeetCode Analytics
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-slate-900 via-primary-violet to-secondary-teal dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent"
          >
            Transform Your LeetCode Journey <br />
            <span className="bg-gradient-to-r from-primary-violet to-secondary-teal bg-clip-text text-transparent">
              Into Actionable Insights
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mx-auto max-w-2xl text-lg text-slate-500 dark:text-slate-400"
          >
            Elevate your coding practice. Sync your LeetCode profile, visualize topic weaknesses, trace contest progress, unlock gamified rewards, and get customized AI-powered roadmaps.
          </motion.p>

          <motion.div variants={itemVariants} className="flex justify-center gap-4 pt-4">
            <button
              onClick={() => navigate(user ? '/dashboard' : '/login')}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-violet to-secondary-teal px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:scale-[1.01] hover:brightness-110"
            >
              Get Started Free <ArrowRight className="h-5 w-5" />
            </button>
            <a
              href="#features"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
            >
              Explore Features
            </a>
          </motion.div>
        </motion.div>

        {/* Dashboard Preview Graphic */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="relative mx-auto mt-16 max-w-5xl rounded-2xl border border-slate-200/50 bg-slate-900/5 p-2 backdrop-blur-md dark:border-white/5 dark:bg-slate-950/20"
        >
          {/* Top Bar window controls */}
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-200/30 dark:border-white/5">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>
          
          {/* Mock Dashboard Illustration */}
          <div className="bg-slate-950/80 rounded-b-xl overflow-hidden aspect-[16/9] flex flex-col p-6 text-left relative">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Total Solved', val: '435', desc: '+15 this week', color: 'from-primary-violet to-violet-500' },
                { label: 'Contest Rating', val: '1,842', desc: 'Top 4.2%', color: 'from-secondary-teal to-teal-500' },
                { label: 'Current Streak', val: '18 Days', desc: 'Longest: 42 Days', color: 'from-orange-500 to-highlight-orange' },
                { label: 'Interview Readiness', val: '84%', desc: 'Strong Array & DP', color: 'from-green-500 to-emerald-400' }
              ].map((card, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${card.color}`}></div>
                  <div className="text-slate-400 text-xs">{card.label}</div>
                  <div className="text-2xl font-bold mt-1 text-white">{card.val}</div>
                  <div className="text-slate-500 text-2xs mt-0.5">{card.desc}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1">
              <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-white">Monthly Solved Trend</span>
                  <span className="text-2xs text-slate-500">Jan - Jun</span>
                </div>
                {/* SVG mock graph */}
                <div className="flex-1 flex items-end gap-3 pt-4">
                  {[20, 35, 45, 60, 55, 80].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                      <div className="w-full bg-gradient-to-t from-primary-violet to-secondary-teal rounded-t-sm" style={{ height: `${h}%` }}></div>
                      <span className="text-3xs text-slate-500">M{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                <span className="text-xs font-bold text-white mb-2 block">Skill Intelligence</span>
                <div className="flex-1 flex items-center justify-center relative">
                  <div className="w-20 h-20 rounded-full border-4 border-primary-violet/20 border-t-primary-violet border-r-secondary-teal animate-spin"></div>
                  <span className="absolute text-2xs font-bold text-white">DP Mastery</span>
                </div>
                <div className="text-3xs text-slate-400 text-center mt-2">Weak area detected: Dynamic Programming</div>
              </div>
            </div>

            {/* Glowing accents */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-violet/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-secondary-teal/20 rounded-full blur-3xl"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="bg-slate-100/50 py-24 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-950 dark:text-white">
              Tailored Analytics for Target Growth
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Stop guessing. Leverage professional-grade dashboard tools to catalog coding goals and review metrics.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Flame className="h-6 w-6 text-highlight-orange" />,
                title: "Consistency Engine",
                desc: "Calculate streaks backward from today and analyze details on missed days via our custom GitHub-style calendar mapping."
              },
              {
                icon: <BrainCircuit className="h-6 w-6 text-primary-violet" />,
                title: "AI-Powered Insights",
                desc: "Analyze tags and difficulty distributions to pinpoint structural weaknesses, creating customized practice schedules."
              },
              {
                icon: <Trophy className="h-6 w-6 text-yellow-500" />,
                title: "Contest Metrics",
                desc: "Map ranking historical trends, plot Knight or Guardian progress milestones, and benchmark performance."
              },
              {
                icon: <TrendingUp className="h-6 w-6 text-secondary-teal" />,
                title: "Smart Predictions",
                desc: "Forecast expected contest ratings, review consistency ratings, and estimate software interview readiness scores."
              },
              {
                icon: <Share2 className="h-6 w-6 text-indigo-400" />,
                title: "Competitive Leaderboard",
                desc: "Track global standings or compare side-by-side details (easy/medium/hard solves and rating histories) with friends."
              },
              {
                icon: <Terminal className="h-6 w-6 text-emerald-400" />,
                title: "Bookmarks & Journal",
                desc: "Log complexity structures, add revision notes to challenging LeetCode entries, and map study calendars."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="glass-card glass-card-hover rounded-2xl p-6 border border-slate-200/50 dark:border-white/5 dark:bg-card-dark"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 dark:bg-white/5 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center space-y-3">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-950 dark:text-white">
              Completely Free, Self-Contained Analytics
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400">
              Deploy local nodes, test mock data, or sync global accounts instantly.
            </p>
          </div>

          <div className="mt-16 flex justify-center">
            <div className="w-full max-w-md rounded-2xl gradient-border-card p-8 shadow-glass text-center relative overflow-hidden dark:bg-card-dark">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-primary-violet to-secondary-teal text-white text-3xs font-extrabold uppercase px-3 py-1 rounded-bl-lg">
                Active Tier
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Developer Edition</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Everything you need to master DSA contests.</p>
              <div className="my-6">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">$0</span>
                <span className="text-slate-500">/ forever</span>
              </div>
              <ul className="space-y-3 text-left text-sm text-slate-600 dark:text-slate-300 mb-8">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-secondary-teal" /> GraphQL synchronization
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-secondary-teal" /> Interactive Radar and Trends charts
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-secondary-teal" /> AI insight roadmap recommendations
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4.5 w-4.5 text-secondary-teal" /> Streaks calendar, goals & achievements
                </li>
              </ul>
              <button
                onClick={() => navigate(user ? '/dashboard' : '/login')}
                className="w-full rounded-xl bg-gradient-to-r from-primary-violet to-secondary-teal py-3 text-sm font-semibold text-white hover:brightness-110"
              >
                {user ? 'Go to Dashboard' : 'Start Practicing'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-100/50 py-24 dark:bg-slate-950/20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-extrabold text-center mb-16 text-slate-950 dark:text-white">Loved by Software Engineers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                text: "CodePulse completely overhauled how I review LeetCode tags. The AI-powered Insight plan pointed out DP weaknesses I was ignoring.",
                author: "Siddharth S.",
                title: "Software Engineer at Google"
              },
              {
                text: "The contest progress graphs and side-by-side buddy comparisons helped me stay consistent. Knight rating unlocked in just 3 months!",
                author: "Tanya M.",
                title: "SWE Intern at Stripe"
              },
              {
                text: "An incredibly slick tool. The PDF export function is perfect for adding DSA stats to my resume, and the dark theme is gorgeous.",
                author: "Aman K.",
                title: "Undergraduate CSE"
              }
            ].map((t, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-white/5 dark:bg-card-dark">
                <p className="text-sm italic text-slate-600 dark:text-slate-300">"{t.text}"</p>
                <div className="mt-4 font-bold text-slate-900 dark:text-white text-sm">{t.author}</div>
                <div className="text-3xs text-slate-500">{t.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-extrabold text-center mb-12 text-slate-950 dark:text-white">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl border border-slate-200/50 overflow-hidden dark:border-white/5 dark:bg-card-dark">
                <button
                  onClick={() => toggleFaq(i)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-slate-900 dark:text-white"
                >
                  {faq.q}
                  <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/20 dark:border-white/5 pt-3 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 py-12 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-tr from-primary-violet to-secondary-teal text-white">
              <Terminal className="h-3.5 w-3.5" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">CodePulse</span>
          </div>
          <div className="text-xs text-slate-500">
            &copy; 2026 CodePulse Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
