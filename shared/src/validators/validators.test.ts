import { describe, expect, it } from 'vitest';
import { ClientType, OrderStatus, PaymentStatus, RefundStatus, RecurrenceStatus, RecurrencePeriodicity } from '../enums/index.js';
import {
  createCorporateOrderSchema,
  createCorporateOrderRecurringSchema,
  loginSchema,
  loginRutaAdminSchema,
  registerBuyerSchema,
  guestBuyerSchema,
  refreshSessionSchema,
  logoutSchema,
  controlViewEnterSchema,
  createClientSchema,
  updateClientSchema,
  clientListQuerySchema,
  createProductSchema,
  updateProductSchema,
  productListQuerySchema,
  createCategorySchema,
  updateCategorySchema,
  categoryListQuerySchema,
  updateBuyerProfileSchema,
  buyerListQuerySchema,
  createCourierSchema,
  updateCourierSchema,
  courierListQuerySchema,
  createPickupPointSchema,
  updatePickupPointSchema,
  pickupPointListQuerySchema,
  createOrderSchema,
  confirmOrderSchema,
  cancelOrderSchema,
  requestCancelSchema,
  orderTransitionSchema,
  initiatePaymentSchema,
  wompiWebhookEventSchema,
  paymentStatusQuerySchema,
  initiateRefundSchema,
  markRefundExecutedSchema,
  refundListQuerySchema,
  markAsRecurringSchema,
  updateTemplateSchema,
  recurrenceListQuerySchema,
} from './index.js';

describe('auth schemas', () => {
  it('validates buyer login', () => {
    const parsed = loginSchema.parse({
      client_slug: 'restaurante-piloto',
      email: 'buyer@example.com',
      password: 'secret',
    });
    expect(parsed.client_slug).toBe('restaurante-piloto');
  });

  it('rejects buyer login without client_slug', () => {
    const result = loginSchema.safeParse({ email: 'a@b.com', password: 'x' });
    expect(result.success).toBe(false);
  });

  it('validates ruta admin login', () => {
    const parsed = loginRutaAdminSchema.parse({ email: 'admin@ruta.com', password: 'pass' });
    expect(parsed.email).toBe('admin@ruta.com');
  });

  it('validates buyer register with all required fields', () => {
    const parsed = registerBuyerSchema.parse({
      client_slug: 'piloto',
      email: 'buyer@test.com',
      password: 'Password1!',
      full_name: 'Juan Pérez',
      document_type: 'CC',
      document_number: '12345678',
    });
    expect(parsed.email).toBe('buyer@test.com');
  });

  it('rejects register with password shorter than 8 chars', () => {
    const result = registerBuyerSchema.safeParse({
      client_slug: 'piloto',
      email: 'buyer@test.com',
      password: 'short',
      full_name: 'Juan',
      document_type: 'CC',
      document_number: '123',
    });
    expect(result.success).toBe(false);
  });

  it('validates refresh session with no body', () => {
    const parsed = refreshSessionSchema.parse({});
    expect(parsed.refresh_token).toBeUndefined();
  });

  it('validates logout defaults to all_sessions=false', () => {
    const parsed = logoutSchema.parse({});
    expect(parsed.all_sessions).toBe(false);
  });

  it('validates control view enter', () => {
    const parsed = controlViewEnterSchema.parse({
      target_client_id: 7,
      master_password: 'master123',
      reason: 'Support ticket #1234',
    });
    expect(parsed.target_client_id).toBe(7);
  });
});

