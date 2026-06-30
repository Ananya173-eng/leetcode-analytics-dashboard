import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  RefreshCw, 
  LogOut, 
  Sun, 
  Moon, 
  LayoutDashboard, 
  Trophy, 
  Target, 
  Users, 
  BookOpen, 
  Sparkles, 
  User,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';

// Import subcomponents (we will create these next)
import OverviewCards from './OverviewCards';
import SolveTrends from './SolveTrends';
import SkillRadar from './SkillRadar';
import ContestAnalytics from './ContestAnalytics';
import GoalTracker from './GoalTracker';
import AiInsights from './AiInsights';
import CompetitiveCompare from './CompetitiveCompare';
import Leaderboard from './Leaderboard';
import Achievements from './Achievements';
import Predictions from './Predictions';
import Journal from './Tools/Journal';
import Timeline from './Tools/Timeline';
import ReportExporter from './Tools/ReportExporter';

export default function DashboardLayout() {
  const { user, logout, syncLeetCode, getLeetCodeProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [activeTab, setActiveTab] = useState('overview'); // overview, contest, goals, social, tools
  const [profileData, setProfileData] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [syncError, setSyncError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load profile data
  const loadProfile = async () => {
    setIsFetching(true);
    try {
      const res = await getLeetCodeProfile();
      if (res.synced) {
        setProfileData(res.data);
      } else {
        setProfileData(null);
      }
    } catch (e) {
      console.error('Failed to load profile data:', e);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Sync LeetCode action
  const handleSyncSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!usernameInput) return;
    
    setSyncing(true);
    setSyncError('');
    
    const res = await syncLeetCode(usernameInput);
    setSyncing(false);
    
    if (res.success) {
      setProfileData(res.data);
      setUsernameInput('');
    } else {
      setSyncError(res.message);
    }
  };

  const triggerRefresh = async () => {
    if (!profileData?.leetcodeUsername) return;
    setSyncing(true);
    const res = await syncLeetCode(profileData.leetcodeUsername);
    setSyncing(false);
    if (res.success) {
      setProfileData(res.data);
    }
  };

  const navItems = [
    { id: 'overview', name: 'Overview', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
    { id: 'contest', name: 'Contest Analytics', icon: <Trophy className="h-4.5 w-4.5" /> },
    { id: 'goals', name: 'Goals & AI Insights', icon: <Target className="h-4.5 w-4.5" /> },
    { id: 'social', name: 'Leaderboard & Friends', icon: <Users className="h-4.5 w-4.5" /> },
    { id: 'tools', name: 'Coding Journal & Timeline', icon: <BookOpen className="h-4.5 w-4.5" /> }
  ];

  if (isFetching) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0B1020]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-violet border-t-transparent"></div>
          <span className="text-sm font-semibold text-slate-400">Loading your profile telemetry...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex text-slate-900 dark:text-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 bg-white/40 backdrop-blur-md dark:border-white/5 dark:bg-[#0b1020]/45 p-6 z-25">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-primary-violet to-secondary-teal text-white shadow">
            <Terminal className="h-4.5 w-4.5" />
          </div>
          <span className="font-extrabold text-lg bg-gradient-to-r from-primary-violet to-secondary-teal bg-clip-text text-transparent">CodePulse</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === item.id 
                  ? 'bg-gradient-to-r from-primary-violet/10 to-secondary-teal/10 text-primary-violet border-l-4 border-primary-violet dark:text-primary-violet' 
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </nav>

        {/* Sidebar footer profile details */}
        <div className="border-t border-slate-200/50 pt-4 dark:border-white/5 mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${user?.username}`} 
              className="h-8 w-8 rounded-full border border-primary-violet/20" 
              alt="avatar" 
            />
            <div className="truncate w-28">
              <div className="text-xs font-bold truncate">{user?.username}</div>
              <div className="text-3xs text-slate-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button 
            onClick={logout} 
            title="Log Out"
            className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#0B1020] border-r border-slate-200 dark:border-white/5 p-6 z-40 lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-8">
              <span className="font-extrabold text-lg text-primary-violet">CodePulse</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg border border-slate-200 dark:border-white/10">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === item.id 
                      ? 'bg-primary-violet/10 text-primary-violet border-l-4 border-primary-violet' 
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </button>
              ))}
            </nav>
            <div className="border-t border-slate-200 dark:border-white/5 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={user?.avatar} className="h-8 w-8 rounded-full" alt="avatar" />
                <span className="text-xs font-bold truncate w-24">{user?.username}</span>
              </div>
              <button onClick={logout} className="p-2 text-slate-400 hover:text-red-500"><LogOut className="h-4.5 w-4.5" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 z-20">
        {/* Top Navbar */}
        <header className="border-b border-slate-200/50 bg-white/30 backdrop-blur-md dark:border-white/5 dark:bg-[#0b1020]/25 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-white/10">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold tracking-tight">
              {navItems.find(t => t.id === activeTab)?.name}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {profileData && (
              <button
                onClick={triggerRefresh}
                disabled={syncing}
                title="Synchronize Stats"
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:border-white/10 dark:text-slate-400 dark:hover:bg-white/5"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin text-primary-violet' : ''}`} />
                {syncing ? 'Syncing...' : 'Sync LeetCode'}
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="rounded-lg bg-slate-100 p-2 text-slate-600 dark:bg-white/5 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full space-y-6">
          {!profileData ? (
            /* Sync Overlay for New Profiles */
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card rounded-2xl p-8 max-w-lg mx-auto border border-slate-200/60 dark:border-white/10 shadow-glass text-center my-12"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-violet/10 border border-primary-violet/20 text-primary-violet mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Link LeetCode Account</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                To generate your analytics dashboard, please provide your LeetCode username. We only query public statistics from their GraphQL.
              </p>

              {syncError && (
                <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-xs font-semibold text-red-500 flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {syncError}
                </div>
              )}

              <form onSubmit={handleSyncSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  required
                  placeholder="LeetCode Username (e.g. alex)"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  disabled={syncing}
                  className="flex-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm placeholder-slate-400 focus:outline-none dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder-slate-500"
                />
                <button
                  type="submit"
                  disabled={syncing}
                  className="rounded-xl bg-gradient-to-r from-primary-violet to-secondary-teal px-6 py-3 text-sm font-semibold text-white shadow-md hover:brightness-110 flex items-center justify-center gap-2"
                >
                  {syncing ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Synchronizing...
                    </>
                  ) : (
                    'Link & Fetch'
                  )}
                </button>
              </form>

              <div className="mt-6 border-t border-slate-200/50 pt-4 dark:border-white/5 text-xs text-slate-400">
                Tip: Enter <span className="font-semibold text-primary-violet dark:text-primary-violet">demo</span> to populate realistic mock dashboard statistics instantly.
              </div>
            </motion.div>
          ) : (
            /* Activated Dashboard Content based on Tabs */
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 page-container"
              >
                {activeTab === 'overview' && (
                  <>
                    {/* Header Widget for PDF Export */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-extrabold">Welcome back, {user?.username}</h2>
                        <p className="text-xs text-slate-500">Currently analyzing LeetCode profile: <span className="font-semibold text-primary-violet">@{profileData.leetcodeUsername}</span></p>
                      </div>
                      <ReportExporter containerId="dashboard-capture-root" />
                    </div>

                    {/* Capturable Dashboard Area */}
                    <div id="dashboard-capture-root" className="space-y-6 p-1 rounded-xl">
                      <OverviewCards stats={profileData} />
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                          <SolveTrends stats={profileData} />
                        </div>
                        <div>
                          <SkillRadar stats={profileData} />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'contest' && (
                  <div className="space-y-6">
                    <ContestAnalytics stats={profileData} />
                    <Predictions stats={profileData} />
                  </div>
                )}

                {activeTab === 'goals' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <GoalTracker stats={profileData} onUpdate={loadProfile} />
                    <AiInsights stats={profileData} />
                  </div>
                )}

                {activeTab === 'social' && (
                  <div className="space-y-6">
                    <Leaderboard />
                    <div className="grid grid-cols-1 gap-6">
                      <CompetitiveCompare stats={profileData} />
                      <Achievements stats={profileData} />
                    </div>
                  </div>
                )}

                {activeTab === 'tools' && (
                  <div className="space-y-6">
                    <Journal />
                    <Timeline stats={profileData} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>
    </div>
  );
}
