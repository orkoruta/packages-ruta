import { z } from 'zod';

/**
 * Lo que el comprador puede cambiar de su propio perfil (`PATCH /buyer/profile`).
 *
 * Declaraba también `document_type`, `document_number` y `default_address`,
 * **que la API no acepta**: `routes/buyer_profile.ts` valida solo nombre y
 * teléfono, y Zod descarta el resto en silencio. Todavía no hay pantalla de
 * perfil en el storefront, así que nadie se ha estrellado; se corrige ahora
 * justo para que quien la construya no mande tres campos que se pierden sin
 * error.
 *
 * El documento se captura al registrarse (`registerBuyerSchema`). Si algún día
 * el comprador debe poder editarlo, es una funcionalidad nueva: hay que
 * ampliar el endpoint y luego este esquema, en ese orden.
 */
export const updateBuyerProfileSchema = z.object({
  // `.trim()` no es cosmético: sin él, un nombre de solo espacios pasa el
  // `min(1)` y se guarda en blanco. El tope del teléfono es 50, como el resto
  // de la API, no 30.
  full_name: z.string().trim().min(1).max(200).optional(),
  phone: z.string().trim().min(1).max(50).optional(),
});

export const buyerIdParamsSchema = z.object({
  buyer_user_id: z.coerce.number().int().positive(),
});

/**
 * Estados que admite un comprador. Coinciden con lo que valida el backend:
 * este enum decía `ARCHIVED`, que **ninguna ruta acepta**, mientras el servicio
 * usaba su propia copia con `INACTIVE`. Quien se fiara de shared mandaba un
 * valor que el backend rechazaba.
 */
export const buyerStatusSchema = z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']);

export const buyerListQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  status: buyerStatusSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Alta y edición de compradores desde el panel del Cliente.
 *
 * Vivían en `services/buyers.service.ts`, fuera del alcance del frontend, que
 * por eso tipaba los cuerpos como `Record<string, unknown>`. Al traerlos aquí,
 * mandar un campo con el nombre equivocado pasa a ser error de compilación.
 * No confundir `updateBuyerSchema` (admin edita a un comprador) con
 * `updateBuyerProfileSchema` (el comprador edita lo suyo en `/buyer/me`): el
 * primero admite `status`, el segundo no.
 */
export const createBuyerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  full_name: z.string().min(1).max(200),
  phone: z.string().min(1).max(30).optional(),
  document_type: z.string().min(1).max(10).optional(),
  document_number: z.string().min(1).max(50).optional(),
});

export const updateBuyerSchema = z.object({
  full_name: z.string().min(1).max(200).optional(),
  phone: z.string().min(1).max(30).optional(),
  document_type: z.string().min(1).max(10).optional(),
  document_number: z.string().min(1).max(50).optional(),
  status: buyerStatusSchema.optional(),
});

export type UpdateBuyerProfileInput = z.infer<typeof updateBuyerProfileSchema>;
export type BuyerListQuery = z.infer<typeof buyerListQuerySchema>;
export type BuyerStatus = z.infer<typeof buyerStatusSchema>;
export type CreateBuyerInput = z.infer<typeof createBuyerSchema>;
export type UpdateBuyerInput = z.infer<typeof updateBuyerSchema>;
