const { z } = require('zod');

const createSchemeSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().optional(),
  state: z.string().optional(),
  educationLevel: z.string().optional(),
  gender: z.enum(['Male', 'Female', 'All']).optional(),
  eligibility: z.string(),
  incomeLimit: z.number().min(0).optional(),
  benefits: z.string(),
  requiredDocuments: z.array(z.string()).optional(),
  officialLink: z.string().url(),
  deadline: z.coerce.date().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

const updateSchemeSchema = createSchemeSchema.partial();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  q: z.string().optional(),
  state: z.string().optional(),
  category: z.string().optional(),
  educationLevel: z.string().optional(),
  income: z.coerce.number().min(0).optional(),
  gender: z.string().optional(),
  sort: z.enum(['newest', 'deadline', 'popular']).optional(),
});

module.exports = { createSchemeSchema, updateSchemeSchema, listQuerySchema };