describe('client schemas', () => {
  it('validates full client creation with frontend_mode', () => {
    const parsed = createClientSchema.parse({
      business_code: 'PILOT',
      slug: 'restaurante-piloto',
      name: 'Restaurante Piloto',
      client_type: ClientType.FULL,
      frontend_mode: 'NATIVE_RUTA',
    });
    expect(parsed.frontend_mode).toBe('NATIVE_RUTA');
  });

  it('requires frontend_mode for FULL clients', () => {
    const result = createClientSchema.safeParse({
      business_code: 'PILOT',
      slug: 'restaurante-piloto',
      name: 'Restaurante Piloto',
      client_type: ClientType.FULL,
    });
    expect(result.success).toBe(false);
  });

  it('validates API client without frontend_mode', () => {
    const parsed = createClientSchema.parse({
      business_code: 'API001',
      slug: 'api-client',
      name: 'API Client',
      client_type: ClientType.API,
    });
    expect(parsed.client_type).toBe(ClientType.API);
  });

  it('accepts partial client update', () => {
    const parsed = updateClientSchema.parse({ status: 'ACTIVE' });
    expect(parsed.status).toBe('ACTIVE');
  });

  it('validates client list query defaults', () => {
    const parsed = clientListQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.page_size).toBe(20);
  });

  it('validates client list query with all filters', () => {
    const parsed = clientListQuerySchema.parse({
      status: 'ACTIVE',
      client_type: 'FULL',
      q: 'restaurante',
    });
    expect(parsed.status).toBe('ACTIVE');
    expect(parsed.client_type).toBe('FULL');
    expect(parsed.q).toBe('restaurante');
  });
});

describe('product schemas', () => {
  it('validates product creation with defaults', () => {
    const parsed = createProductSchema.parse({
      name: 'Pizza Hawaiana',
      unit_price: 35000,
      product_type: 'VENTA_NORMAL',
    });
    expect(parsed.currency).toBe('COP');
  });

  it('rejects product with non-integer price', () => {
    const result = createProductSchema.safeParse({
      name: 'Pizza',
      unit_price: 35000.5,
      product_type: 'VENTA_NORMAL',
    });
    expect(result.success).toBe(false);
  });

  it('validates product list query with coerced category_id', () => {
    const parsed = productListQuerySchema.parse({ category_id: '5', status: 'ACTIVE', q: 'pizza' });
    expect(parsed.category_id).toBe(5);
    expect(parsed.page).toBe(1);
  });

  it('validates partial product update with status', () => {
    const parsed = updateProductSchema.parse({ status: 'INACTIVE' });
    expect(parsed.status).toBe('INACTIVE');
  });

  it('rechaza ARCHIVED: el CHECK de la BD solo admite ACTIVE/INACTIVE', () => {
    // Este test afirmaba lo contrario y pasaba, porque comprobaba una copia de
    // shared que no usaba nadie.
    expect(updateProductSchema.safeParse({ status: 'ARCHIVED' }).success).toBe(false);
    expect(updateCategorySchema.safeParse({ status: 'ARCHIVED' }).success).toBe(false);
  });
});

describe('category schemas', () => {
  it('validates category creation with sort_order default', () => {
    const parsed = createCategorySchema.parse({ name: 'Pizzas' });
    expect(parsed.sort_order).toBe(0);
  });

  it('validates category list query with page_size default', () => {
    const parsed = categoryListQuerySchema.parse({ status: 'ACTIVE' });
    expect(parsed.page_size).toBe(50);
  });

  it('rejects invalid category status', () => {
    const result = updateCategorySchema.safeParse({ status: 'INVALID' });
    expect(result.success).toBe(false);
  });
});

describe('buyer schemas', () => {
  it('validates partial buyer profile update', () => {
    const parsed = updateBuyerProfileSchema.parse({ full_name: 'Juan Pérez' });
    expect(parsed.full_name).toBe('Juan Pérez');
  });

  it('validates buyer list query defaults', () => {
    const parsed = buyerListQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.page_size).toBe(20);
  });

  it('validates buyer list query with status filter', () => {
    const parsed = buyerListQuerySchema.parse({ status: 'SUSPENDED' });
    expect(parsed.status).toBe('SUSPENDED');
  });
});

