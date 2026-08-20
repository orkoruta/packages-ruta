import { z } from 'zod';

/**
 * Puntos físicos de recogida.
 *
 * **Estos esquemas se reescribieron el 2026-08-11 para que coincidan con lo que
 * el backend valida de verdad.** Los que había aquí describían otro contrato:
 * decían `address` y `schedule` donde la API espera `address_line` y
 * `opening_hours`, les faltaban `state`, `country` y `postal_code`, y el
 * parámetro de ruta era `pickup_point_id` en vez de `id`. Nadie los usaba —el
 * backend tenía su propia copia en `services/pickup_points.service.ts`— pero
 * cualquiera que se hubiera fiado de ellos habría mandado campos que Zod
 * descarta en silencio.
 *
 * La fuente de verdad es esta. El servicio los reexporta.
 */

export const pickupPointStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);

/** Ojo: este endpoint filtra con `search`, no con `q` como compradores y repartidores. */
export const pickupPointListQuerySchema = z.object({
  search: z.string().trim().min(1).max(120).optional(),
  status: pickupPointStatusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
});

export const createPickupPointSchema = z.object({
  name: z.string().min(1).max(200),
  address_line: z.string().min(1).max(500),
  city: z.string().min(1).max(100).optional(),
  state: z.string().min(1).max(100).optional(),
  country: z.string().min(1).max(10).optional(),
  postal_code: z.string().min(1).max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  opening_hours: z.record(z.unknown()).optional(),
  contact_phone: z.string().min(1).max(30).optional(),
});

export const updatePickupPointSchema = createPickupPointSchema.partial();

export const pickupPointIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export type PickupPointStatus = z.infer<typeof pickupPointStatusSchema>;
export type CreatePickupPointInput = z.infer<typeof createPickupPointSchema>;
export type UpdatePickupPointInput = z.infer<typeof updatePickupPointSchema>;
export type PickupPointListQuery = z.infer<typeof pickupPointListQuerySchema>;
