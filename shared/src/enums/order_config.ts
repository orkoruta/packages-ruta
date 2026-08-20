export enum DeliveryType {
  SHIP = 'SHIP',
  PICKUP = 'PICKUP',
}

export enum DeliveryCarrierType {
  OWN_FLEET = 'OWN_FLEET',
  EXTERNAL_COURIER = 'EXTERNAL_COURIER',
}

export enum BuyerType {
  INDIVIDUAL = 'INDIVIDUAL',
  CORPORATE = 'CORPORATE',
}

export enum FrontendMode {
  NATIVE_RUTA = 'NATIVE_RUTA',
  CUSTOM_LANDING_BY_RUTA = 'CUSTOM_LANDING_BY_RUTA',
}

export enum PaymentMethod {
  ONLINE_AT_ORDER = 'ONLINE_AT_ORDER',
  ELECTRONIC_ON_DELIVERY = 'ELECTRONIC_ON_DELIVERY',
  CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
}

export enum PaymentMethodSubmethod {
  DATAFONO = 'DATAFONO',
  BANK_TRANSFER = 'BANK_TRANSFER',
  PAYMENT_LINK = 'PAYMENT_LINK',
  QR = 'QR',
}

export enum RefundModality {
  STORE_CREDIT = 'STORE_CREDIT',
  BANK_REFUND = 'BANK_REFUND',
}

export enum ReturnMechanism {
  BUYER_SHIPS_VIA_COURIER = 'BUYER_SHIPS_VIA_COURIER',
  CLIENT_PICKS_UP = 'CLIENT_PICKS_UP',
}

/**
 * De dónde salió el pedido. Espeja **exactamente** el CHECK
 * `orders_order_origin_check` de `ruta_postgres.sql`: cualquier otro valor lo
 * rechaza Postgres con un 23514 en tiempo de ejecución.
 *
 * Existe porque ese campo se venía escribiendo con cadenas sueltas y tres
 * rutas distintas inventaron valores que no estaban en el CHECK
 * (`SCHEDULED_RECURRING`, `REPEAT_LAST`, `API`). Con el enum, un valor
 * inventado es un error de compilación y no una fila rechazada en producción.
 *
 * No confundir con `RecurrenceMode`: `SCHEDULED_RECURRING` es un modo de
 * recurrencia de la plantilla, no un origen de pedido. Un pedido nacido de
 * una plantilla —programada o repetida a mano— tiene origen `RECURRENCE`.
 */
export enum OrderOrigin {
  /** Lo creó el comprador en la tienda. */
  BUYER_UI = 'BUYER_UI',
  /** Lo registró el staff del Cliente para un comprador corporativo. */
  CORPORATE_MANUAL = 'CORPORATE_MANUAL',
  /** Lo generó una plantilla de recurrencia (programada o repetición manual). */
  RECURRENCE = 'RECURRENCE',
  /** Llegó desde el landing propio de un Cliente Full. */
  FULL_LANDING_API = 'FULL_LANDING_API',
  /** Lo inyectó un Cliente API por la API pública de logística. */
  API_LOGISTICS = 'API_LOGISTICS',
}

export enum RecurrenceMode {
  SCHEDULED_RECURRING = 'SCHEDULED_RECURRING',
  REPEAT_LAST_ORDER = 'REPEAT_LAST_ORDER',
}

export enum RecurrencePeriodicity {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  CUSTOM_INTERVAL = 'CUSTOM_INTERVAL',
}

export enum RecurrenceStatus {
  RECURRENCE_ACTIVE = 'RECURRENCE_ACTIVE',
  RECURRENCE_PAUSED = 'RECURRENCE_PAUSED',
  RECURRENCE_CANCELLED = 'RECURRENCE_CANCELLED',
}

export enum DisputeStatus {
  DISPUTED = 'DISPUTED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
}