describe('courier schemas', () => {
  it('validates courier creation', () => {
    const parsed = createCourierSchema.parse({
      email: 'courier@test.com',
      password: 'Password1!',
      full_name: 'Carlos Repartidor',
      phone: '+57 300 0000000',
    });
    expect(parsed.email).toBe('courier@test.com');
  });

  it('validates partial courier update', () => {
    const parsed = updateCourierSchema.parse({ status: 'INACTIVE' });
    expect(parsed.status).toBe('INACTIVE');
  });

  it('validates courier list query', () => {
    const parsed = courierListQuerySchema.parse({ status: 'ACTIVE' });
    expect(parsed.status).toBe('ACTIVE');
    expect(parsed.page).toBe(1);
  });
});

/**
 * Estos tests describían un contrato que la API nunca tuvo: `address` en vez de
 * `address_line`, un `page_size` por defecto de 50 cuando el backend siempre
 * usó 20, y un `status` en el update que el esquema de creación no acepta —el
 * estado se cambia con `POST /:id/activate` y `/deactivate`—. Pasaban porque
 * comprobaban la copia de shared, que no la usaba nadie. Ahora shared es la
 * definición viva y estos casos reflejan lo que el backend valida.
 */
describe('pickup point schemas', () => {
  it('validates pickup point creation', () => {
    const parsed = createPickupPointSchema.parse({
      name: 'Punto Centro',
      address_line: 'Cra 7 # 32-16',
      city: 'Bogotá',
      latitude: 4.6951,
      longitude: -74.0427,
    });
    expect(parsed.name).toBe('Punto Centro');
    expect(parsed.address_line).toBe('Cra 7 # 32-16');
  });

  it('requires address_line, not address', () => {
    const result = createPickupPointSchema.safeParse({
      name: 'Punto Centro',
      address: 'Cra 7 # 32-16',
    });
    expect(result.success).toBe(false);
  });

  it('rejects invalid coordinates', () => {
    const result = createPickupPointSchema.safeParse({
      name: 'Punto',
      address_line: 'Cra 7',
      city: 'Bogotá',
      latitude: 200,
      longitude: -74,
    });
    expect(result.success).toBe(false);
  });

  it('accepts opening_hours as an object, not a string', () => {
    const parsed = createPickupPointSchema.parse({
      name: 'Punto Centro',
      address_line: 'Cra 7 # 32-16',
      opening_hours: { 'lunes-domingo': '12:00-22:00' },
    });
    expect(parsed.opening_hours).toEqual({ 'lunes-domingo': '12:00-22:00' });
  });

  it('validates pickup point list query with page_size default', () => {
    const parsed = pickupPointListQuerySchema.parse({ status: 'ACTIVE' });
    expect(parsed.page_size).toBe(20);
  });

  it('validates partial pickup point update', () => {
    const parsed = updatePickupPointSchema.parse({ contact_phone: '+573001234999' });
    expect(parsed.contact_phone).toBe('+573001234999');
  });
});

