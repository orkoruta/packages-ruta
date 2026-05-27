
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.Audit_eventsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  actor_user_id: 'actor_user_id',
  actor_api_key_id: 'actor_api_key_id',
  actor_type: 'actor_type',
  actor_role: 'actor_role',
  acting_via_control_view: 'acting_via_control_view',
  impersonator_user_id: 'impersonator_user_id',
  control_view_session_id: 'control_view_session_id',
  action: 'action',
  entity_type: 'entity_type',
  entity_id: 'entity_id',
  ip_address: 'ip_address',
  user_agent: 'user_agent',
  metadata: 'metadata',
  result: 'result',
  occurred_at: 'occurred_at'
};

exports.Prisma.Buyer_profilesScalarFieldEnum = {
  user_id: 'user_id',
  client_id: 'client_id',
  default_address_line: 'default_address_line',
  default_address_city: 'default_address_city',
  default_address_state: 'default_address_state',
  default_address_country: 'default_address_country',
  default_address_postal_code: 'default_address_postal_code',
  default_address_latitude: 'default_address_latitude',
  default_address_longitude: 'default_address_longitude',
  buyer_type: 'buyer_type',
  corporate_name: 'corporate_name',
  corporate_tax_id: 'corporate_tax_id',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Client_api_keysScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  key_id: 'key_id',
  secret_hash: 'secret_hash',
  scopes: 'scopes',
  name: 'name',
  last_used_at: 'last_used_at',
  last_used_ip: 'last_used_ip',
  expires_at: 'expires_at',
  revoked_at: 'revoked_at',
  revocation_reason: 'revocation_reason',
  created_by_user_id: 'created_by_user_id',
  created_at: 'created_at'
};

exports.Prisma.Client_parametersScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  parameter_key: 'parameter_key',
  parameter_value: 'parameter_value',
  value_type: 'value_type',
  description: 'description',
  is_overrideable_by_client: 'is_overrideable_by_client',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Client_payment_providersScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  provider_type: 'provider_type',
  provider_name: 'provider_name',
  display_name: 'display_name',
  config: 'config',
  webhook_ingress_path: 'webhook_ingress_path',
  webhook_secret: 'webhook_secret',
  status: 'status',
  is_default: 'is_default',
  applicable_payment_methods: 'applicable_payment_methods',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ClientsScalarFieldEnum = {
  id: 'id',
  business_code: 'business_code',
  slug: 'slug',
  name: 'name',
  description: 'description',
  contact_person_name: 'contact_person_name',
  contact_person_document_type: 'contact_person_document_type',
  contact_person_document_number: 'contact_person_document_number',
  contact_person_phone: 'contact_person_phone',
  contact_person_email: 'contact_person_email',
  logo_url: 'logo_url',
  client_type: 'client_type',
  frontend_mode: 'frontend_mode',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Control_view_master_passwordsScalarFieldEnum = {
  user_id: 'user_id',
  client_id: 'client_id',
  master_password_hash: 'master_password_hash',
  can_use_control_view: 'can_use_control_view',
  set_at: 'set_at',
  expires_at: 'expires_at'
};

exports.Prisma.Control_view_sessionsScalarFieldEnum = {
  id: 'id',
  admin_ruta_user_id: 'admin_ruta_user_id',
  impersonated_client_id: 'impersonated_client_id',
  started_at: 'started_at',
  ended_at: 'ended_at',
  reason: 'reason',
  ip_address: 'ip_address',
  user_agent: 'user_agent'
};

exports.Prisma.Courier_profilesScalarFieldEnum = {
  user_id: 'user_id',
  client_id: 'client_id',
  transport_method: 'transport_method',
  vehicle_plate: 'vehicle_plate',
  additional_data: 'additional_data',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.DisputesScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  order_id: 'order_id',
  buyer_id: 'buyer_id',
  status: 'status',
  reason: 'reason',
  resolution: 'resolution',
  resolution_action: 'resolution_action',
  resolved_by_user_id: 'resolved_by_user_id',
  resolved_at: 'resolved_at',
  evidence: 'evidence',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.External_webhook_eventsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  payment_provider_id: 'payment_provider_id',
  provider_event_id: 'provider_event_id',
  payload: 'payload',
  signature_valid: 'signature_valid',
  processed_at: 'processed_at',
  processing_result: 'processing_result',
  related_order_id: 'related_order_id',
  received_at: 'received_at'
};

exports.Prisma.Idempotency_keysScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  actor_id: 'actor_id',
  actor_type: 'actor_type',
  idempotency_key: 'idempotency_key',
  request_hash: 'request_hash',
  response_status: 'response_status',
  response_body: 'response_body',
  created_at: 'created_at',
  expires_at: 'expires_at'
};

