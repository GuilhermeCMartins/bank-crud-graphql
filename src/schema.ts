import { gql } from "apollo-server-koa";

export const typeDefs = gql`
  type Account {
    id: ID!
    accountNumber: String!
    accountHolderName: String!
    balance: Float!
  }

  type Transaction {
    id: ID!
    accountId: ID!
    amount: Float!
    type: String!
    date: String!
  }

  type Query {
    getAccounts: [Account]
    getAccountById(id: ID!): Account
    getTransactionsByAccountId(accountId: ID!): [Transaction]
  }

  type Mutation {
    createAccount(
      accountNumber: String!
      accountHolderName: String!
      balance: Float!
    ): Account
    deleteAccount(id: ID!): Boolean

    createTransaction(
      accountId: ID!
      amount: Float!
      type: String!
    ): Transaction
  }
`;