describe('order schemas', () => {
  it('validates draft order items', () => {
    const parsed = createOrderSchema.parse({
      items: [{ product_id: 1, quantity: 2 }],
    });
    expect(parsed.items[0]?.quantity).toBe(2);
    expect(OrderStatus.DRAFT).toBe('DRAFT');
  });

  it('rejects empty order items', () => {
    const result = createOrderSchema.safeParse({ items: [] });
    expect(result.success).toBe(false);
  });

  it('validates confirm order with SHIP delivery and online payment', () => {
    const parsed = confirmOrderSchema.parse({
      delivery_type: 'SHIP',
      delivery_address: {
        line: 'Cra 7 # 32-16',
        city: 'Bogotá',
        state: 'Cundinamarca',
        country: 'CO',
      },
      payment_method: 'ONLINE_AT_ORDER',
    });
    expect(parsed.delivery_type).toBe('SHIP');
    expect(parsed.payment_method).toBe('ONLINE_AT_ORDER');
  });

  it('validates confirm order with PICKUP delivery', () => {
    const parsed = confirmOrderSchema.parse({
      delivery_type: 'PICKUP',
      pickup_point_id: 5,
      payment_method: 'CASH_ON_DELIVERY',
    });
    expect(parsed.delivery_type).toBe('PICKUP');
    expect(parsed.pickup_point_id).toBe(5);
  });

  it('rejects confirm order without address or pickup_point_id', () => {
    const result = confirmOrderSchema.safeParse({
      delivery_type: 'SHIP',
      payment_method: 'ONLINE_AT_ORDER',
    });
    expect(result.success).toBe(false);
  });

  it('validates cancel order with reason', () => {
    const parsed = cancelOrderSchema.parse({ reason: 'Me equivoqué de producto' });
    expect(parsed.reason).toBe('Me equivoqué de producto');
  });

  it('rejects cancel order without reason', () => {
    const result = cancelOrderSchema.safeParse({ reason: '' });
    expect(result.success).toBe(false);
  });

  it('validates requestCancel with reason', () => {
    const parsed = requestCancelSchema.parse({ reason: 'Ya no lo necesito' });
    expect(parsed.reason).toBe('Ya no lo necesito');
  });

  it('rejects requestCancel without reason', () => {
    const result = requestCancelSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('validates order transition to a valid state', () => {
    const parsed = orderTransitionSchema.parse({
      to_state: OrderStatus.SELLER_CONFIRMED,
      dimension: 'order_status',
    });
    expect(parsed.to_state).toBe('SELLER_CONFIRMED');
    expect(parsed.dimension).toBe('order_status');
  });

  it('rejects order transition with invalid dimension', () => {
    const result = orderTransitionSchema.safeParse({
      to_state: OrderStatus.DELIVERED,
      dimension: 'invalid_dimension',
    });
    expect(result.success).toBe(false);
  });
});

describe('payment schemas', () => {
  it('validates initiate payment with no body', () => {
    const parsed = initiatePaymentSchema.parse({});
    expect(parsed.redirect_url).toBeUndefined();
  });

  it('validates initiate payment with redirect_url', () => {
    const parsed = initiatePaymentSchema.parse({
      redirect_url: 'https://tienda.example.com/confirmation',
    });
    expect(parsed.redirect_url).toBe('https://tienda.example.com/confirmation');
  });

  it('rejects initiate payment with invalid URL', () => {
    const result = initiatePaymentSchema.safeParse({ redirect_url: 'not-a-url' });
    expect(result.success).toBe(false);
  });

  it('validates wompi APPROVED webhook event', () => {
    const parsed = wompiWebhookEventSchema.parse({
      event: 'transaction.updated',
      data: {
        transaction: {
          id: 'txn_abc123',
          status: 'APPROVED',
          reference: 'ORDER-1001',
          amount_in_cents: 5000000,
          currency: 'COP',
          payment_method_type: 'CARD',
          created_at: '2026-05-27T10:00:00.000Z',
        },
      },
      signature: {
        checksum: 'abc123def456',
        properties: ['transaction.id', 'transaction.status', 'transaction.amount_in_cents'],
      },
      environment: 'test',
      timestamp: 1716800000,
    });
    expect(parsed.data.transaction.status).toBe('APPROVED');
    expect(parsed.environment).toBe('test');
  });

  it('rejects wompi webhook with invalid transaction status', () => {
    const result = wompiWebhookEventSchema.safeParse({
      event: 'transaction.updated',
      data: {
        transaction: {
          id: 'txn_abc',
          status: 'PENDING',
          reference: 'ORDER-1001',
          amount_in_cents: 5000000,
          currency: 'COP',
          payment_method_type: 'CARD',
          created_at: '2026-05-27T10:00:00.000Z',
        },
      },
      signature: { checksum: 'abc', properties: [] },
      environment: 'test',
      timestamp: 1716800000,
    });
    expect(result.success).toBe(false);
  });

  it('validates payment status query with defaults', () => {
    const parsed = paymentStatusQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.page_size).toBe(20);
    expect(parsed.payment_status).toBeUndefined();
  });

  it('validates payment status query with PAID filter', () => {
    const parsed = paymentStatusQuerySchema.parse({
      payment_status: PaymentStatus.PAID,
      page: '2',
    });
    expect(parsed.payment_status).toBe('PAID');
    expect(parsed.page).toBe(2);
  });

  it('rejects payment status query with invalid status', () => {
    const result = paymentStatusQuerySchema.safeParse({ payment_status: 'INVALID_STATUS' });
    expect(result.success).toBe(false);
  });
});

/**
 * El `order_id` que estos tests exigían en el cuerpo va en la ruta
 * (`POST /admin/orders/:id/refunds`), y faltaba `refund_modality`, que es
 * obligatorio. Se probaba una copia que no usaba nadie.
 */
describe('refund schemas', () => {
  it('validates initiateRefundSchema with required fields', () => {
    const parsed = initiateRefundSchema.parse({
      amount: 50000,
      refund_modality: 'BANK_REFUND',
    });
    expect(parsed.amount).toBe(50000);
    expect(parsed.refund_modality).toBe('BANK_REFUND');
    expect(parsed.reason).toBeUndefined();
  });

  it('validates initiateRefundSchema with optional reason', () => {
    const parsed = initiateRefundSchema.parse({
      amount: 50000,
      refund_modality: 'STORE_CREDIT',
      reason: 'Pedido cancelado por cliente',
    });
    expect(parsed.reason).toBe('Pedido cancelado por cliente');
  });

  it('rejects initiateRefundSchema when refund_modality is missing', () => {
    const result = initiateRefundSchema.safeParse({ amount: 50000 });
    expect(result.success).toBe(false);
  });

  it('rejects initiateRefundSchema when amount is negative', () => {
    const result = initiateRefundSchema.safeParse({
      amount: -1000,
      refund_modality: 'BANK_REFUND',
    });
    expect(result.success).toBe(false);
  });

  it('rejects initiateRefundSchema when amount is zero', () => {
    const result = initiateRefundSchema.safeParse({
      order_id: BigInt(1001),
      amount: 0,
    });
    expect(result.success).toBe(false);
  });

  it('validates markRefundExecutedSchema with all optional fields', () => {
    const parsed = markRefundExecutedSchema.parse({
      outcome: 'REFUNDED',
      amount_executed: 50000,
      external_provider_refund_id: 'wom_ref_abc123',
      evidence: 'https://storage.example.com/receipt.pdf',
    });
    expect(parsed.outcome).toBe('REFUNDED');
    expect(parsed.amount_executed).toBe(50000);
    expect(parsed.external_provider_refund_id).toBe('wom_ref_abc123');
  });

  it('requires outcome: un cuerpo vacío no vale', () => {
    // El panel mandaba `result` en vez de `outcome`, así que este endpoint
    // devolvía 400 siempre. Aquí queda fijado que el campo es obligatorio.
    expect(markRefundExecutedSchema.safeParse({}).success).toBe(false);
    expect(markRefundExecutedSchema.safeParse({ result: 'REFUNDED' }).success).toBe(false);
  });

  it('solo acepta los tres resultados de la API', () => {
    expect(markRefundExecutedSchema.safeParse({ outcome: 'PARTIALLY_REFUNDED' }).success).toBe(true);
    expect(markRefundExecutedSchema.safeParse({ outcome: 'DEVUELTO' }).success).toBe(false);
  });

  it('validates refundListQuerySchema defaults', () => {
    const parsed = refundListQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.page_size).toBe(20);
    expect(parsed.refund_status).toBeUndefined();
  });

  // El filtro se llama `status`: es lo que lee el backend y lo que manda la
  // pantalla. El `refund_status` que se probaba aquí no existía en la API.
  it('validates refundListQuerySchema with status filter and coerced page', () => {
    const parsed = refundListQuerySchema.parse({
      status: RefundStatus.REFUND_PENDING,
      page: '3',
      page_size: '10',
    });
    expect(parsed.status).toBe('REFUND_PENDING');
    expect(parsed.page).toBe(3);
    expect(parsed.page_size).toBe(10);
  });

  it('accepts the calendar day the date pickers send', () => {
    const parsed = refundListQuerySchema.parse({ from: '2026-08-01', to: '2026-08-11' });
    expect(parsed.from).toBe('2026-08-01');
    expect(parsed.to).toBe('2026-08-11');
  });

  it('validates refundListQuerySchema with datetime range filters', () => {
    const parsed = refundListQuerySchema.parse({
      from: '2026-01-01T00:00:00Z',
      to: '2026-06-01T23:59:59Z',
    });
    expect(parsed.from).toBe('2026-01-01T00:00:00Z');
    expect(parsed.to).toBe('2026-06-01T23:59:59Z');
  });
});

