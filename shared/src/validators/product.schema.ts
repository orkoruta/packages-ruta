import { z } from 'zod';
import { createProductSchema, presignedUrlSchema } from './user.schema.js';

export { createProductSchema, presignedUrlSchema };

export const updateProductSchema = createProductSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
});

export const productIdParamsSchema = z.object({
  product_id: z.coerce.number().int().positive(),
});

export const productListQuerySchema = z.object({
  category_id: z.coerce.number().int().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  q: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
});
