import { describe, expect, it } from 'vitest';
import { ClientType, OrderStatus } from '../enums/index.js';
import {
  createClientSchema,
  createOrderSchema,
  loginSchema,
  updateClientSchema,
} from './index.js';

describe('shared validators', () => {
  it('validates buyer login input', () => {
    const parsed = loginSchema.parse({
      client_slug: 'restaurante-piloto',
      email: 'buyer@example.com',
      password: 'secret',
    });

    expect(parsed.client_slug).toBe('restaurante-piloto');
  });

  it('requires frontend_mode for full clients', () => {
    const result = createClientSchema.safeParse({
      business_code: 'PILOT',
      slug: 'restaurante-piloto',
      name: 'Restaurante Piloto',
      client_type: ClientType.FULL,
    });

    expect(result.success).toBe(false);
  });

  it('accepts partial client updates', () => {
    const parsed = updateClientSchema.parse({
      status: 'ACTIVE',
    });

    expect(parsed.status).toBe('ACTIVE');
  });

  it('validates draft order items', () => {
    const parsed = createOrderSchema.parse({
      items: [{ product_id: 1, quantity: 2 }],
    });

    expect(parsed.items[0]?.quantity).toBe(2);
    expect(OrderStatus.DRAFT).toBe('DRAFT');
  });
});