describe('recurrence schemas', () => {
  it('validates markAsRecurringSchema with required periodicity', () => {
    const parsed = markAsRecurringSchema.parse({
      recurrence_periodicity: RecurrencePeriodicity.WEEKLY,
    });
    expect(parsed.recurrence_periodicity).toBe('WEEKLY');
    expect(parsed.custom_interval_days).toBeUndefined();
  });

  it('rejects markAsRecurringSchema when recurrence_periodicity is missing', () => {
    const result = markAsRecurringSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects markAsRecurringSchema with invalid periodicity value', () => {
    const result = markAsRecurringSchema.safeParse({ recurrence_periodicity: 'INVALID' });
    expect(result.success).toBe(false);
  });

  it('validates markAsRecurringSchema CUSTOM_INTERVAL requires custom_interval_days', () => {
    const valid = markAsRecurringSchema.parse({
      recurrence_periodicity: RecurrencePeriodicity.CUSTOM_INTERVAL,
      custom_interval_days: 10,
    });
    expect(valid.custom_interval_days).toBe(10);
  });

  it('rejects markAsRecurringSchema CUSTOM_INTERVAL without custom_interval_days', () => {
    const result = markAsRecurringSchema.safeParse({
      recurrence_periodicity: RecurrencePeriodicity.CUSTOM_INTERVAL,
    });
    expect(result.success).toBe(false);
  });

  it('validates updateTemplateSchema with all optional fields', () => {
    const parsed = updateTemplateSchema.parse({
      recurrence_periodicity: RecurrencePeriodicity.MONTHLY,
      payment_method: 'CASH_ON_DELIVERY',
    });
    expect(parsed.recurrence_periodicity).toBe('MONTHLY');
    expect(parsed.payment_method).toBe('CASH_ON_DELIVERY');
  });

  it('validates updateTemplateSchema with empty body', () => {
    const parsed = updateTemplateSchema.parse({});
    expect(parsed.recurrence_periodicity).toBeUndefined();
    expect(parsed.delivery_address).toBeUndefined();
  });

  it('validates recurrenceListQuerySchema defaults', () => {
    const parsed = recurrenceListQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.page_size).toBe(20);
    expect(parsed.status).toBeUndefined();
  });

  it('validates recurrenceListQuerySchema with status filter and coerced pagination', () => {
    const parsed = recurrenceListQuerySchema.parse({
      status: RecurrenceStatus.RECURRENCE_ACTIVE,
      page: '2',
      page_size: '5',
    });
    expect(parsed.status).toBe('RECURRENCE_ACTIVE');
    expect(parsed.page).toBe(2);
    expect(parsed.page_size).toBe(5);
  });

  it('rejects recurrenceListQuerySchema with invalid status', () => {
    const result = recurrenceListQuerySchema.safeParse({ status: 'INVALID_STATUS' });
    expect(result.success).toBe(false);
  });
});

