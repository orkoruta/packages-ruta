import { z } from 'zod';
import { RecurrenceStatus, RecurrencePeriodicity } from '../enums/order_config.js';

export const markAsRecurringSchema = z.object({
  recurrence_periodicity: z.nativeEnum(RecurrencePeriodicity, {
    required_error: 'recurrence_periodicity es requerido',
  }),
  custom_interval_days: z.number().int().positive().optional(),
}).refine(
  (data) =>
    data.recurrence_periodicity !== RecurrencePeriodicity.CUSTOM_INTERVAL ||
    data.custom_interval_days !== undefined,
  {
    message: 'custom_interval_days es requerido cuando periodicity es CUSTOM_INTERVAL',
    path: ['custom_interval_days'],
  },
);

export const updateTemplateSchema = z.object({
  recurrence_periodicity: z.nativeEnum(RecurrencePeriodicity).optional(),
  custom_interval_days: z.number().int().positive().optional(),
  delivery_address: z
    .object({
      line: z.string().min(1),
      city: z.string().min(1),
      state: z.string().min(1),
      country: z.string().length(2),
      postal_code: z.string().optional(),
      latitude: z.number().min(-90).max(90).optional(),
      longitude: z.number().min(-180).max(180).optional(),
      instructions: z.string().optional(),
    })
    .optional(),
  payment_method: z.enum(['ONLINE_AT_ORDER', 'ELECTRONIC_ON_DELIVERY', 'CASH_ON_DELIVERY']).optional(),
});

export const recurrenceListQuerySchema = z.object({
  status: z.nativeEnum(RecurrenceStatus).optional(),
  page: z.coerce.number().int().positive().default(1),
  page_size: z.coerce.number().int().positive().max(100).default(20),
});

export type MarkAsRecurringInput = z.infer<typeof markAsRecurringSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type RecurrenceListQuery = z.infer<typeof recurrenceListQuerySchema>;
