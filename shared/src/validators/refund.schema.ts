import { z } from 'zod';
import { RefundStatus } from '../enums/refund_status.js';

export const initiateRefundSchema = z.object({
  order_id: z.bigint({ required_error: 'order_id es requerido' }),
  amount: z.number().positive('El monto debe ser mayor a cero'),
  reason: z.string().min(1).max(500).optional(),
});

export const markRefundExecutedSchema = z.object({
  external_provider_refund_id: z.string().max(255).optional(),
  evidence: z.string().max(2000).optional(),
});

export const refundListQuerySchema = z.object({
  refund_status: z.nativeEnum(RefundStatus).optional(),
  from: z.string().datetime({ offset: true }).optional(),
  to: z.string().datetime({ offset: true }).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().positive().max(100).default(20),
});

export type InitiateRefundInput = z.infer<typeof initiateRefundSchema>;
export type MarkRefundExecutedInput = z.infer<typeof markRefundExecutedSchema>;
export type RefundListQuery = z.infer<typeof refundListQuerySchema>;
