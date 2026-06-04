import { RefundStatus } from '../enums/refund_status.js';
import { RefundModality } from '../enums/order_config.js';

/** Full record from the `refunds` table (Fase 3). */
export interface RefundRecord {
  id: number;
  client_id: number;
  order_id: number;
  buyer_id: number;
  status: RefundStatus;
  amount: number;
  currency: string;
  modality: RefundModality;
  reason?: string;
  created_at: string;
  updated_at: string;
}

/** Refund record with audit fields. */
export interface RefundRecordDetail extends RefundRecord {
  external_provider_refund_id?: string;
  evidence?: string;
  initiated_by_user_id?: number;
  executed_by_user_id?: number;
  processed_at?: string;
  executed_at?: string;
}
