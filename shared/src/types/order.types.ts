import { OrderStatus, DeliveryType, DeliveryCarrierType, PaymentStatus, RefundStatus, ReturnStatus, DisputeStatus, ClosureReason } from '../enums/index.js';

// --- Order Types ---

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

export interface CreateOrderInput {
  items: OrderItem[];
}

export interface ConfirmOrderInput {
  delivery_type: DeliveryType;
  delivery_address?: DeliveryAddress;
  pickup_point_id?: number;
  payment_method: string;
  payment_method_submethod?: string;
}

export interface OrderTransitionInput {
  to_state: OrderStatus;
  reason?: string;
  dimension: 'order_status' | 'payment_status' | 'refund_status' | 'return_status' | 'dispute_status';
}

export interface AssignCourierInput {
  courier_user_id: number;
}

export interface CancelOrderInput {
  reason: string;
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
