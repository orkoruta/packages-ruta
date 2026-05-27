import { z } from 'zod';
import { createCourierSchema } from './user.schema.js';

export { createCourierSchema };

export const updateCourierSchema = createCourierSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

export const courierIdParamsSchema = z.object({
  courier_user_id: z.coerce.number().int().positive(),
});
