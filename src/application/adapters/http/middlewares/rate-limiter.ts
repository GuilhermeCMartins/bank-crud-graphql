import type { Context, Next } from 'koa';

// @TODO: Implement all verifications of BACEN
const rateLimiter = async (ctx: Context, next: Next) => {
  const tenantId = ctx.state.tenantId;
  const bucketKey = `bucket_${tenantId}`;

  const maxRequests = 10;
  const refillRate = 1;
  const refillInterval = 1000;

  const bucket = await redis.hgetall(bucketKey);
  let remainingTokens = Number.parseInt(
    bucket.remainingTokens || maxRequests.toString(),
    10
  );
  const lastRefill = Number.parseInt(
    bucket.lastRefill || Date.now().toString(),
    10
  );

  const now = Date.now();
  const timeElapsed = now - lastRefill;
  const tokensToAdd = Math.floor((timeElapsed / refillInterval) * refillRate);

  remainingTokens = Math.min(remainingTokens + tokensToAdd, maxRequests);

  if (remainingTokens > 0) {
    remainingTokens--;
    await redis.hmset(bucketKey, {
      remainingTokens: remainingTokens.toString(),
      lastRefill: now.toString(),
    });
    await next();
  } else {
    ctx.status = 429;
    ctx.body = { error: 'Rate limit exceeded. Try again later.' };
  }
};

export default rateLimiter;
