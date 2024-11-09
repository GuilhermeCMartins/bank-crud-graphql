import Redis, { type Redis as IORedis } from 'ioredis';

class RedisConnection {
  private client: IORedis;

  constructor() {
    this.client = new Redis({
      host: 'localhost',
      port: 6379,
      password: '',
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  public getClient(): IORedis {
    return this.client;
  }

  public async disconnect(): Promise<void> {
    await this.client.quit();
    console.log('Disconnected from Redis');
  }
}

export default RedisConnection;
