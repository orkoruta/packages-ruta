import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(160),
  description: z.string().max(1000).optional(),
  sort_order: z.number().int().min(0).default(0),
});

export const updateCategorySchema = createCategorySchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
});

export const categoryIdParamsSchema = z.object({
  category_id: z.coerce.number().int().positive(),
});

export const categoryListQuerySchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(50),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
