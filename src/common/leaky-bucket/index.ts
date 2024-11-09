import RedisConnection from '@application/database/redis.connection';
import type { Context } from 'koa';

export default class RateLimiter {
  private maxTokens: number;
  private refillInterval: number;
  private redisClient;

  constructor(maxTokens = 10, refillInterval = 3600000) {
    this.maxTokens = maxTokens;
    this.refillInterval = refillInterval;
    this.redisClient = new RedisConnection().getClient();
  }

  async canProceed(ctx: Context): Promise<boolean> {
    const tenantId = ctx.state.tenantId;
    const bucketKey = this.getBucketKey(tenantId);

    await this.refillTokens(bucketKey);
    return await this.hasAvailableTokens(bucketKey);
  }

  async consumeTokenOnFailure(id: string): Promise<void> {
    const bucketKey = this.getBucketKey(id);
    await this.consumeToken(bucketKey);
  }

  private getBucketKey(tenantId: string): string {
    return `bucket_${tenantId}`;
  }

  private async hasAvailableTokens(bucketKey: string): Promise<boolean> {
    const bucket = await this.redisClient.hgetall(bucketKey);

    const remainingTokens = Number.parseInt(
      bucket.remainingTokens || this.maxTokens.toString(),
      10
    );
    return remainingTokens > 0;
  }

  private async consumeToken(bucketKey: string): Promise<void> {
    const bucket = await this.redisClient.hgetall(bucketKey);
    let remainingTokens = Number.parseInt(
      bucket.remainingTokens || this.maxTokens.toString(),
      10
    );

    remainingTokens = Math.max(remainingTokens - 1, 0);

    await this.redisClient.hmset(bucketKey, {
      remainingTokens: remainingTokens.toString(),
      lastRefill: bucket.lastRefill || Date.now().toString(),
    });
  }

  private async refillTokens(bucketKey: string): Promise<void> {
    const bucket = await this.redisClient.hgetall(bucketKey);

    if (!bucket) {
      await this.redisClient.hmset(bucketKey, {
        remainingTokens: this.maxTokens.toString(),
        lastRefill: Date.now().toString(),
      });
      return;
    }

    const lastRefill = Number.parseInt(bucket.lastRefill, 10);
    const now = Date.now();

    const hoursElapsed = Math.floor((now - lastRefill) / this.refillInterval);
    if (hoursElapsed > 0) {
      let remainingTokens = Number.parseInt(bucket.remainingTokens, 10);

      remainingTokens = Math.min(
        remainingTokens + hoursElapsed,
        this.maxTokens
      );

      await this.redisClient.hmset(bucketKey, {
        remainingTokens: remainingTokens.toString(),
        lastRefill: now.toString(),
      });
    }
  }
}
