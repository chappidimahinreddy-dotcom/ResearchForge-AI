import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../components/Toast';
import {
  FolderKanban,
  Plus,
  Search,
  Archive,
  Trash2,
  ExternalLink,
  Loader2,
  Calendar,
  X,
  FileText,
  Bookmark
} from 'lucide-react';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const { addToast } = useToast();

  // New Project Form State
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [objective, setObjective] = useState('');
  const [mode, setMode] = useState('discover');

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await api.get('/projects', { params: { status: filter } });
      setProjects(res.data.projects || []);
    } catch (err) {
      addToast('Failed to load projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [filter]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) {
      addToast('Title and topic are required.', 'error');
      return;
    }

    setCreating(true);
    try {
      const res = await api.post('/projects', {
        title: title.trim(),
        topic: topic.trim(),
        objective: objective.trim(),
        mode
      });
      addToast('Project created successfully!', 'success');
      setIsModalOpen(false);
      setTitle('');
      setTopic('');
      setObjective('');
      fetchProjects();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to create project.', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleArchive = async (project) => {
    const newStatus = project.status === 'active' ? 'archived' : 'active';
    try {
      await api.put(`/projects/${project.id}`, { status: newStatus });
      addToast(`Project ${newStatus === 'archived' ? 'archived' : 'restored'}.`, 'info');
      fetchProjects();
    } catch {
      addToast('Failed to update project status.', 'error');
    }
  };

  const handleDeleteProject = async (id, projectTitle) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${projectTitle}" and all its documents and vectors?`)) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      addToast('Project deleted successfully.', 'success');
      fetchProjects();
    } catch {
      addToast('Failed to delete project.', 'error');
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center space-x-2">
            <FolderKanban className="w-6 h-6 text-brand-500" />
            <span>My Research Projects</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your segregated research workspaces and investigation branches.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900">
        <div className="flex items-center space-x-1.5 w-full sm:w-auto">
          {['all', 'active', 'archived'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                filter === tab
                  ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title/topic..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="p-12 text-center">
          <Loader2 className="w-7 h-7 animate-spin mx-auto text-brand-500 mb-2" />
          <p className="text-xs text-slate-500">Loading your research workspaces...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white/40 dark:bg-navy-900/20">
          <FolderKanban className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No projects found</p>
          <p className="text-xs text-slate-500 mt-0.5">Try adjusting your search or click 'New Research Project'.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                    project.status === 'archived'
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      : 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
                  }`}>
                    {project.status === 'archived' ? 'Archived' : `${project.mode} mode`}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleToggleArchive(project)}
                      title={project.status === 'active' ? 'Archive Project' : 'Restore Project'}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id, project.title)}
                      title="Delete Project"
                      className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <Link
                  to={`/workspace/${project.id}`}
                  className="block group"
                >
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {project.topic}
                  </p>
                </Link>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </span>
                <Link
                  to={`/workspace/${project.id}`}
                  className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <span>Open Workspace</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <FolderKanban className="w-5 h-5 text-brand-500" />
                <span>Initialize Research Project</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. LLM Security Benchmarks in Production"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Core Research Topic *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Prompt injection vulnerability surfaces in RAG architectures"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Objective (Optional)
                </label>
                <textarea
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="What key insights or answers are you seeking to discover?"
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Entry Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'discover', label: 'Discover' },
                    { id: 'upload', label: 'Upload' },
                    { id: 'explore', label: 'Explore' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`py-2 text-xs font-medium rounded-xl border transition-all ${
                        mode === m.id
                          ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:opacity-60 text-white text-xs font-semibold shadow flex items-center space-x-1.5"
                >
                  {creating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Initialize Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;

