import account, { type IAccount } from '@application/entities/account.entity';
import type mongoose from 'mongoose';

export class AccountService {
  async getAccounts(): Promise<IAccount[] | null> {
    return await account.find();
  }

  async findByIdAndUpdate(
    accountId: string,
    updateData: object,
    session: mongoose.ClientSession
  ): Promise<null> {
    const acc = await account.updateOne({ number: accountId }, updateData, {
      new: true,
      runValidators: true,
      session,
    });

    if (!acc) {
      throw new Error('Account not found');
    }

    return null;
  }

  async getAccountById(id: string): Promise<IAccount | null> {
    return await account.findOne({ number: id });
  }

  async createAccount(accountInput: Partial<IAccount>): Promise<IAccount> {
    const acc = new account(accountInput);
    return await acc.save();
  }

  async deleteAccount(id: string): Promise<boolean> {
    const result = await account.findByIdAndDelete(id);
    return result !== null;
  }
}
