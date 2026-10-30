import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Sun, 
  Moon, 
  LogOut, 
  ShieldCheck, 
  Sparkles,
  User,
  FlaskConical
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-navy-900/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between">
      {/* Brand & Tagline */}
      <div className="flex items-center space-x-3">
        <Link to={user ? "/dashboard" : "/"} className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-accent-cyan p-0.5 shadow-md shadow-brand-500/20">
            <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-accent-cyan group-hover:scale-110 transition-transform duration-200" />
            </div>
          </div>
          <div>
            <span className="text-base font-bold tracking-tight bg-gradient-to-r from-slate-900 via-brand-600 to-indigo-600 dark:from-white dark:via-brand-400 dark:to-accent-cyan bg-clip-text text-transparent">
              ResearchForge<span className="text-accent-cyan ml-0.5">AI</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-400 dark:text-slate-500 border-l border-slate-300 dark:border-slate-700 pl-2">
              Actionable Intelligence
            </span>
          </div>
        </Link>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Privacy Shield Indicator */}
        {user && (
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>AI Opt-Out Active</span>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Menu / Auth Buttons */}
        {user ? (
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-accent-purple flex items-center justify-center text-white text-xs font-semibold uppercase shadow-sm">
                {user.name ? user.name[0] : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[120px]">{user.name || user.email}</p>
                <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{user.email}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-brand-500 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

