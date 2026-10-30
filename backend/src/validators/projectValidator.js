const { z } = require('zod');

const createProjectSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(200, 'Title cannot exceed 200 characters').trim(),
  topic: z.string().min(1, 'Research topic is required').max(500, 'Topic cannot exceed 500 characters').trim(),
  objective: z.string().max(2000, 'Objective cannot exceed 2000 characters').optional().default(''),
  research_questions: z.array(z.string().trim()).optional().default([]),
  mode: z.enum(['discover', 'upload', 'explore']).default('discover')
});

const updateProjectSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  topic: z.string().min(1).max(500).trim().optional(),
  objective: z.string().max(2000).optional(),
  research_questions: z.array(z.string().trim()).optional(),
  status: z.enum(['active', 'archived']).optional()
});

module.exports = {
  createProjectSchema,
  updateProjectSchema
};

