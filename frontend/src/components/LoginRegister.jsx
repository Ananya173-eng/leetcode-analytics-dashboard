import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User, Sparkles, Sun, Moon } from 'lucide-react';

export default function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, signup, googleLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    if (!email || !password || (!isLogin && !username)) {
      setErrorMsg('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    let result;
    if (isLogin) {
      result = await login(email, password);
    } else {
      result = await signup(username, email, password);
    }

    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleGoogleMockLogin = async () => {
    setErrorMsg('');
    setIsLoading(true);
    
    // Simulate a Google OAuth token response
    const mockEmail = `demo_${Math.floor(Math.random() * 1000)}@gmail.com`;
    const mockUsername = `DemoCoder_${Math.floor(Math.random() * 900 + 100)}`;
    
    const result = await googleLogin({
      email: mockEmail,
      username: mockUsername,
      googleId: `google_${Date.now()}`,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(mockUsername)}`
    });

    setIsLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute right-6 top-6 rounded-full bg-white/10 p-3 text-slate-400 backdrop-blur-md transition-colors hover:bg-white/20 hover:text-white dark:bg-black/20 dark:hover:bg-black/35"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-700" />}
      </button>

      {/* Main Glassmorphic Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="z-10 w-full max-w-md overflow-hidden rounded-2xl glass-card p-8 shadow-glass transition-all duration-300 hover:shadow-neon-violet/10 dark:hover:shadow-neon-violet/20"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-violet to-secondary-teal p-3 shadow-lg pulse-neon-violet">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isLogin ? 'Welcome back' : 'Start your journey'}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {isLogin ? 'Get real-time insights from CodePulse' : 'Create an account to track your LeetCode goals'}
          </p>
        </div>

        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-3 text-center text-xs font-semibold text-red-500"
          >
            {errorMsg}
          </motion.div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleAuthSubmit}>
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <label className="sr-only">Username</label>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required={!isLogin}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="LeetCode Username or Nickname"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-primary-violet focus:bg-white focus:outline-none dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder-slate-500 dark:focus:border-primary-violet dark:focus:bg-black/30"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <label className="sr-only">Email Address</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-primary-violet focus:bg-white focus:outline-none dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder-slate-500 dark:focus:border-primary-violet dark:focus:bg-black/30"
            />
          </div>

          <div className="relative">
            <label className="sr-only">Password</label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm placeholder-slate-400 focus:border-primary-violet focus:bg-white focus:outline-none dark:border-white/10 dark:bg-black/20 dark:text-white dark:placeholder-slate-500 dark:focus:border-primary-violet dark:focus:bg-black/30"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="relative flex w-full justify-center rounded-xl bg-gradient-to-r from-primary-violet to-secondary-teal py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.01] hover:brightness-110 focus:outline-none"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : isLogin ? (
              <span className="flex items-center gap-2">Sign In <LogIn className="h-4 w-4" /></span>
            ) : (
              <span className="flex items-center gap-2">Sign Up <UserPlus className="h-4 w-4" /></span>
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white/90 px-2 text-slate-500 dark:bg-[#0B1020] dark:text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth Simulation Button */}
        <button
          onClick={handleGoogleMockLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-white/10 dark:bg-black/10 dark:text-slate-300 dark:hover:bg-black/20"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.64 5.64 0 0 1 8.35 12.96a5.64 5.64 0 0 1 5.64-5.64c2.25 0 4.188 1.223 5.253 3.038l3.418-3.418C20.612 4.908 17.514 3.12 13.99 3.12A9.84 9.84 0 0 0 4.15 12.96a9.84 9.84 0 0 0 9.84 9.84c5.44 0 9.84-4.4 9.84-9.84 0-.662-.057-1.32-.171-1.956H12.24z"
            />
          </svg>
          Google OAuth
        </button>

        <div className="mt-6 text-center text-sm">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-primary-violet hover:underline dark:text-primary-violet"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
