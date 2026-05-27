import { z } from 'zod';

export const createPickupPointSchema = z.object({
  name: z.string().min(1).max(200),
  address: z.string().min(1).max(500),
  city: z.string().min(1).max(120),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  schedule: z.string().max(1000).optional(),
  contact_phone: z.string().max(30).optional(),
});

export const updatePickupPointSchema = createPickupPointSchema.partial().extend({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const pickupPointIdParamsSchema = z.object({
  pickup_point_id: z.coerce.number().int().positive(),
});
