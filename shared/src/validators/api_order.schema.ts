// Schemas Zod para pedidos creados por Cliente API
import { z } from 'zod';

const API_INITIAL_STATES = ['PREPARING', 'AWAITING_COURIER_ASSIGNMENT', 'READY_TO_SHIP', 'READY_FOR_PICKUP'] as const;
const API_PAYMENT_METHODS = ['PREPAID_EXTERNAL', 'COD'] as const;
const API_DELIVERY_TYPES = ['SHIP', 'PICKUP'] as const;

const apiOrderItemSchema = z.object({
  external_sku: z.string().max(100).optional(),
  name: z.string().min(1).max(200),
  quantity: z.number().int().positive(),
  unit_price_cents: z.number().int().nonnegative(),
});

const deliveryAddressSchema = z.object({
  street: z.string().min(1),
  city: z.string().min(1),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export const createApiOrderSchema = z.object({
  external_reference: z.string().max(200).optional(),
  delivery_type: z.enum(API_DELIVERY_TYPES),
  initial_state: z.enum(API_INITIAL_STATES),
  items: z.array(apiOrderItemSchema).min(1),
  payment_method: z.enum(API_PAYMENT_METHODS),
  delivery_address: deliveryAddressSchema.optional(),
  pickup_point_id: z.coerce.bigint().optional(),
  customer_info: z.object({
    name: z.string().min(1).max(200),
    phone: z.string().max(20).optional(),
    email: z.string().email().optional(),
  }).optional(),
  notes: z.string().max(1000).optional(),
}).refine(
  (data) => {
    if (data.delivery_type === 'SHIP') return !!data.delivery_address;
    if (data.delivery_type === 'PICKUP') return !!data.pickup_point_id;
    return true;
  },
  { message: 'SHIP requiere delivery_address; PICKUP requiere pickup_point_id' }
).refine(
  (data) => {
    if (data.delivery_type === 'PICKUP') {
      return data.initial_state === 'READY_FOR_PICKUP';
    }
    return data.initial_state !== 'READY_FOR_PICKUP';
  },
  { message: 'READY_FOR_PICKUP solo válido para delivery_type PICKUP' }
);

export const apiOrderListQuerySchema = z.object({
  status: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().positive().max(100).default(20),
});

export type CreateApiOrderInput = z.infer<typeof createApiOrderSchema>;
export type ApiOrderListQuery = z.infer<typeof apiOrderListQuerySchema>;
