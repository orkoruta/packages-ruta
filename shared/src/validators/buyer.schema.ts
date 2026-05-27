import { z } from 'zod';

export const updateBuyerProfileSchema = z.object({
  full_name: z.string().min(1).max(200).optional(),
  phone: z.string().min(1).max(30).optional(),
  document_type: z.string().min(1).max(10).optional(),
  document_number: z.string().min(1).max(50).optional(),
  default_address: z.record(z.unknown()).optional(),
});

export const buyerIdParamsSchema = z.object({
  buyer_user_id: z.coerce.number().int().positive(),
});

export const buyerListQuerySchema = z.object({
  q: z.string().trim().min(1).max(120).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED']).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().min(1).max(100).default(20),
});

export type UpdateBuyerProfileInput = z.infer<typeof updateBuyerProfileSchema>;
export type BuyerListQuery = z.infer<typeof buyerListQuerySchema>;