exports.Prisma.Operator_permissionsScalarFieldEnum = {
  operator_user_id: 'operator_user_id',
  client_id: 'client_id',
  permission_key: 'permission_key',
  granted_at: 'granted_at',
  granted_by_user_id: 'granted_by_user_id'
};

exports.Prisma.Order_itemsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  order_id: 'order_id',
  product_id: 'product_id',
  product_name: 'product_name',
  sku: 'sku',
  quantity: 'quantity',
  unit_price: 'unit_price',
  subtotal: 'subtotal',
  metadata: 'metadata',
  created_at: 'created_at'
};

exports.Prisma.Order_state_historyScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  order_id: 'order_id',
  state_dimension: 'state_dimension',
  previous_value: 'previous_value',
  new_value: 'new_value',
  changed_by_user_id: 'changed_by_user_id',
  changed_by_actor_type: 'changed_by_actor_type',
  reason: 'reason',
  metadata: 'metadata',
  occurred_at: 'occurred_at'
};

exports.Prisma.OrdersScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  buyer_id: 'buyer_id',
  courier_user_id: 'courier_user_id',
  order_origin: 'order_origin',
  order_status: 'order_status',
  payment_status: 'payment_status',
  refund_status: 'refund_status',
  return_status: 'return_status',
  dispute_status: 'dispute_status',
  delivery_type: 'delivery_type',
  delivery_carrier_type: 'delivery_carrier_type',
  payment_method: 'payment_method',
  payment_method_submethod: 'payment_method_submethod',
  refund_modality: 'refund_modality',
  return_mechanism: 'return_mechanism',
  buyer_type: 'buyer_type',
  closure_reason: 'closure_reason',
  payment_provider_id: 'payment_provider_id',
  external_payment_reference: 'external_payment_reference',
  recurrence_template_id: 'recurrence_template_id',
  delivery_address_line: 'delivery_address_line',
  delivery_address_city: 'delivery_address_city',
  delivery_address_state: 'delivery_address_state',
  delivery_address_country: 'delivery_address_country',
  delivery_address_postal_code: 'delivery_address_postal_code',
  delivery_address_latitude: 'delivery_address_latitude',
  delivery_address_longitude: 'delivery_address_longitude',
  delivery_instructions: 'delivery_instructions',
  pickup_point_id: 'pickup_point_id',
  subtotal: 'subtotal',
  tax: 'tax',
  shipping_fee: 'shipping_fee',
  discount: 'discount',
  total: 'total',
  currency: 'currency',
  version: 'version',
  created_at: 'created_at',
  updated_at: 'updated_at',
  submitted_at: 'submitted_at',
  delivered_at: 'delivered_at',
  closed_at: 'closed_at',
  archived: 'archived',
  archived_at: 'archived_at'
};

