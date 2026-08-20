import { z } from 'zod';

/**
 * Estados de un Cliente. Espeja el CHECK de `ruta.clients`, que solo admite
 * estos dos.
 *
 * Aquí decía `['ACTIVE','SUSPENDED','ARCHIVED']`: dos valores que **Postgres
 * rechaza** con un 23514. Nadie los usaba porque el servicio tenía su propia
 * copia, pero era una trampa esperando a quien se fiara del contrato publicado
 * — el mismo fallo que tuvo `order_origin`.
 */
export const clientStatusSchema = z.enum(['ACTIVE', 'INACTIVE']);
import { ClientType } from '../enums/index.js';
import { createClientSchema } from './user.schema.js';

export { createClientSchema };

export const updateClientSchema = z.object({
  business_code: z.string().min(1).max(20).optional(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/).optional(),
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  client_type: z.nativeEnum(ClientType).optional(),
  frontend_mode: z.enum(['NATIVE_RUTA', 'CUSTOM_LANDING_BY_RUTA']).optional(),
  status: clientStatusSchema.optional(),
});

export const clientIdParamsSchema = z.object({
  client_id: z.coerce.number().int().positive(),
});

export const clientSlugParamsSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

export const clientTypeSchema = z.nativeEnum(ClientType);

export const clientListQuerySchema = z.object({
  status: clientStatusSchema.optional(),
  client_type: z.nativeEnum(ClientType).optional(),
  q: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
});

export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientListQuery = z.infer<typeof clientListQuerySchema>;

export type ClientStatus = z.infer<typeof clientStatusSchema>;
