// Schemas Zod para gestión de API keys
import { z } from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z.array(z.enum(['orders:write', 'orders:read'])).min(1),
  expires_at: z.string().datetime().optional(),
});

export const revokeApiKeySchema = z.object({
  reason: z.string().max(500).optional(),
});

export const apiKeyListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
export type RevokeApiKeyInput = z.infer<typeof revokeApiKeySchema>;
