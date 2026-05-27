import type { Prisma } from './generated/prisma-client/index.js';
import prisma from './client.js';

export type TenantTransactionClient = Prisma.TransactionClient;

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
    await tx.$executeRaw`SELECT set_config('app.current_client_id', ${String(clientId)}, true)`;
    await tx.$executeRaw`SELECT set_config('app.current_user_role', ${userRole}, true)`;
    return fn(tx);
  });
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
    await tx.$executeRaw`SELECT set_config('app.current_client_id', ${String(clientId)}, true)`;
    await tx.$executeRaw`SELECT set_config('app.current_user_role', ${userRole}, true)`;
    return fn(tx);
  });
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
    await tx.$executeRaw`SELECT set_config('app.current_client_id', ${String(clientId)}, true)`;
    await tx.$executeRaw`SELECT set_config('app.current_user_role', 'ADMIN_RUTA', true)`;
    await tx.$executeRaw`SELECT set_config('app.impersonator_user_id', ${String(impersonatorUserId)}, true)`;
    return fn(tx);
  });
}
