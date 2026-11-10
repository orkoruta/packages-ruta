import type { Prisma } from './generated/prisma-client/index.js';
import prisma from './client.js';

export type TenantTransactionClient = Prisma.TransactionClient;

/*
 * La API corre en Render (Oregón, EE. UU.) y la BD en Oracle Cloud (Colombia):
 * cada ida y vuelta cuesta del orden de 100+ ms. Dos consecuencias:
 *
 * - El contexto de tenant se fija en UNA sola sentencia (antes eran dos
 *   `set_config` seguidos = una ida y vuelta extra en cada transacción).
 * - El timeout de transacción por defecto de Prisma (5 s) se quedaba corto: con
 *   esta latencia, transacciones de varias consultas lo superaban y Prisma las
 *   abortaba («Transaction already closed … 5973 ms passed»), que el usuario
 *   veía como un error genérico. `maxWait` es lo que espera por una conexión
 *   libre del pool (connection_limit=5).
 */
const TX_OPTIONS = { maxWait: 10_000, timeout: 15_000 } as const;

/**
 * Ejecuta una función dentro del contexto de tenant.
 * Configura las variables de sesión para RLS antes de ejecutar.
 */
export async function withTenant<T>(
  clientId: number,
  userRole: string,
  fn: (tx: TenantTransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_client_id', ${String(clientId)}, true), set_config('app.current_user_role', ${userRole}, true)`;
    return fn(tx);
  }, TX_OPTIONS);
}

/**
 * Para queries que no modifican estado (solo lectura).
 * Configura las variables de sesión de forma más liviana.
 */
export async function withTenantReadOnly<T>(
  clientId: number,
  userRole: string,
  fn: (tx: TenantTransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_client_id', ${String(clientId)}, true), set_config('app.current_user_role', ${userRole}, true)`;
    return fn(tx);
  }, TX_OPTIONS);
}

/**
 * Para ADMIN_RUTA operando con Vista de Control.
 */
export async function withControlView<T>(
  clientId: number,
  impersonatorUserId: number,
  fn: (tx: TenantTransactionClient) => Promise<T>
): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.current_client_id', ${String(clientId)}, true), set_config('app.current_user_role', 'ADMIN_RUTA', true), set_config('app.impersonator_user_id', ${String(impersonatorUserId)}, true)`;
    return fn(tx);
  }, TX_OPTIONS);
}
