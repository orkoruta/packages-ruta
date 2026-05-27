export const PARAMETER_KEYS = {
  // Auth / tokens
  AUTH_ACCESS_TOKEN_LIFETIME_MINUTES: 'auth.access_token_lifetime_minutes',
  AUTH_REFRESH_TOKEN_LIFETIME_DAYS: 'auth.refresh_token_lifetime_days',
  AUTH_REFRESH_TOKEN_LIFETIME_ADMIN_DAYS: 'auth.refresh_token_lifetime_admin_days',
  AUTH_REFRESH_TOKEN_LIFETIME_COURIER_DAYS: 'auth.refresh_token_lifetime_courier_days',
  AUTH_REFRESH_TOKEN_LIFETIME_BUYER_DAYS: 'auth.refresh_token_lifetime_buyer_days',

  // Orders
  ORDER_DRAFT_EXPIRATION_MINUTES: 'order.draft_expiration_minutes',
  ORDER_PAYMENT_TIMEOUT_MINUTES: 'order.payment_timeout_minutes',
  ORDER_VALIDATION_AUTO_APPROVE_TIMEOUT_MINUTES: 'order.validation_auto_approve_timeout_minutes',
  ORDER_DELIVERY_CONFIRMATION_TIMEOUT_HOURS: 'order.delivery_confirmation_timeout_hours',
  ORDER_PICKUP_EXPIRATION_HOURS: 'order.pickup_expiration_hours',
  ORDER_DELIVERY_ATTEMPT_MAX: 'order.delivery_attempt_max',

  // Refunds
  REFUND_STORE_CREDIT_ENABLED: 'refund.store_credit_enabled',
  REFUND_BANK_REFUND_ENABLED: 'refund.bank_refund_enabled',

  // Returns
  RETURN_REVIEW_TIMEOUT_HOURS: 'return.review_timeout_hours',
  RETURN_CUSTOMER_SHIP_TIMEOUT_HOURS: 'return.customer_ship_timeout_hours',

  // General
  IDEMPOTENCY_TTL_HOURS: 'idempotency.ttl_hours',
  WEBHOOK_RETRY_MAX_ATTEMPTS: 'webhook.retry_max_attempts',
  SESSION_CLEANUP_DAYS: 'session.cleanup_days',
} as const;

export type ParameterKey = (typeof PARAMETER_KEYS)[keyof typeof PARAMETER_KEYS];