exports.Prisma.PaymentsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  order_id: 'order_id',
  payment_provider_id: 'payment_provider_id',
  payment_method: 'payment_method',
  payment_method_submethod: 'payment_method_submethod',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  external_transaction_id: 'external_transaction_id',
  external_payment_reference: 'external_payment_reference',
  technical_confirmation_at: 'technical_confirmation_at',
  collected_by_courier_user_id: 'collected_by_courier_user_id',
  collected_at: 'collected_at',
  collection_evidence: 'collection_evidence',
  reconciled_with_client: 'reconciled_with_client',
  reconciled_at: 'reconciled_at',
  metadata: 'metadata',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Pickup_pointsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  name: 'name',
  address_line: 'address_line',
  city: 'city',
  state: 'state',
  country: 'country',
  postal_code: 'postal_code',
  latitude: 'latitude',
  longitude: 'longitude',
  opening_hours: 'opening_hours',
  contact_phone: 'contact_phone',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Product_categoriesScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  name: 'name',
  parent_category_id: 'parent_category_id',
  display_order: 'display_order',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ProductsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  sku: 'sku',
  name: 'name',
  description: 'description',
  product_type: 'product_type',
  unit_price: 'unit_price',
  currency: 'currency',
  category_id: 'category_id',
  image_url: 'image_url',
  status: 'status',
  stock_quantity: 'stock_quantity',
  metadata: 'metadata',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Recurrence_templatesScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  buyer_id: 'buyer_id',
  recurrence_mode: 'recurrence_mode',
  recurrence_periodicity: 'recurrence_periodicity',
  custom_interval_days: 'custom_interval_days',
  recurrence_status: 'recurrence_status',
  delivery_type: 'delivery_type',
  delivery_carrier_type: 'delivery_carrier_type',
  payment_method: 'payment_method',
  payment_method_submethod: 'payment_method_submethod',
  payment_provider_id: 'payment_provider_id',
  pickup_point_id: 'pickup_point_id',
  template_payload: 'template_payload',
  last_generated_at: 'last_generated_at',
  next_generation_at: 'next_generation_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.RefundsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  order_id: 'order_id',
  payment_id: 'payment_id',
  refund_modality: 'refund_modality',
  amount: 'amount',
  currency: 'currency',
  status: 'status',
  executed_by_user_id: 'executed_by_user_id',
  executed_at: 'executed_at',
  external_provider_refund_id: 'external_provider_refund_id',
  evidence: 'evidence',
  reason: 'reason',
  metadata: 'metadata',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.ReturnsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  order_id: 'order_id',
  buyer_id: 'buyer_id',
  status: 'status',
  return_mechanism: 'return_mechanism',
  reason: 'reason',
  buyer_complaint: 'buyer_complaint',
  pickup_courier_user_id: 'pickup_courier_user_id',
  requested_at: 'requested_at',
  reviewed_at: 'reviewed_at',
  approved_at: 'approved_at',
  received_at: 'received_at',
  closed_at: 'closed_at',
  evidence: 'evidence',
  metadata: 'metadata',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SessionsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  user_id: 'user_id',
  refresh_token_hash: 'refresh_token_hash',
  control_view_session_id: 'control_view_session_id',
  ip_address: 'ip_address',
  user_agent: 'user_agent',
  issued_at: 'issued_at',
  last_used_at: 'last_used_at',
  expires_at: 'expires_at',
  revoked_at: 'revoked_at',
  revocation_reason: 'revocation_reason'
};

exports.Prisma.State_catalogScalarFieldEnum = {
  state_dimension: 'state_dimension',
  state_value: 'state_value',
  description: 'description',
  is_terminal: 'is_terminal',
  display_order: 'display_order',
  applies_to_client_type: 'applies_to_client_type'
};

exports.Prisma.UsersScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  user_type: 'user_type',
  email: 'email',
  password_hash: 'password_hash',
  auth_mode: 'auth_mode',
  external_buyer_id: 'external_buyer_id',
  full_name: 'full_name',
  document_type: 'document_type',
  document_number: 'document_number',
  phone: 'phone',
  status: 'status',
  last_login_at: 'last_login_at',
  password_changed_at: 'password_changed_at',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Webhook_deliveriesScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  subscription_id: 'subscription_id',
  event_type: 'event_type',
  event_id: 'event_id',
  payload: 'payload',
  attempt_number: 'attempt_number',
  response_status: 'response_status',
  response_body: 'response_body',
  delivered_at: 'delivered_at',
  next_retry_at: 'next_retry_at',
  failed_permanently: 'failed_permanently',
  created_at: 'created_at'
};

exports.Prisma.Webhook_subscriptionsScalarFieldEnum = {
  id: 'id',
  client_id: 'client_id',
  url: 'url',
  events: 'events',
  signing_secret: 'signing_secret',
  status: 'status',
  description: 'description',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  audit_events: 'audit_events',
  buyer_profiles: 'buyer_profiles',
  client_api_keys: 'client_api_keys',
  client_parameters: 'client_parameters',
  client_payment_providers: 'client_payment_providers',
  clients: 'clients',
  control_view_master_passwords: 'control_view_master_passwords',
  control_view_sessions: 'control_view_sessions',
  courier_profiles: 'courier_profiles',
  disputes: 'disputes',
  external_webhook_events: 'external_webhook_events',
  idempotency_keys: 'idempotency_keys',
  operator_permissions: 'operator_permissions',
  order_items: 'order_items',
  order_state_history: 'order_state_history',
  orders: 'orders',
  payments: 'payments',
  pickup_points: 'pickup_points',
  product_categories: 'product_categories',
  products: 'products',
  recurrence_templates: 'recurrence_templates',
  refunds: 'refunds',
  returns: 'returns',
  sessions: 'sessions',
  state_catalog: 'state_catalog',
  users: 'users',
  webhook_deliveries: 'webhook_deliveries',
  webhook_subscriptions: 'webhook_subscriptions'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
