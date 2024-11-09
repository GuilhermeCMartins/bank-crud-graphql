import { ApolloServer, gql } from 'apollo-server-koa';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { transactionTypeDefs } from '../schemas/transaction.schema';
import { transactionResolvers } from './transaction.resolver';

jest.mock('@application/services/transaction.service', () => {
  return {
    TransactionService: jest.fn().mockImplementation(() => {
      return {
        getTransactionsByAccountId: jest.fn().mockResolvedValue([
          {
            id: '1',
            sender: '123',
            receiver: '456',
            amount: 100,
            type: 'transfer',
          },
          {
            id: '2',
            sender: '123',
            receiver: '789',
            amount: 50,
            type: 'withdraw',
          },
        ]),
        createTransaction: jest.fn().mockResolvedValue({
          id: '3',
          sender: '123',
          receiver: '456',
          amount: 200,
          type: 'deposit',
        }),
      };
    }),
  };
});

describe('Transaction Resolvers', () => {
  let server: ApolloServer;

  beforeAll(() => {
    const schema = makeExecutableSchema({
      typeDefs: transactionTypeDefs,
      resolvers: transactionResolvers,
    });
    server = new ApolloServer({
      schema: addMocksToSchema({
        schema,
        preserveResolvers: true,
      }),
    });
  });

  it('should return a list of transactions for a specific account', async () => {
    const query = gql`
      query GetTransactionsByAccountId($accountId: ID!) {
        getTransactionsByAccountId(accountId: $accountId) {
          id
          sender
          receiver
          amount
          type
        }
      }
    `;
    const variables = { accountId: '123' };

    const response = await server.executeOperation({ query, variables });
    expect(response.data?.getTransactionsByAccountId).toHaveLength(2);
    expect(response.data?.getTransactionsByAccountId[0]).toEqual({
      id: '1',
      sender: '123',
      receiver: '456',
      amount: 100,
      type: 'transfer',
    });
  });

  it('should return an validation error', async () => {
    const query = gql`
      query GetTransactionsByAccountId($accountId: ID!) {
        getTransactionsByAccountId(accountId: $accountId) {
          id
          sender
          receiver
          amount
          type
        }
      }
    `;
    const variables = undefined;

    const response = await server.executeOperation({ query, variables });
    expect(response.errors?.length).toBeGreaterThan(0);
  });

  it('should create a new transaction', async () => {
    const mutation = gql`
      mutation CreateTransaction(
        $receiver: String!
        $sender: String!
        $amount: Float!
        $type: String!
      ) {
        createTransaction(
          receiver: $receiver
          sender: $sender
          amount: $amount
          type: $type
        ) {
          id
          receiver
          sender
          amount
          type
        }
      }
    `;
    const variables = {
      receiver: '456',
      sender: '123',
      amount: 200,
      type: 'deposit',
    };

    const response = await server.executeOperation({
      query: mutation,
      variables,
    });
    expect(response.data?.createTransaction).toEqual({
      id: '3',
      receiver: '456',
      sender: '123',
      amount: 200,
      type: 'deposit',
    });
  });
});