// ── Flujo 6 — destino de entrega en pedidos corporativos ─────────────────────

describe('createCorporateOrderSchema — destino de entrega', () => {
  const base = {
    buyer_id: 13,
    corporate_contact: { name: 'Empresa XYZ' },
    items: [{ product_id: 10, quantity: 2 }],
    payment_method: 'CASH_ON_DELIVERY' as const,
  };

  const address = {
    line: 'Cra 7 #140-20',
    city: 'Bogotá',
    state: 'Cundinamarca',
    country: 'CO',
    latitude: 4.728,
    longitude: -74.045,
  };

  it('acepta SHIP con dirección completa', () => {
    const result = createCorporateOrderSchema.safeParse({
      ...base,
      delivery_type: 'SHIP',
      delivery_address: address,
    });
    expect(result.success).toBe(true);
  });

  it('rechaza SHIP sin dirección', () => {
    const result = createCorporateOrderSchema.safeParse({ ...base, delivery_type: 'SHIP' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.delivery_address).toBeDefined();
    }
  });

  it('rechaza SHIP con dirección sin coordenadas — sin ellas no llega al mapa', () => {
    const { latitude: _lat, longitude: _lng, ...noCoords } = address;
    const result = createCorporateOrderSchema.safeParse({
      ...base,
      delivery_type: 'SHIP',
      delivery_address: noCoords,
    });
    expect(result.success).toBe(false);
  });

  it('acepta PICKUP con punto de recogida', () => {
    const result = createCorporateOrderSchema.safeParse({
      ...base,
      delivery_type: 'PICKUP',
      pickup_point_id: 3,
    });
    expect(result.success).toBe(true);
  });

  it('rechaza PICKUP sin punto de recogida', () => {
    const result = createCorporateOrderSchema.safeParse({ ...base, delivery_type: 'PICKUP' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.pickup_point_id).toBeDefined();
    }
  });

  it('aplica la misma exigencia de destino al corporativo recurrente', () => {
    const result = createCorporateOrderRecurringSchema.safeParse({
      ...base,
      delivery_type: 'SHIP',
      recurrence_periodicity: RecurrencePeriodicity.WEEKLY,
    });
    expect(result.success).toBe(false);
  });
});

