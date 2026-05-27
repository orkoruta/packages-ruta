import { PaymentStatus, PaymentMethod, PaymentMethodSubmethod, RefundStatus, RefundModality } from '../enums/index.js';

export interface InitiatePaymentInput {
  order_id: number;
}

export interface InitiatePaymentResponse {
  order_id: number;
  payment_status: PaymentStatus;
  wompi_checkout_url?: string;
  wompi_reference?: string;
}

export interface WompiWebhookPayload {
  event: string;
  data: {
    transaction: {
      id: string;
      status: 'APPROVED' | 'DECLINED' | 'VOIDED' | 'ERROR';
      reference: string;
      amount_in_cents: number;
      currency: string;
      payment_method_type: string;
      customer_email?: string;
      created_at: string;
    };
  };
  signature: {
    checksum: string;
    properties: string[];
  };
  environment: 'test' | 'production';
  timestamp: number;
}

export interface RecordCollectionInput {
  amount: number;
  currency: string;
  method: 'CASH' | 'ELECTRONIC';
  electronic_submethod?: PaymentMethodSubmethod;
  external_txn_id?: string;
  notes?: string;
}

export interface PaymentProviderConfig {
  provider_type: string;
  provider_name: string;
  config: Record<string, unknown>;
  applicable_methods: PaymentMethod[];
}

export interface PaymentSummary {
  id: number;
  order_id: number;
  payment_status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_method_submethod?: PaymentMethodSubmethod;
  amount: number;
  currency: string;
  provider_reference?: string;
  collected_by_user_id?: number;
  evidence_url?: string;
  reconciled: boolean;
  created_at: string;
}

export interface RefundSummary {
  id: number;
  order_id: number;
  refund_status: RefundStatus;
  refund_modality: RefundModality;
  amount: number;
  currency: string;
  provider_reference?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
}
