import { RecurrenceStatus, RecurrencePeriodicity, RecurrenceMode } from '../enums/order_config.js';

export interface RecurrenceTemplateSummary {
  id: number;
  client_id: number;
  order_id: number;
  buyer_id: number;
  status: RecurrenceStatus;
  mode: RecurrenceMode;
  recurrence_periodicity: RecurrencePeriodicity;
  custom_interval_days?: number;
  next_generation_at: string;
  last_generated_at?: string;
  created_at: string;
  updated_at: string;
}
