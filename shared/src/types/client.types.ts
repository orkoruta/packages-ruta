import { ClientType } from '../enums/index.js';

export interface PublicClientInfo {
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  client_type: ClientType;
}

export interface ClientParameter {
  parameter_key: string;
  parameter_value: string;
  value_type: 'INTEGER' | 'DECIMAL' | 'STRING' | 'BOOLEAN' | 'JSON';
  description?: string;
  is_overrideable_by_client: boolean;
}

export interface ProductListItem {
  id: number;
  name: string;
  description?: string;
  unit_price: number;
  currency: string;
  product_type: 'VENTA_NORMAL' | 'PROMOCION';
  image_url?: string;
  stock_quantity?: number;
  status: 'ACTIVE' | 'INACTIVE';
  category_id?: number;
  category_name?: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  unit_price: number;
  currency?: string;
  product_type: 'VENTA_NORMAL' | 'PROMOCION';
  category_id?: number;
  stock_quantity?: number;
}

export interface CategorySummary {
  id: number;
  name: string;
  description?: string;
  product_count?: number;
}

export interface PickupPointSummary {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  schedule?: string;
  contact_phone?: string;
}

export interface AuditEvent {
  id: number;
  client_id: number;
  actor_user_id: number;
  actor_user_type: string;
  action: string;
  entity_type: string;
  entity_id: number;
  details?: Record<string, unknown>;
  acting_via_control_view: boolean;
  impersonator_user_id?: number;
  ip_address?: string;
  created_at: string;
}

export interface ApiKeyInfo {
  id: number;
  key_id: string;
  name: string;
  scopes: string[];
  expires_at?: string;
  last_used_at?: string;
  status: 'ACTIVE' | 'REVOKED';
  created_at: string;
}
