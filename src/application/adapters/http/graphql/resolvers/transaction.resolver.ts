import type {
  ITransaction,
  ITransactionPayload,
} from '@application/entities/transaction.entity';
import { TransactionService } from '@application/services/transaction.service';

class TransactionResolver {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  async getTransactionsByAccountId(id: string): Promise<ITransaction[] | null> {
    return await this.transactionService.getTransactionsByAccountId(id);
  }

  async createTransaction(
    _: unknown,
    transaction: ITransactionPayload
  ): Promise<ITransaction> {
    return await this.transactionService.createTransaction(transaction);
  }
}

const transactionResolverInstance = new TransactionResolver();

export const transactionResolvers = {
  Query: {
    getTransactionsByAccountId:
      transactionResolverInstance.getTransactionsByAccountId.bind(
        transactionResolverInstance
      ),
  },
  Mutation: {
    createTransaction: transactionResolverInstance.createTransaction.bind(
      transactionResolverInstance
    ),
  },
};
