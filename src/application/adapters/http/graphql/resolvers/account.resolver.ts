import type { IAccount } from '@application/entities/account.entity';
import { AccountService } from '@application/services/account.service';

class AccountResolver {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  async getAccounts(): Promise<IAccount[] | null> {
    return await this.accountService.getAccounts();
  }

  async getAccountById(
    _: unknown,
    { id }: { id: string }
  ): Promise<IAccount | null> {
    return await this.accountService.getAccountById(id);
  }

  async createAccount(
    _: unknown,
    {
      holderName,
      balance,
    }: { number: string; holderName: string; balance: number }
  ): Promise<IAccount> {
    const acc: Partial<IAccount> = {
      holderName,
      balance,
    };

    return await this.accountService.createAccount(acc);
  }

  async deleteAccount(_: unknown, { id }: { id: string }): Promise<boolean> {
    return await this.accountService.deleteAccount(id);
  }
}

const accountResolverInstance = new AccountResolver();

export const accountResolvers = {
  Query: {
    getAccounts: accountResolverInstance.getAccounts.bind(
      accountResolverInstance
    ),
    getAccountById: accountResolverInstance.getAccountById.bind(
      accountResolverInstance
    ),
  },
  Mutation: {
    createAccount: accountResolverInstance.createAccount.bind(
      accountResolverInstance
    ),
    deleteAccount: accountResolverInstance.deleteAccount.bind(
      accountResolverInstance
    ),
  },
};
