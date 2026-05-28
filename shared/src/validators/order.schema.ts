import { z } from 'zod';
import { OrderStatus, PaymentStatus, RefundStatus, ReturnStatus, DisputeStatus, PaymentMethodSubmethod } from '../enums/index.js';

export const orderTransitionSchema = z.object({
  to_state: z.nativeEnum(OrderStatus),
  reason: z.string().optional(),
  dimension: z.enum(['order_status', 'payment_status', 'refund_status', 'return_status', 'dispute_status']),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
  })).min(1, 'Al menos un item es requerido'),
});

export const confirmOrderSchema = z.object({
  delivery_type: z.enum(['SHIP', 'PICKUP']),
  delivery_address: z.object({
    line: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().length(2),
    postal_code: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    instructions: z.string().optional(),
  }).optional(),
  pickup_point_id: z.number().int().positive().optional(),
  payment_method: z.enum(['ONLINE_AT_ORDER', 'ELECTRONIC_ON_DELIVERY', 'CASH_ON_DELIVERY']),
  payment_method_submethod: z.enum(['DATAFONO', 'BANK_TRANSFER', 'PAYMENT_LINK', 'QR']).optional(),
}).refine(
  (data) => data.delivery_address || data.pickup_point_id,
  { message: 'Se requiere delivery_address o pickup_point_id' }
);

export const assignCourierSchema = z.object({
  courier_user_id: z.number().int().positive(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(1, 'La razón de cancelación es requerida'),
});

export const requestCancelSchema = z.object({
  reason: z.string().min(1, 'La razón de la solicitud de cancelación es requerida'),
});

export const recordCollectionSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a cero'),
  currency: z.string().length(3).default('COP'),
  method: z.enum(['CASH', 'ELECTRONIC']),
  electronic_submethod: z.nativeEnum(PaymentMethodSubmethod).optional(),
  external_txn_id: z.string().max(255).optional(),
  notes: z.string().max(500).optional(),
});
