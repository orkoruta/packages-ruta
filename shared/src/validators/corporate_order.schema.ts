import { z } from 'zod';
import { RecurrencePeriodicity } from '../enums/order_config.js';

// ── Contacto corporativo ad-hoc ───────────────────────────────────────────────

const corporateContactSchema = z.object({
  name: z.string().min(1, 'El nombre del contacto es requerido'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// ── Ítem de pedido ────────────────────────────────────────────────────────────

const corporateOrderItemSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().positive(),
});

// ── Schema base: crear pedido corporativo ─────────────────────────────────────

export const createCorporateOrderSchema = z.object({
  buyer_id: z.number().int().positive().optional(),
  corporate_contact: corporateContactSchema,
  items: z.array(corporateOrderItemSchema).min(1, 'Se requiere al menos un ítem'),
  delivery_type: z.enum(['SHIP', 'PICKUP']),
  payment_method: z.enum(['ONLINE_AT_ORDER', 'ELECTRONIC_ON_DELIVERY', 'CASH_ON_DELIVERY']),
  payment_method_submethod: z.enum(['DATAFONO', 'BANK_TRANSFER', 'PAYMENT_LINK', 'QR']).optional(),
  notes: z.string().optional(),
});

// ── Schema extendido: corporativo recurrente ──────────────────────────────────

export const createCorporateOrderRecurringSchema = createCorporateOrderSchema.extend({
  recurrence_periodicity: z.nativeEnum(RecurrencePeriodicity, {
    required_error: 'recurrence_periodicity es requerido para pedidos recurrentes',
  }),
  custom_interval_days: z.number().int().positive().optional(),
}).refine(
  (data) =>
    data.recurrence_periodicity !== RecurrencePeriodicity.CUSTOM_INTERVAL ||
    data.custom_interval_days !== undefined,
  {
    message: 'custom_interval_days es requerido cuando periodicity es CUSTOM_INTERVAL',
    path: ['custom_interval_days'],
  },
);

// ── Schema: repetir último corporativo ───────────────────────────────────────

export const repeatLastCorporateOrderSchema = z.object({
  buyer_id: z.number().int().positive(),
});

// ── Tipos inferidos ───────────────────────────────────────────────────────────

export type CreateCorporateOrderInput = z.infer<typeof createCorporateOrderSchema>;
export type CreateCorporateOrderRecurringInput = z.infer<typeof createCorporateOrderRecurringSchema>;
export type RepeatLastCorporateOrderInput = z.infer<typeof repeatLastCorporateOrderSchema>;
