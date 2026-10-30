import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  FolderKanban,
  FileText,
  Search,
  MessageSquareText,
  Plus,
  ArrowRight,
  Sparkles,
  Compass,
  Clock,
  UploadCloud,
  ChevronRight,
  ShieldCheck,
  Loader2
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute live aggregates across projects
  const totalProjects = projects.length;
  const totalDocuments = projects.reduce((acc, p) => acc + (p.document_count || 0), 0);
  const totalSources = projects.reduce((acc, p) => acc + (p.source_count || 0), 0);
  const totalConversations = projects.reduce((acc, p) => acc + (p.conversation_count || 0), 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-brand-900/40 via-navy-900 to-indigo-950/40 border border-brand-500/20 shadow-sm">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-brand-500/10 text-brand-400 text-[11px] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Research Workspace Ready</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || 'Researcher'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Synthesize academic papers, explore topics, ask grounded RAG questions, and discover unaddressed research gaps.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/discover"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs shadow-md shadow-brand-500/20 flex items-center space-x-2 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Discover Topics</span>
          </Link>
          <Link
            to="/projects"
            className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-200 font-medium text-xs flex items-center space-x-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Research Projects</span>
            <FolderKanban className="w-4 h-4 text-brand-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalProjects}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Active workspaces</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Parsed Documents</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalDocuments}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">PDF, DOCX, TXT embedded</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Discovered Sources</span>
            <Search className="w-4 h-4 text-accent-cyan" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalSources}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">OpenAlex, Crossref, Semantic</p>
        </div>

        <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Grounded Dialogues</span>
            <MessageSquareText className="w-4 h-4 text-accent-purple" />
          </div>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalConversations}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Verified cited threads</p>
        </div>
      </div>

      {/* Quick Launchpad - The 3 Modes */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Quick Launchpad
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/discover"
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/60 hover:border-brand-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-500 flex items-center justify-center mb-3">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                Discover Mode
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Enter any topic. Query OpenAlex, Crossref, and Semantic Scholar with automated query generation.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 space-x-1">
              <span>Start Discovery</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/documents"
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/60 hover:border-indigo-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
                <UploadCloud className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                Upload Mode
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ingest PDF, DOCX, TXT files with page-aware chunking and 768d vector embeddings.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 space-x-1">
              <span>Upload Papers</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/explore"
            className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900/60 hover:border-purple-500 transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-500 transition-colors">
                Explore Mode
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Vague interest? Brainstorm research questions, keywords, and seed literature with Gemini.
              </p>
            </div>
            <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 space-x-1">
              <span>Explore Ideas</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Recent Research Projects
          </h2>
          <Link
            to="/projects"
            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-navy-900">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500 mb-2" />
            <p className="text-xs text-slate-500">Loading your research workspaces...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-navy-900/20">
            <FolderKanban className="w-10 h-10 mx-auto text-slate-400 mb-3" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Research Projects Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Create your first project to organize discovered papers, uploaded documents, and gap analyses.
            </p>
            <Link
              to="/projects"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 6).map((project) => (
              <Link
                key={project.id}
                to={`/workspace/${project.id}`}
                className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 hover:border-brand-500/60 shadow-sm transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    {project.mode} mode
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(project.updated_at).toLocaleDateString()}</span>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-1">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {project.topic}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{project.document_count || 0} Docs • {project.source_count || 0} Sources</span>
                  <span className="text-brand-500 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                    <span>Open</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

