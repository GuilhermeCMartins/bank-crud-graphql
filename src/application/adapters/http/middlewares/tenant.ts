import type { Context, Next } from 'koa';

// @TODO: Add types for tenants, idenfity if we have this tenant register.
const tenantIdentifier = async (ctx: Context, next: Next) => {
  const tenantId = ctx.request.header['x-tenant-id'];
  if (!tenantId) {
    ctx.status = 400;
    ctx.body = { error: 'Tenant ID is missing' };
    return;
  }
  ctx.state.tenantId = tenantId;
  await next();
};

export default tenantIdentifier;
