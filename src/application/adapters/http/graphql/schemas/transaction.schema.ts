import { gql } from 'apollo-server-koa';

export const transactionTypeDefs = gql`
  type Transaction {
    id: ID!
    receiver: String!
    sender: String!
    amount: Float!
    type: String!
  }

  type Query {
    getTransactionsByAccountId(accountId: ID!): [Transaction]
  }

  type Mutation {
    createTransaction(
      receiver: String
      sender: String!
      amount: Float!
      type: String!
    ): Transaction
  }
`;
