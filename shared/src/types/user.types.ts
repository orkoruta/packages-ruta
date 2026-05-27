import { UserType, ClientType, FrontendMode } from '../enums/index.js';

export interface RegisterBuyerInput {
  client_slug: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  document_type: string;
  document_number: string;
}

export interface LoginInput {
  client_slug: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user_id: number;
  client_id: number;
  user_type: UserType;
  expires_in_seconds: number;
}

export interface AuthUser {
  user_id: number;
  client_id: number;
  user_type: UserType;
  email: string;
  full_name: string;
}

export interface UserProfile {
  id: number;
  client_id: number;
  user_type: UserType;
  email: string;
  full_name: string;
  phone?: string;
  document_type?: string;
  document_number?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  created_at: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  document_type?: string;
  document_number?: string;
  user_type: UserType;
}

export interface ClientConfig {
  id: number;
  business_code: string;
  slug: string;
  name: string;
  description?: string;
  logo_url?: string;
  client_type: ClientType;
  frontend_mode?: FrontendMode;
  status: 'ACTIVE' | 'INACTIVE';
  refund_modality?: string;
  return_mechanism?: string;
  created_at: string;
}

export interface CreateClientInput {
  business_code: string;
  slug: string;
  name: string;
  description?: string;
  client_type: ClientType;
  frontend_mode?: FrontendMode;
}

export interface CourierProfile {
  id: number;
  client_id: number;
  full_name: string;
  phone: string;
  document_type?: string;
  document_number?: string;
  transport_mode?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}

export interface BuyerProfile {
  id: number;
  client_id: number;
  full_name: string;
  email: string;
  phone?: string;
  buyer_type: 'INDIVIDUAL' | 'CORPORATE';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
}
