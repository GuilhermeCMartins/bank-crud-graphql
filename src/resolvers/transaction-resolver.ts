import { ITransaction } from "../models/transaction";
import Transaction from "../models/transaction";
import Account from "../models/account";

export const transactionResolver = {
  Query: {
    getTransactionsByAccountId: async (
      _: any,
      { accountId }: { accountId: string },
    ): Promise<ITransaction[]> => {
      return await Transaction.find({ accountId });
    },
  },
  Mutation: {
    createTransaction: async (
      _: any,
      { accountId, amount, type }: ITransaction,
    ): Promise<ITransaction> => {
      const account = await Account.findById(accountId);
      if (!account) throw new Error("Account not found");
      if (type === "debit" && account.balance < amount)
        throw new Error("Insufficient balance");

      const transaction = new Transaction({ accountId, amount, type });
      await transaction.save();

      account.balance += type === "credit" ? amount : -amount;
      await account.save();

      return transaction;
    },
  },
};
