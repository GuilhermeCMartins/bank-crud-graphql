import MongoDbConnection from '@application/database/db.connection';
import RedisConnection from '@application/database/redis.conneciton.';
import { ErrorMiddleware } from '@middlewares';
import Koa from 'koa';
import type { Context } from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';

export class Application {
  private app: Koa;
  private router: Router;
  private port: number;
  private mongoConnection: MongoDbConnection;
  private redisConnection: RedisConnection;

  constructor(port = 4000) {
    this.app = new Koa();
    this.router = new Router();
    this.port = port;

    const mongoUri = process.env.MONGODB_URI as string;
    this.mongoConnection = new MongoDbConnection(mongoUri);
    this.redisConnection = new RedisConnection();

    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares() {
    this.app.use(bodyParser());
    this.app.use(ErrorMiddleware);
  }

  private setupRoutes() {
    this.router.get('/', (ctx) => {
      ctx.body = 'ping';
    });

    this.router.get('/erro', (_: Context) => {
      throw new Error('Error example!');
    });

    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  public async start() {
    await this.mongoConnection.connect();
    this.redisConnection.getClient();

    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
    });
  }
}
