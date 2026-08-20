import { z } from 'zod';
import { OrderStatus, PaymentStatus, RefundStatus, ReturnStatus, DisputeStatus, PaymentMethodSubmethod } from '../enums/index.js';

export const orderTransitionSchema = z.object({
  to_state: z.nativeEnum(OrderStatus),
  reason: z.string().optional(),
  dimension: z.enum(['order_status', 'payment_status', 'refund_status', 'return_status', 'dispute_status']),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().positive(),
  })).min(1, 'Al menos un item es requerido'),
});

export const confirmOrderSchema = z.object({
  delivery_type: z.enum(['SHIP', 'PICKUP']),
  delivery_address: z.object({
    line: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().length(2),
    postal_code: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    instructions: z.string().optional(),
  }).optional(),
  pickup_point_id: z.number().int().positive().optional(),
  payment_method: z.enum(['ONLINE_AT_ORDER', 'ELECTRONIC_ON_DELIVERY', 'CASH_ON_DELIVERY']),
  payment_method_submethod: z.enum(['DATAFONO', 'BANK_TRANSFER', 'PAYMENT_LINK', 'QR']).optional(),
}).refine(
  (data) => data.delivery_address || data.pickup_point_id,
  { message: 'Se requiere delivery_address o pickup_point_id' }
);

export const assignCourierSchema = z.object({
  courier_user_id: z.number().int().positive(),
});

export const cancelOrderSchema = z.object({
  reason: z.string().min(1, 'La razón de cancelación es requerida'),
});

export const requestCancelSchema = z.object({
  reason: z.string().min(1, 'La razón de la solicitud de cancelación es requerida'),
});

/**
 * Tope del data URI de la foto del recibo: ~1 MB de imagen ya codificada.
 * base64 infla ~33%, así que admite una foto de ~1 MB real. El frontend
 * comprime antes de enviar; este límite es la red de seguridad del servidor.
 */
export const MAX_EVIDENCE_DATA_URI_LENGTH = 1_400_000;

/** Formatos aceptados: los mismos de `storage.allowed_image_formats`. */
const DATA_IMAGE_URI_PATTERN = /^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/;

export function isDataImageUri(value: string): boolean {
  return DATA_IMAGE_URI_PATTERN.test(value);
}

export function isHttpEvidenceUrl(value: string): boolean {
  if (value.length > 1000) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Registro del cobro contra entrega.
 *
 * **A este esquema le faltaba `evidence_url`**, que es la foto del recibo: quien
 * se fiara de la versión publicada mandaba el cobro sin evidencia. El backend
 * tenía la definición completa en `collection.service.ts`; ahora vive aquí, una
 * sola vez, y el servicio la reexporta.
 */
export const recordCollectionSchema = z.object({
  amount: z.number().positive('El monto debe ser mayor a cero'),
  currency: z.string().length(3).default('COP'),
  method: z.enum(['CASH', 'ELECTRONIC']),
  electronic_submethod: z.enum(['DATAFONO', 'QR', 'BANK_TRANSFER', 'PAYMENT_LINK']).optional(),
  external_txn_id: z.string().max(255).optional(),
  notes: z.string().max(500).optional(),
  /**
   * Evidencia del cobro. Dos formas admitidas:
   *   - `https://…` — una URL a un archivo alojado fuera (≤ 1000 caracteres).
   *   - `data:image/…;base64,…` — la foto embebida.
   *
   * Lo segundo es provisional: el proyecto todavía no tiene object storage. Ver
   * `DEUDAS TECNICAS.md` §1.
   */
  evidence_url: z
    .string()
    .refine(
      (value) => (isDataImageUri(value) ? value.length <= MAX_EVIDENCE_DATA_URI_LENGTH : isHttpEvidenceUrl(value)),
      {
        message:
          'La evidencia debe ser una URL http(s) o una imagen jpeg/png/webp embebida de máximo 1 MB',
      },
    )
    .optional(),
});

export type RecordCollectionBody = z.infer<typeof recordCollectionSchema>;
