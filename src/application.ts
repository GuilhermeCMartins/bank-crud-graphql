import MongoDbConnection from '@application/database/db.connection';
import { seedTenants } from '@application/database/tenant.seeder';
import { formatGraphQLResponse } from '@application/middlewares/graphql-response';
import tenantIdentifier from '@application/middlewares/tenant';
import { ApolloServer } from 'apollo-server-koa';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { formatGraphQLError } from '@application/middlewares/graphql-error';
import rateLimitPlugin from '@common/plugins/rate-limit.plugin';
import { accountTypeDefs } from '@application/adapters/http/graphql/schemas/account.schema';
import { transactionTypeDefs } from '@application/adapters/http/graphql/schemas/transaction.schema';
import { accountResolvers } from '@application/adapters/http/graphql/resolvers/account.resolver';
import { transactionResolvers } from '@application/adapters/http/graphql/resolvers/transaction.resolver';

export class Application {
  private app: Koa;
  private port: number;

  constructor(port = 4000) {
    this.app = new Koa();
    this.port = port;

    this.setupMiddlewares();
  }

  private setupMiddlewares() {
    this.app.use(bodyParser());
    this.app.use(tenantIdentifier);
  }

  private async setupGraphQL() {
    const server = new ApolloServer({
      typeDefs: [accountTypeDefs, transactionTypeDefs],
      resolvers: [accountResolvers, transactionResolvers],
      formatResponse: formatGraphQLResponse,
      formatError: formatGraphQLError,
      context: ({ ctx }) => ({ ctx }),
      //@ts-ignore
      plugins: [rateLimitPlugin],
    });

    await server.start();
    server.applyMiddleware({ app: this.app });
  }

  public async start() {
    await seedTenants();
    const mongoDb = new MongoDbConnection();
    await mongoDb.connect();

    await this.setupGraphQL();

    this.app.listen(this.port, () => {
      console.log(`Server running at http://localhost:${this.port}`);
    });
  }
}
