import { UserType, ClientType, FrontendMode } from '../enums/index.js';

/*
 * Aquí había `RegisterBuyerInput` y `LoginInput` escritos a mano, duplicando
 * `registerBuyerSchema` y `loginSchema`. No los usaba nadie y **el de registro
 * ya se había quedado desfasado**: declaraba `full_name`, `document_type` y
 * `document_number` obligatorios cuando la API los acepta opcionales.
 *
 * Los tipos de entrada se derivan del esquema Zod (`z.infer`), nunca se
 * escriben a mano: así no pueden separarse de lo que se valida de verdad.
 * Están en `validators/auth.schema.ts`.
 *
 * Las interfaces que quedan abajo son de **salida** (respuestas y proyecciones
 * de la BD), que no tienen esquema del que derivarse. Varias tampoco las usa
 * nadie —`AuthUser`, `UserProfile`, `CreateUserInput`, `ClientConfig`,
 * `CourierProfile`—; convendría revisarlas, pero borrarlas es aparte de esto.
 */

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
