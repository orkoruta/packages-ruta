import { z } from 'zod';
import { createProductSchema, presignedUrlSchema } from './user.schema.js';

export { createProductSchema, presignedUrlSchema };

/**
 * **Escrito explícito, no derivado de `create...partial()`.** El derivado
 * heredaba campos que el PATCH no acepta y se dejaba fuera otros que sí, y
 * además declaraba un estado `ARCHIVED` que **el CHECK de la BD no permite**
 * (solo ACTIVE/INACTIVE): mandarlo habría sido un 400, o un 23514 si se
 * colaba. Espeja `services/products.service.ts`, que es lo que valida de verdad.
 */
export const updateProductSchema = z.object({
  name: z.string().min(1).max(300).optional(),
  description: z.string().optional(),
  unit_price: z.number().int().positive().optional(),
  currency: z.string().length(3).optional(),
  product_type: z.enum(['VENTA_NORMAL', 'PROMOCION']).optional(),
  category_id: z.number().int().positive().nullable().optional(),
  stock_quantity: z.number().int().min(0).nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const productIdParamsSchema = z.object({
  product_id: z.coerce.number().int().positive(),
});

export const productListQuerySchema = z.object({
  category_id: z.coerce.number().int().positive().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  q: z.string().trim().min(1).max(120).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
