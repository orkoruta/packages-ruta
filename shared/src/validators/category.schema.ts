import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(160),
  description: z.string().max(1000).optional(),
  sort_order: z.number().int().min(0).default(0),
});

/**
 * **Escrito explícito, no derivado de `create...partial()`.** El derivado
 * heredaba campos que el PATCH no acepta y se dejaba fuera otros que sí, y
 * además declaraba un estado `ARCHIVED` que **el CHECK de la BD no permite**
 * (solo ACTIVE/INACTIVE): mandarlo habría sido un 400, o un 23514 si se
 * colaba. Espeja `services/categories.service.ts`, que es lo que valida de verdad.
 */
export const updateCategorySchema = z.object({
  name: z.string().min(1).max(160).optional(),
  sort_order: z.number().int().min(0).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const categoryIdParamsSchema = z.object({
  category_id: z.coerce.number().int().positive(),
});

export const categoryListQuerySchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(50),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryListQuery = z.infer<typeof categoryListQuerySchema>;
