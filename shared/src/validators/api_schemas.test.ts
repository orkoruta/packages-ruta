import { describe, expect, it } from 'vitest';
import {
  createApiKeySchema,
  revokeApiKeySchema,
  apiKeyListQuerySchema,
  createApiOrderSchema,
  apiOrderListQuerySchema,
} from './index.js';

describe('createApiKeySchema', () => {
  it('valid input passes', () => {
    const parsed = createApiKeySchema.parse({
      name: 'Mi clave de integración',
      scopes: ['orders:write', 'orders:read'],
    });
    expect(parsed.name).toBe('Mi clave de integración');
    expect(parsed.scopes).toEqual(['orders:write', 'orders:read']);
    expect(parsed.expires_at).toBeUndefined();
  });

  it('valid input with expires_at passes', () => {
    const parsed = createApiKeySchema.parse({
      name: 'Clave temporal',
      scopes: ['orders:read'],
      expires_at: '2027-01-01T00:00:00.000Z',
    });
    expect(parsed.expires_at).toBe('2027-01-01T00:00:00.000Z');
  });

  it('fails when name is missing', () => {
    const result = createApiKeySchema.safeParse({
      scopes: ['orders:write'],
    });
    expect(result.success).toBe(false);
  });

  it('fails when name is empty string', () => {
    const result = createApiKeySchema.safeParse({
      name: '',
      scopes: ['orders:write'],
    });
    expect(result.success).toBe(false);
  });

  it('fails when scopes array is empty', () => {
    const result = createApiKeySchema.safeParse({
      name: 'Clave sin scopes',
      scopes: [],
    });
    expect(result.success).toBe(false);
  });

  it('fails when scopes contains invalid value', () => {
    const result = createApiKeySchema.safeParse({
      name: 'Clave inválida',
      scopes: ['orders:delete'],
    });
    expect(result.success).toBe(false);
  });

  it('fails when name exceeds max length', () => {
    const result = createApiKeySchema.safeParse({
      name: 'a'.repeat(101),
      scopes: ['orders:read'],
    });
    expect(result.success).toBe(false);
  });
});

describe('revokeApiKeySchema', () => {
  it('accepts empty body', () => {
    const parsed = revokeApiKeySchema.parse({});
    expect(parsed.reason).toBeUndefined();
  });

  it('accepts optional reason', () => {
    const parsed = revokeApiKeySchema.parse({ reason: 'Comprometida' });
    expect(parsed.reason).toBe('Comprometida');
  });

  it('fails when reason exceeds 500 chars', () => {
    const result = revokeApiKeySchema.safeParse({ reason: 'x'.repeat(501) });
    expect(result.success).toBe(false);
  });
});

describe('apiKeyListQuerySchema', () => {
  it('applies default pagination', () => {
    const parsed = apiKeyListQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.page_size).toBe(20);
  });

  it('coerces string pagination values', () => {
    const parsed = apiKeyListQuerySchema.parse({ page: '3', page_size: '50' });
    expect(parsed.page).toBe(3);
    expect(parsed.page_size).toBe(50);
  });

  it('fails when page_size exceeds 100', () => {
    const result = apiKeyListQuerySchema.safeParse({ page_size: 101 });
    expect(result.success).toBe(false);
  });
});

