import { z } from 'zod';
import { dateFilterSchema } from '../utils/date_range.js';
import { RefundStatus } from '../enums/refund_status.js';

/**
 * Reembolsos. **Estos dos esquemas describían un contrato que la API no tiene.**
 *
 * `initiateRefundSchema` pedía un `order_id` en el cuerpo —va en la ruta,
 * `POST /admin/orders/:id/refunds`— y le faltaba `refund_modality`, que es
 * obligatorio. `markRefundExecutedSchema` no tenía ni `outcome` ni
 * `amount_executed`, así que aceptaba un cuerpo vacío que la API rechaza.
 *
 * Nadie los importaba, pero el panel sí mandaba `result` donde el backend
 * espera `outcome`, y marcar un reembolso como ejecutado devolvía siempre 400.
 * Ahora la definición viva está aquí y el servicio la reexporta.
 */
export const initiateRefundSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a cero'),
  refund_modality: z.enum(['STORE_CREDIT', 'BANK_REFUND']),
  reason: z.string().min(1).max(500).optional(),
});

export const markRefundExecutedSchema = z.object({
  outcome: z.enum(['REFUNDED', 'PARTIALLY_REFUNDED', 'FAILED']),
  amount_executed: z.number().positive().optional(),
  external_provider_refund_id: z.string().max(255).optional(),
  evidence: z.string().max(2000).optional(),
});

/** Resultado de ejecutar el reembolso, tal como lo acepta la API. */
export type RefundOutcome = z.infer<typeof markRefundExecutedSchema>['outcome'];

export const refundListQuerySchema = z.object({
  status: z.string().optional(),
  from: dateFilterSchema.optional(),
  to: dateFilterSchema.optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().positive().max(100).default(20),
});

export type InitiateRefundInput = z.infer<typeof initiateRefundSchema>;
export type MarkRefundExecutedInput = z.infer<typeof markRefundExecutedSchema>;
export type RefundListQuery = z.infer<typeof refundListQuerySchema>;
