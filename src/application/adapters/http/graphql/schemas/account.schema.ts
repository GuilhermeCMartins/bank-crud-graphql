import { gql } from 'apollo-server-koa';

export const accountTypeDefs = gql`
  type Account {
    id: ID!
    number: String!
    holderName: String!
    balance: Float!
    email: String!
    currency: String!
  }

  type AuthToken {
    token: String!
  }

  type Query {
    getAccounts: [Account]
    getAccountById(id: ID!): Account
  }

  type Mutation {
    createAccount(
      email: String!
      holderName: String!
      password: String!
      currency: String!
    ): Account
    deleteAccount(id: ID!): Boolean
    login(email: String!, password: String!): AuthToken
  }
`;
