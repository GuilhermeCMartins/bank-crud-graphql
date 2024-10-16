import { IAccount } from "../models/account";
import Account from "../models/account";

export const accountResolver = {
  Query: {
    getAccounts: async (): Promise<IAccount[]> => await Account.find(),
    getAccountById: async (
      _: any,
      { id }: { id: string },
    ): Promise<IAccount | null> => await Account.findById(id),
  },
  Mutation: {
    createAccount: async (
      _: any,
      { accountNumber, accountHolderName, balance }: IAccount,
    ): Promise<IAccount> => {
      const account = new Account({
        accountNumber,
        accountHolderName,
        balance,
      });
      return await account.save();
    },
    deleteAccount: async (_: any, { id }: { id: string }): Promise<boolean> => {
      await Account.findByIdAndDelete(id);
      return true;
    },
  },
};
