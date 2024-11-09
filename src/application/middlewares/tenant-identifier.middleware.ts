import type { Context, Next } from 'koa';
import tenant, { TenantStatus } from '@application/entities/tenant.entity';
import { UnsupportedTenant } from '@common/errors';
import TenantPlugin from '@common/plugins/tenant.plugin';
import RateLimiter from '@common/leaky-bucket';

const tenantIdentifier = async (ctx: Context, next: Next) => {
  const tenantId = ctx.request.headers['x-tenant-id'];
  const rateLimiter = new RateLimiter();

  if (!tenantId) {
    throw new Error('Tenant id is missing.');
  }

  const t = await tenant.findOne({ name: tenantId });

  if (!t) {
    throw new UnsupportedTenant('Tenant does not exists.');
  }

  if (t.status !== TenantStatus.ACTIVE) {
    throw new UnsupportedTenant('Tenant unactive.');
  }

  TenantPlugin.setTenant(t.id);
  ctx.state.tenantId = t.name;

  const canProceed = await rateLimiter.canProceed(ctx);

  if (canProceed) {
    await next();
  } else {
    ctx.status = 429;
    ctx.body = { error: 'Rate limit exceeded. Try again later.' };
  }
};

export default tenantIdentifier;
