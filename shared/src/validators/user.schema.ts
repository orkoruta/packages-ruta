import { z } from 'zod';
import { ClientType } from '../enums/index.js';

/**
 * Registro de comprador (`POST /auth/register`).
 *
 * Ajustado a lo que la API **acepta de verdad**, que es más permisivo de lo que
 * decía aquí: `full_name`, `document_type` y `document_number` figuraban como
 * obligatorios y no lo son, y `document_type` admitía 10 caracteres cuando el
 * backend permite 20. Un cliente que se hubiera fiado de este esquema habría
 * rechazado en local peticiones que la API acepta sin problema.
 *
 * Que el formulario del storefront los pida obligatorios es una decisión de
 * producto **encima** del contrato, no el contrato: una interfaz puede exigir
 * más que la API, nunca menos. Si algún día deben ser obligatorios de verdad,
 * hay que endurecer primero `routes/auth.ts` —eso afecta a los Clientes API— y
 * después este esquema.
 */
export const registerBuyerSchema = z.object({
  client_slug: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(1).max(200).optional(),
  phone: z.string().min(1).max(50).optional(),
  document_type: z.string().min(1).max(20).optional(),
  document_number: z.string().min(1).max(50).optional(),
});

/**
 * Compra como invitado (`POST /auth/guest`). No tenía esquema en shared; vivía
 * solo en `routes/auth.ts`.
 *
 * `phone` es **opcional en la API**, aunque el teléfono sea el único contacto
 * real de un invitado —su correo es sintético— y el formulario del storefront
 * lo pida. Se refleja tal cual está: el contrato describe lo que la API acepta.
 * Hacerlo obligatorio es un cambio de comportamiento del endpoint, no una
 * corrección de tipos, y hay que decidirlo aparte.
 */
export const guestBuyerSchema = z.object({
  client_slug: z.string().min(1),
  full_name: z.string().min(1).max(200).optional(),
  phone: z.string().min(1).max(50).optional(),
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

/**
 * Entrar en Vista de Control (`POST /ruta-admin/control-view/enter`).
 *
 * `reason` figuraba como **obligatorio** y la API lo acepta opcional. Nadie
 * usaba este esquema, así que la diferencia no se notaba; al conectarlo de
 * verdad, tres tests de `control_view` pasaron a devolver 400.
 *
 * Se refleja el comportamiento real. Aparte: que la impersonación se pueda
 * hacer **sin dejar un motivo** es discutible para una acción auditada, pero
 * exigirlo es un cambio de endpoint, no de tipos.
 */
export const controlViewEnterSchema = z.object({
  target_client_id: z.number().int().positive(),
  master_password: z.string().min(1),
  reason: z.string().max(500).optional(),
});

export const presignedUrlSchema = z.object({
  purpose: z.enum(['PRODUCT_IMAGE', 'DELIVERY_EVIDENCE', 'COLLECTION_EVIDENCE', 'RETURN_EVIDENCE', 'LOGO']),
  filename: z.string().min(1),
  content_type: z.string().min(1),
  related_entity_type: z.enum(['order', 'product', 'client', 'refund', 'return']),
  related_entity_id: z.number().int().positive(),
});
