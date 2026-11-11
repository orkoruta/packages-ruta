import { z } from 'zod';
import { RecurrencePeriodicity } from '../enums/order_config.js';

// ── Contacto corporativo ad-hoc ───────────────────────────────────────────────

const corporateContactSchema = z.object({
  name: z.string().min(1, 'El nombre del contacto es requerido'),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

// ── Ítem de pedido ────────────────────────────────────────────────────────────

/**
 * Una línea es un producto del catálogo **o** una línea libre.
 *
 * La libre existe porque cada restaurante pide algo distinto (cortes, grados de
 * maduración, presentaciones que no están en el catálogo) y obligar a crear un
 * producto por pedido no es realista. Lleva su descripción y su precio, y en
 * `order_items` queda con `product_id = NULL` y la descripción como nombre.
 */
export const orderItemInputSchema = z
  .object({
    product_id: z.number().int().positive().optional(),
    description: z.string().trim().min(1).max(300).optional(),
    unit_price: z.number().min(0).optional(),
    quantity: z.number().int().positive(),
  })
  .refine(
    (item) =>
      item.product_id !== undefined ||
      (item.description !== undefined && item.unit_price !== undefined),
    { message: 'Cada ítem necesita un producto, o una descripción con su precio' },
  )
  .refine((item) => !(item.product_id !== undefined && item.description !== undefined), {
    message: 'Un ítem es un producto del catálogo o una línea libre, no ambos',
  });

/**
 * Comprador nuevo creado por el staff al registrar el pedido (el que llama por
 * teléfono o escribe por WhatsApp y nunca usó la tienda). Queda como comprador
 * sin contraseña, igual que un invitado; podrá reclamar su cuenta después.
 */
const newBuyerSchema = z.object({
  full_name: z.string().trim().min(1, 'El nombre del comprador es requerido').max(200),
  phone: z.string().trim().min(1, 'El celular del comprador es requerido').max(30),
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
  /** Alternativa a `buyer_id`: crea el comprador en el momento. */
  new_buyer: newBuyerSchema.optional(),
  /**
   * `CORPORATE` (restaurantes, negocios) o `INDIVIDUAL` (pedido al detal que
   * el staff toma por teléfono). Ambos los registra el staff del Cliente.
   */
  buyer_type: z.enum(['CORPORATE', 'INDIVIDUAL']).default('CORPORATE'),
  corporate_contact: corporateContactSchema,
  items: z.array(orderItemInputSchema).min(1, 'Se requiere al menos un ítem'),
  delivery_type: z.enum(['SHIP', 'PICKUP']),
  delivery_address: corporateDeliveryAddressSchema.optional(),
  pickup_point_id: z.number().int().positive().optional(),
  payment_method: z.enum(['ONLINE_AT_ORDER', 'ELECTRONIC_ON_DELIVERY', 'CASH_ON_DELIVERY']),
  payment_method_submethod: z.enum(['DATAFONO', 'BANK_TRANSFER', 'PAYMENT_LINK', 'QR']).optional(),
  notes: z.string().optional(),
});

/** El destino depende de la rama de entrega: dirección en SHIP, punto en PICKUP. */
function assertDeliveryTarget(
  data: {
    delivery_type: 'SHIP' | 'PICKUP';
    delivery_address?: unknown;
    pickup_point_id?: number;
    buyer_id?: number;
    new_buyer?: unknown;
  },
  ctx: z.RefinementCtx,
): void {
  // La falta de comprador la rechaza el servicio (422 VALIDATION_ERROR), que es
  // el contrato publicado; aquí solo se impide mandar los dos a la vez.
  if (data.buyer_id && data.new_buyer) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['new_buyer'],
      message: 'Elige un comprador existente o uno nuevo, no ambos',
    });
  }
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

// ── Schema: editar los productos de un pedido ya creado ──────────────────────

/**
 * Lista completa de ítems que reemplaza a la actual (no es un diff): lo que no
 * venga aquí se quita del pedido. Mismas formas que al crearlo: producto del
 * catálogo o línea libre con descripción y precio.
 */
export const updateOrderItemsSchema = z.object({
  items: z.array(orderItemInputSchema).min(1, 'El pedido necesita al menos un producto'),
  reason: z.string().trim().max(300).optional(),
});

export type OrderItemInput = z.infer<typeof orderItemInputSchema>;
export type UpdateOrderItemsInput = z.infer<typeof updateOrderItemsSchema>;
