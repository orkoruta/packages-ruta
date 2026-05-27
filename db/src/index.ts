export { prisma, default } from './client.js';
export {
  withTenant,
  withTenantReadOnly,
  withControlView,
  type TenantTransactionClient,
} from './tenant.js';
