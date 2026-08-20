import { z } from 'zod';
import { createCourierSchema } from './user.schema.js';

export { createCourierSchema };

/**
 * **Explícito, no `createCourierSchema.partial()`.** El derivado ofrecía
 * `email` y `password`, que el PATCH descarta, y **omitía `vehicle_plate`**,
 * que sí acepta: quien añadiera la placa al formulario se habría encontrado un
 * error de compilación en un campo que la API guarda sin problema. Espeja
 * `services/couriers.service.ts`.
 */
export const updateCourierSchema = z.object({
  full_name: z.string().min(1).max(200).optional(),
  phone: z.string().min(1).max(30).optional(),
  document_type: z.string().min(1).max(10).optional(),
  document_number: z.string().min(1).max(50).optional(),
  transport_mode: z.string().optional(),
  vehicle_plate: z.string().optional(),
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
