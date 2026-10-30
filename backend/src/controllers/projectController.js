const { createProjectSchema, updateProjectSchema } = require('../validators/projectValidator');
const projectService = require('../services/projectService');

const create = async (req, res, next) => {
  try {
    const validatedData = createProjectSchema.parse(req.body);
    const project = await projectService.createProject(req.user.id, validatedData);
    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'ValidationError',
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(err);
  }
};

const list = async (req, res, next) => {
  try {
    const { status } = req.query;
    const projects = await projectService.listProjects(req.user.id, { status });
    res.status(200).json({ projects });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectById(req.user.id, req.params.id);
    if (!project) {
      return res.status(404).json({
        error: 'ProjectNotFound',
        message: 'Project not found or you do not have permission to access it.'
      });
    }
    res.status(200).json({ project });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const validatedData = updateProjectSchema.parse(req.body);
    const updated = await projectService.updateProject(req.user.id, req.params.id, validatedData);
    if (!updated) {
      return res.status(404).json({
        error: 'ProjectNotFound',
        message: 'Project not found or you do not have permission to edit it.'
      });
    }
    res.status(200).json({
      message: 'Project updated successfully',
      project: updated
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'ValidationError',
        details: err.errors.map(e => ({ field: e.path.join('.'), message: e.message }))
      });
    }
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const deleted = await projectService.deleteProject(req.user.id, req.params.id);
    if (!deleted) {
      return res.status(404).json({
        error: 'ProjectNotFound',
        message: 'Project not found or you do not have permission to delete it.'
      });
    }
    res.status(200).json({
      message: 'Project deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove
};

