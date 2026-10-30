const { v4: uuidv4 } = require('uuid');
const { supabase, isSupabaseConfigured } = require('../database/supabase');

// Fallback in-memory store for projects when Supabase is not connected
const memoryProjects = new Map();

const createProject = async (userId, projectData) => {
  const newProject = {
    id: uuidv4(),
    user_id: userId,
    title: projectData.title,
    topic: projectData.topic,
    objective: projectData.objective || '',
    research_questions: projectData.research_questions || [],
    mode: projectData.mode || 'discover',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('research_projects')
      .insert([newProject])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  } else {
    memoryProjects.set(newProject.id, newProject);
    return newProject;
  }
};

const listProjects = async (userId, { status = 'all' } = {}) => {
  if (isSupabaseConfigured()) {
    let query = supabase
      .from('research_projects')
      .select(`
        *,
        documents:documents(count),
        discovered_sources:discovered_sources(count),
        conversations:conversations(count)
      `)
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(p => ({
      ...p,
      document_count: p.documents?.[0]?.count || 0,
      source_count: p.discovered_sources?.[0]?.count || 0,
      conversation_count: p.conversations?.[0]?.count || 0
    }));
  } else {
    const results = [];
    for (const project of memoryProjects.values()) {
      if (project.user_id === userId) {
        if (status === 'all' || project.status === status) {
          results.push({
            ...project,
            document_count: 0,
            source_count: 0,
            conversation_count: 0
          });
        }
      }
    }
    return results.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  }
};

const getProjectById = async (userId, projectId) => {
  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('research_projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  } else {
    const project = memoryProjects.get(projectId);
    if (!project || project.user_id !== userId) {
      return null;
    }
    return project;
  }
};

const updateProject = async (userId, projectId, updates) => {
  const sanitizedUpdates = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const { data, error } = await supabase
      .from('research_projects')
      .update(sanitizedUpdates)
      .eq('id', projectId)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle();

    if (error) throw error;
    return data;
  } else {
    const project = memoryProjects.get(projectId);
    if (!project || project.user_id !== userId) {
      return null;
    }
    const updated = { ...project, ...sanitizedUpdates };
    memoryProjects.set(projectId, updated);
    return updated;
  }
};

const deleteProject = async (userId, projectId) => {
  if (isSupabaseConfigured()) {
    const { error } = await supabase
      .from('research_projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } else {
    const project = memoryProjects.get(projectId);
    if (!project || project.user_id !== userId) {
      return false;
    }
    memoryProjects.delete(projectId);
    return true;
  }
};

module.exports = {
  createProject,
  listProjects,
  getProjectById,
  updateProject,
  deleteProject
};

