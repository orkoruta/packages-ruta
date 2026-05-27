import { z } from 'zod';
import { ClientType } from '../enums/index.js';

export const registerBuyerSchema = z.object({
  client_slug: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8).max(128),
  full_name: z.string().min(1).max(200),
  phone: z.string().optional(),
  document_type: z.string().min(1).max(10),
  document_number: z.string().min(1).max(50),
});

export const loginSchema = z.object({
  client_slug: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(1),
});

export const loginRutaAdminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createClientSchema = z.object({
  business_code: z.string().min(1).max(20),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug debe ser alfanumérico con guiones'),
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  client_type: z.nativeEnum(ClientType),
  frontend_mode: z.enum(['NATIVE_RUTA', 'CUSTOM_LANDING_BY_RUTA']).optional(),
}).refine(
  (data) => {
    if (data.client_type === 'FULL' && !data.frontend_mode) {
      return false;
    }
    return true;
  },
  { message: 'Cliente FULL requiere frontend_mode' }
);

export const createProductSchema = z.object({
  name: z.string().min(1).max(300),
  description: z.string().optional(),
  unit_price: z.number().int().positive(),
  currency: z.string().length(3).default('COP'),
  product_type: z.enum(['VENTA_NORMAL', 'PROMOCION']),
  category_id: z.number().int().positive().optional(),
  stock_quantity: z.number().int().min(0).optional(),
});

export const createCourierSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  full_name: z.string().min(1).max(200),
  phone: z.string().min(1),
  document_type: z.string().optional(),
  document_number: z.string().optional(),
  transport_mode: z.string().optional(),
});

export const controlViewEnterSchema = z.object({
  target_client_id: z.number().int().positive(),
  master_password: z.string().min(1),
  reason: z.string().min(1).max(500),
});

export const presignedUrlSchema = z.object({
  purpose: z.enum(['PRODUCT_IMAGE', 'DELIVERY_EVIDENCE', 'COLLECTION_EVIDENCE', 'RETURN_EVIDENCE', 'LOGO']),
  filename: z.string().min(1),
  content_type: z.string().min(1),
  related_entity_type: z.enum(['order', 'product', 'client', 'refund', 'return']),
  related_entity_id: z.number().int().positive(),
});
