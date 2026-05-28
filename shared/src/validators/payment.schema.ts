import { z } from 'zod';
import { PaymentStatus } from '../enums/index.js';

export const initiatePaymentSchema = z.object({
  redirect_url: z.string().url('La URL de redirección debe ser válida').optional(),
});

export const wompiWebhookEventSchema = z.object({
  event: z.string(),
  data: z.object({
    transaction: z.object({
      id: z.string(),
      status: z.enum(['APPROVED', 'DECLINED', 'VOIDED', 'ERROR']),
      reference: z.string(),
      amount_in_cents: z.number().int().positive(),
      currency: z.string().length(3),
      payment_method_type: z.string(),
      customer_email: z.string().email().optional(),
      created_at: z.string(),
    }),
  }),
  signature: z.object({
    checksum: z.string().min(1),
    properties: z.array(z.string()),
  }),
  environment: z.enum(['test', 'production']),
  timestamp: z.number().int().positive(),
});

export const paymentStatusQuerySchema = z.object({
  payment_status: z.nativeEnum(PaymentStatus).optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().positive().max(100).default(20),
});

export type InitiatePaymentRequest = z.infer<typeof initiatePaymentSchema>;
export type WompiWebhookEvent = z.infer<typeof wompiWebhookEventSchema>;
export type PaymentStatusQuery = z.infer<typeof paymentStatusQuerySchema>;
