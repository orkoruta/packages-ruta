import { describe, expect, it } from 'vitest';
import { ClientType, OrderStatus } from '../enums/index.js';
import {
  loginSchema,
  loginRutaAdminSchema,
  registerBuyerSchema,
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
    const parsed = updateProductSchema.parse({ status: 'ARCHIVED' });
    expect(parsed.status).toBe('ARCHIVED');
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

describe('pickup point schemas', () => {
  it('validates pickup point creation', () => {
    const parsed = createPickupPointSchema.parse({
      name: 'Punto Centro',
      address: 'Cra 7 # 32-16',
      city: 'Bogotá',
      latitude: 4.6951,
      longitude: -74.0427,
    });
    expect(parsed.name).toBe('Punto Centro');
  });

  it('rejects invalid coordinates', () => {
    const result = createPickupPointSchema.safeParse({
      name: 'Punto',
      address: 'Cra 7',
      city: 'Bogotá',
      latitude: 200,
      longitude: -74,
    });
    expect(result.success).toBe(false);
  });

  it('validates pickup point list query with page_size default', () => {
    const parsed = pickupPointListQuerySchema.parse({ status: 'ACTIVE' });
    expect(parsed.page_size).toBe(50);
  });

  it('validates partial pickup point update', () => {
    const parsed = updatePickupPointSchema.parse({ status: 'INACTIVE' });
    expect(parsed.status).toBe('INACTIVE');
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
});
