import { ApolloServer, gql } from 'apollo-server-koa';
import { addMocksToSchema } from '@graphql-tools/mock';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { accountResolvers } from './account.resolver';
import { accountTypeDefs } from '../schemas/account.schema';

jest.mock('@application/services/account.service', () => {
  return {
    AccountService: jest.fn().mockImplementation(() => {
      return {
        getAccounts: jest.fn().mockResolvedValue([
          { id: '1', number: '1', holderName: 'Account 1', balance: 100 },
          { id: '2', number: '2', holderName: 'Account 2', balance: 200 },
        ]),
        getAccountById: jest.fn().mockResolvedValue({
          id: '1',
          number: '1',
          holderName: 'Account 1',
          balance: 100,
        }),
        createAccount: jest.fn().mockResolvedValue({
          id: '3',
          number: '3',
          holderName: 'New Account',
          balance: 300,
        }),
        deleteAccount: jest.fn().mockResolvedValue(true),
      };
    }),
  };
});

describe('Account Resolvers', () => {
  let server: ApolloServer;

  beforeAll(() => {
    const schema = makeExecutableSchema({
      typeDefs: accountTypeDefs,
      resolvers: accountResolvers,
    });
    server = new ApolloServer({
      schema: addMocksToSchema({
        schema,
        preserveResolvers: true,
      }),
    });
  });

  it('should return a list of accounts', async () => {
    const query = gql`
      query {
        getAccounts {
          id
          number
          holderName
          balance
        }
      }
    `;

    const response = await server.executeOperation({ query });
    expect(response.data?.getAccounts).toHaveLength(2);
    expect(response.data?.getAccounts[0]).toEqual({
      id: '1',
      number: '1',
      holderName: 'Account 1',
      balance: 100,
    });
  });

  it('should return an account by id', async () => {
    const query = gql`
      query GetAccountById($id: ID!) {
        getAccountById(id: $id) {
          id
          number
          holderName
          balance
        }
      }
    `;

    const variables = { id: '1' };
    const response = await server.executeOperation({ query, variables });
    expect(response.data?.getAccountById).toEqual({
      id: '1',
      number: '1',
      holderName: 'Account 1',
      balance: 100,
    });
  });

  it('should create a new account', async () => {
    const mutation = gql`
      mutation CreateAccount(
        $number: String!
        $holderName: String!
        $balance: Float!
      ) {
        createAccount(
          number: $number
          holderName: $holderName
          balance: $balance
        ) {
          id
          number
          holderName
          balance
        }
      }
    `;

    const variables = {
      number: '3',
      holderName: 'New Account',
      balance: 300,
    };
    const response = await server.executeOperation({
      query: mutation,
      variables,
    });
    expect(response.data?.createAccount).toEqual({
      id: '3',
      number: '3',
      holderName: 'New Account',
      balance: 300,
    });
  });

  it('should delete an account by id', async () => {
    const mutation = gql`
      mutation DeleteAccount($id: ID!) {
        deleteAccount(id: $id)
      }
    `;

    const variables = { id: '1' };
    const response = await server.executeOperation({
      query: mutation,
      variables,
    });
    expect(response.data?.deleteAccount).toBe(true);
  });
});
