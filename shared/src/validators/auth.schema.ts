import { z } from 'zod';
import {
  loginRutaAdminSchema,
  loginSchema,
  registerBuyerSchema,
  controlViewEnterSchema,
  guestBuyerSchema,
} from './user.schema.js';

export {
  loginRutaAdminSchema,
  loginSchema,
  registerBuyerSchema,
  guestBuyerSchema,
  controlViewEnterSchema,
};

export const refreshSessionSchema = z.object({
  refresh_token: z.string().min(1).optional(),
});

export const logoutSchema = z.object({
  all_sessions: z.boolean().default(false),
});

export type RefreshSessionInput = z.infer<typeof refreshSessionSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type GuestBuyerInput = z.infer<typeof guestBuyerSchema>;
export type RegisterBuyerInput = z.infer<typeof registerBuyerSchema>;
export type ControlViewEnterInput = z.infer<typeof controlViewEnterSchema>;
