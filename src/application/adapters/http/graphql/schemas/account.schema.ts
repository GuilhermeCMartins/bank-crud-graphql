import { gql } from 'apollo-server-koa';

export const accountTypeDefs = gql`
  type Account {
    id: ID!
    number: String!
    holderName: String!
    balance: Float!
  }

  type Query {
    getAccounts: [Account]
    getAccountById(id: ID!): Account
  }

  type Mutation {
    createAccount(
      number: String!
      holderName: String!
      balance: Float!
    ): Account
    deleteAccount(id: ID!): Boolean
  }
`;
