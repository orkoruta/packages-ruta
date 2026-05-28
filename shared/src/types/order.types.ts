import { z } from 'zod';
import {
  OrderStatus,
  DeliveryType,
  DeliveryCarrierType,
  PaymentStatus,
  RefundStatus,
  ReturnStatus,
  DisputeStatus,
  ClosureReason,
} from '../enums/index.js';
import {
  createOrderSchema,
  confirmOrderSchema,
  cancelOrderSchema,
  requestCancelSchema,
  orderTransitionSchema,
  assignCourierSchema,
} from '../validators/order.schema.js';

// --- Tipos derivados de schemas Zod (requests) ---

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ConfirmOrderInput = z.infer<typeof confirmOrderSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type RequestCancelInput = z.infer<typeof requestCancelSchema>;
export type OrderTransitionInput = z.infer<typeof orderTransitionSchema>;
export type AssignCourierInput = z.infer<typeof assignCourierSchema>;

// --- Tipos de respuesta y modelos internos ---

export interface OrderItem {
  product_id: number;
  product_name?: string;
  sku?: string;
  quantity: number;
  unit_price: number;
  currency: string;
}

export interface DeliveryAddress {
  line: string;
  city: string;
  state: string;
  country: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  instructions?: string;
}

export interface OrderStateHistory {
  from_status: string;
  to_status: string;
  changed_by_user_id: number;
  changed_by_user_type: string;
  reason?: string;
  created_at: string;
}

export interface OrderTimeline {
  order_status: OrderStateHistory[];
  payment_status: OrderStateHistory[];
  refund_status: OrderStateHistory[];
  return_status: OrderStateHistory[];
}

export interface OrderSummary {
  id: number;
  client_id: number;
  buyer_id: number;
  courier_id?: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  refund_status: RefundStatus;
  return_status: ReturnStatus;
  dispute_status: DisputeStatus;
  delivery_type: DeliveryType;
  delivery_carrier_type?: DeliveryCarrierType;
  closure_reason?: ClosureReason;
  subtotal: number;
  total: number;
  currency: string;
  created_at: string;
}