/**
 * Estos casos fijan divergencias reales entre lo que shared declaraba y lo que
 * la API acepta. Todas se encontraron comparando esquema contra endpoint el
 * 2026-08-12, y una de ellas (el `reason` de Vista de Control) llegó a romper
 * tres tests del backend al conectarla.
 *
 * La regla que fijan: **el contrato describe lo que la API acepta**. Una
 * pantalla puede exigir más que la API; el esquema compartido, nunca.
 */
describe('el contrato refleja lo que la API acepta, no lo que la UI exige', () => {
  it('registro: nombre y documento son opcionales, aunque el formulario los pida', () => {
    const parsed = registerBuyerSchema.parse({
      client_slug: 'piloto',
      email: 'buyer@test.com',
      password: 'Password1!',
    });
    expect(parsed.full_name).toBeUndefined();
    expect(parsed.document_number).toBeUndefined();
  });

  it('registro: `document_type` admite hasta 20 caracteres, no 10', () => {
    const result = registerBuyerSchema.safeParse({
      client_slug: 'piloto',
      email: 'buyer@test.com',
      password: 'Password1!',
      document_type: 'CEDULA_EXTRANJERIA',
    });
    expect(result.success).toBe(true);
  });

  it('invitado: solo el slug es obligatorio', () => {
    const parsed = guestBuyerSchema.parse({ client_slug: 'piloto' });
    expect(parsed.phone).toBeUndefined();
  });

  it('Vista de Control: `reason` es opcional', () => {
    // Declararlo obligatorio devolvía 400 en el endpoint real.
    const parsed = controlViewEnterSchema.parse({
      target_client_id: 7,
      master_password: 'master123',
    });
    expect(parsed.reason).toBeUndefined();
  });

  it('perfil del comprador: solo nombre y teléfono', () => {
    // Declaraba también document_type, document_number y default_address, que
    // el endpoint descarta en silencio.
    const parsed = updateBuyerProfileSchema.parse({
      full_name: 'Ana',
      document_number: '123',
    } as Record<string, unknown>);
    expect(parsed).toEqual({ full_name: 'Ana' });
  });

  it('perfil del comprador: recorta espacios en vez de guardar un nombre en blanco', () => {
    expect(updateBuyerProfileSchema.safeParse({ full_name: '   ' }).success).toBe(false);
    expect(updateBuyerProfileSchema.parse({ full_name: '  Ana  ' }).full_name).toBe('Ana');
  });
});
