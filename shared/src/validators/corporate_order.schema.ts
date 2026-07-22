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

// ── Destino de entrega ────────────────────────────────────────────────────────

const corporateDeliveryAddressSchema = z.object({
  line: z.string().min(1, 'La dirección es requerida'),
  city: z.string().min(1, 'La ciudad es requerida'),
  state: z.string().min(1, 'El departamento es requerido'),
  country: z.string().length(2).default('CO'),
  postal_code: z.string().optional(),
  // Sin coordenadas el pedido no aparece en el mapa de asignación, así que
  // son obligatorias cuando la entrega es a domicilio.
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  instructions: z.string().optional(),
});

// ── Schema base: crear pedido corporativo ─────────────────────────────────────

/** Base sin refinamientos, para poder extenderla (el recurrente la reusa). */
const corporateOrderBaseSchema = z.object({
  buyer_id: z.number().int().positive().optional(),
  corporate_contact: corporateContactSchema,
  items: z.array(corporateOrderItemSchema).min(1, 'Se requiere al menos un ítem'),
  delivery_type: z.enum(['SHIP', 'PICKUP']),
  delivery_address: corporateDeliveryAddressSchema.optional(),
  pickup_point_id: z.number().int().positive().optional(),
  payment_method: z.enum(['ONLINE_AT_ORDER', 'ELECTRONIC_ON_DELIVERY', 'CASH_ON_DELIVERY']),
  payment_method_submethod: z.enum(['DATAFONO', 'BANK_TRANSFER', 'PAYMENT_LINK', 'QR']).optional(),
  notes: z.string().optional(),
});

/** El destino depende de la rama de entrega: dirección en SHIP, punto en PICKUP. */
function assertDeliveryTarget(
  data: { delivery_type: 'SHIP' | 'PICKUP'; delivery_address?: unknown; pickup_point_id?: number },
  ctx: z.RefinementCtx,
): void {
  if (data.delivery_type === 'SHIP' && !data.delivery_address) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['delivery_address'],
      message: 'Se requiere delivery_address cuando delivery_type es SHIP',
    });
  }
  if (data.delivery_type === 'PICKUP' && !data.pickup_point_id) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['pickup_point_id'],
      message: 'Se requiere pickup_point_id cuando delivery_type es PICKUP',
    });
  }
}

export const createCorporateOrderSchema =
  corporateOrderBaseSchema.superRefine(assertDeliveryTarget);

// ── Schema extendido: corporativo recurrente ──────────────────────────────────

export const createCorporateOrderRecurringSchema = corporateOrderBaseSchema
  .extend({
    recurrence_periodicity: z.nativeEnum(RecurrencePeriodicity, {
      required_error: 'recurrence_periodicity es requerido para pedidos recurrentes',
    }),
    custom_interval_days: z.number().int().positive().optional(),
  })
  .superRefine(assertDeliveryTarget)
  .refine(
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
