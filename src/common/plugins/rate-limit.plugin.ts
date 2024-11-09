import RateLimiter from '@common/leaky-bucket';
import type { Context } from 'koa';

const rateLimitPlugin = {
  async requestDidStart() {
    return {
      async didEncounterErrors(ctx: Context) {
        const rateLimiter = new RateLimiter();
        const tenantId = ctx.context.ctx.request.header['x-tenant-id'];

        if (!tenantId) return;

        if (ctx.errors.length > 0) {
          await rateLimiter.consumeTokenOnFailure(tenantId);
        }
      },
    };
  },
};

export default rateLimitPlugin;