describe('createApiOrderSchema', () => {
  const baseItem = {
    name: 'Producto A',
    quantity: 2,
    unit_price_cents: 15000,
  };

  it('SHIP with delivery_address passes', () => {
    const parsed = createApiOrderSchema.parse({
      delivery_type: 'SHIP',
      initial_state: 'PREPARING',
      items: [baseItem],
      payment_method: 'COD',
      delivery_address: {
        street: 'Cra 7 # 32-16',
        city: 'Bogotá',
      },
    });
    expect(parsed.delivery_type).toBe('SHIP');
    expect(parsed.initial_state).toBe('PREPARING');
  });

  it('SHIP without delivery_address fails', () => {
    const result = createApiOrderSchema.safeParse({
      delivery_type: 'SHIP',
      initial_state: 'PREPARING',
      items: [baseItem],
      payment_method: 'COD',
    });
    expect(result.success).toBe(false);
  });

  it('PICKUP with pickup_point_id passes', () => {
    const parsed = createApiOrderSchema.parse({
      delivery_type: 'PICKUP',
      initial_state: 'READY_FOR_PICKUP',
      items: [baseItem],
      payment_method: 'PREPAID_EXTERNAL',
      pickup_point_id: BigInt(5),
    });
    expect(parsed.delivery_type).toBe('PICKUP');
    expect(parsed.pickup_point_id).toBe(BigInt(5));
  });

  it('PICKUP without pickup_point_id fails', () => {
    const result = createApiOrderSchema.safeParse({
      delivery_type: 'PICKUP',
      initial_state: 'READY_FOR_PICKUP',
      items: [baseItem],
      payment_method: 'COD',
    });
    expect(result.success).toBe(false);
  });

  it('READY_FOR_PICKUP with SHIP delivery_type fails', () => {
    const result = createApiOrderSchema.safeParse({
      delivery_type: 'SHIP',
      initial_state: 'READY_FOR_PICKUP',
      items: [baseItem],
      payment_method: 'COD',
      delivery_address: {
        street: 'Cra 7 # 32-16',
        city: 'Bogotá',
      },
    });
    expect(result.success).toBe(false);
  });

  it('PICKUP with non-READY_FOR_PICKUP initial_state fails', () => {
    const result = createApiOrderSchema.safeParse({
      delivery_type: 'PICKUP',
      initial_state: 'PREPARING',
      items: [baseItem],
      payment_method: 'COD',
      pickup_point_id: BigInt(5),
    });
    expect(result.success).toBe(false);
  });

  it('fails when items array is empty', () => {
    const result = createApiOrderSchema.safeParse({
      delivery_type: 'SHIP',
      initial_state: 'PREPARING',
      items: [],
      payment_method: 'COD',
      delivery_address: { street: 'Cra 7', city: 'Bogotá' },
    });
    expect(result.success).toBe(false);
  });

  it('accepts optional customer_info and notes', () => {
    const parsed = createApiOrderSchema.parse({
      delivery_type: 'SHIP',
      initial_state: 'AWAITING_COURIER_ASSIGNMENT',
      items: [baseItem],
      payment_method: 'PREPAID_EXTERNAL',
      delivery_address: { street: 'Cra 7 # 32-16', city: 'Bogotá' },
      customer_info: {
        name: 'Juan Pérez',
        phone: '+57 310 1234567',
        email: 'juan@example.com',
      },
      notes: 'Dejar en recepción',
    });
    expect(parsed.customer_info?.name).toBe('Juan Pérez');
    expect(parsed.notes).toBe('Dejar en recepción');
  });

  it('accepts delivery_address with optional coordinates', () => {
    const parsed = createApiOrderSchema.parse({
      delivery_type: 'SHIP',
      initial_state: 'READY_TO_SHIP',
      items: [baseItem],
      payment_method: 'COD',
      delivery_address: {
        street: 'Calle 100 # 15-20',
        city: 'Bogotá',
        state: 'Cundinamarca',
        postal_code: '110911',
        coordinates: { lat: 4.6951, lng: -74.0427 },
      },
    });
    expect(parsed.delivery_address?.coordinates?.lat).toBe(4.6951);
  });

  it('fails with invalid payment_method', () => {
    const result = createApiOrderSchema.safeParse({
      delivery_type: 'SHIP',
      initial_state: 'PREPARING',
      items: [baseItem],
      payment_method: 'ONLINE_AT_ORDER',
      delivery_address: { street: 'Cra 7', city: 'Bogotá' },
    });
    expect(result.success).toBe(false);
  });
});

describe('apiOrderListQuerySchema', () => {
  it('applies default pagination', () => {
    const parsed = apiOrderListQuerySchema.parse({});
    expect(parsed.page).toBe(1);
    expect(parsed.page_size).toBe(20);
    expect(parsed.status).toBeUndefined();
    expect(parsed.from).toBeUndefined();
    expect(parsed.to).toBeUndefined();
  });

  it('coerces string pagination values', () => {
    const parsed = apiOrderListQuerySchema.parse({ page: '2', page_size: '50' });
    expect(parsed.page).toBe(2);
    expect(parsed.page_size).toBe(50);
  });

  it('accepts optional datetime range filters', () => {
    const parsed = apiOrderListQuerySchema.parse({
      from: '2026-01-01T00:00:00.000Z',
      to: '2026-06-01T23:59:59.000Z',
      status: 'DELIVERED',
    });
    expect(parsed.from).toBe('2026-01-01T00:00:00.000Z');
    expect(parsed.to).toBe('2026-06-01T23:59:59.000Z');
    expect(parsed.status).toBe('DELIVERED');
  });

  it('fails when page_size exceeds 100', () => {
    const result = apiOrderListQuerySchema.safeParse({ page_size: 200 });
    expect(result.success).toBe(false);
  });

  it('fails with invalid datetime format', () => {
    const result = apiOrderListQuerySchema.safeParse({ from: '2026-01-01' });
    expect(result.success).toBe(false);
  });
});
