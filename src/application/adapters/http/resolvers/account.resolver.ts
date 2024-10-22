import { IAccount } from '../../../entities/account';
import Account from '../../../entities/account';
import { GraphQLResolveInfo } from 'graphql';

export class AccountResolver {
  async getAccounts(
    _: any,
    __: any,
    info: GraphQLResolveInfo
  ): Promise<IAccount[]> {
    return await Account.find();
  }

  async getAccountById(
    _: any,
    { id }: { id: string },
    info: GraphQLResolveInfo
  ): Promise<IAccount | null> {
    return await Account.findById(id);
  }

  async createAccount(
    _: any,
    { accountInput }: { accountInput: IAccount }
  ): Promise<IAccount> {
    const account = new Account(accountInput);
    return await account.save();
  }

  async deleteAccount(_: any, { id }: { id: string }): Promise<boolean> {
    const result = await Account.findByIdAndDelete(id);
    return result !== null;
  }
}
