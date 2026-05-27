import { z } from 'zod';
import {
  loginRutaAdminSchema,
  loginSchema,
  registerBuyerSchema,
} from './user.schema.js';

export { loginRutaAdminSchema, loginSchema, registerBuyerSchema };

export const refreshSessionSchema = z.object({
  refresh_token: z.string().min(1).optional(),
});

export const logoutSchema = z.object({
  all_sessions: z.boolean().default(false),
});
