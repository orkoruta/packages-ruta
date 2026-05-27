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
