import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Compass,
  FolderKanban,
  FileText,
  MessageSquareText,
  GitCompare,
  Lightbulb,
  Network,
  FileCheck2,
  Settings,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { projectId } = useParams();

  const navItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { name: 'Discover Research', to: '/discover', icon: Search, badge: 'Mode 1' },
    { name: 'Explore Topics', to: '/explore', icon: Compass, badge: 'Mode 3' },
    { name: 'My Research', to: '/projects', icon: FolderKanban },
    { name: 'Documents', to: '/documents', icon: FileText, badge: 'Mode 2' },
    { name: 'AI Research Chat', to: '/chat', icon: MessageSquareText },
    { name: 'Research Comparison', to: '/compare', icon: GitCompare },
    { name: 'Research Gap Finder', to: '/gaps', icon: Lightbulb, highlight: true },
    { name: 'Knowledge Map', to: '/knowledge-map', icon: Network },
    { name: 'Reports & Export', to: '/reports', icon: FileCheck2 },
    { name: 'Settings & Privacy', to: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 flex flex-col justify-between py-4">
      <div className="space-y-6">
        {/* Workspace Quick-Jump if active */}
        {projectId && (
          <div className="px-4">
            <div className="p-3 bg-brand-500/10 border border-brand-500/20 rounded-xl">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                Active Project
              </span>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                Current Workspace
              </p>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  } ${item.highlight ? 'relative font-medium text-purple-600 dark:text-purple-400' : ''}`
                }
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-purple-500' : ''}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                    {item.badge}
                  </span>
                )}
                {item.highlight && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold">
                    Flagship
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="px-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Gemini & pgvector Ready</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

