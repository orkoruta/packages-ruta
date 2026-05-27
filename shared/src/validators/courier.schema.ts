import { z } from 'zod';
import { createCourierSchema } from './user.schema.js';

export { createCourierSchema };

export const updateCourierSchema = createCourierSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export const courierIdParamsSchema = z.object({
  courier_user_id: z.coerce.number().int().positive(),
});

export const courierListQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateCourierInput = z.infer<typeof createCourierSchema>;
export type UpdateCourierInput = z.infer<typeof updateCourierSchema>;
export type CourierListQuery = z.infer<typeof courierListQuerySchema>;
