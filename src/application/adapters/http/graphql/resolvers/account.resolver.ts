import type { Currency, IAccount } from '@application/entities/account.entity';
import { AccountService } from '@application/services/account.service';
import { BadRequest } from '@common/errors/bad-request';
import { NotFound } from '@common/errors/not-found';
import { JWTSigner } from '@common/signer';
import { AuthTokenService } from '@common/signer/token';

class AccountResolver {
  private accountService: AccountService;
  private authTokenService: AuthTokenService;
  private jwtSigner: JWTSigner;

  constructor() {
    this.accountService = new AccountService();
    this.jwtSigner = new JWTSigner();
    this.authTokenService = new AuthTokenService(this.jwtSigner);
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
      email,
      holderName,
      password,
      currency,
    }: {
      email: string;
      holderName: string;
      password: string;
      currency: Currency;
    }
  ): Promise<IAccount> {
    const acc: Partial<IAccount> = { email, holderName, password, currency };
    return await this.accountService.createAccount(acc);
  }

  async deleteAccount(_: unknown, { id }: { id: string }): Promise<boolean> {
    return await this.accountService.deleteAccount(id);
  }

  async login(
    _: unknown,
    { email, password }: { email: string; password: string }
  ): Promise<{ token: string; holderName: string; balance: number } | null> {
    const account = await this.accountService.getAccountByEmail(email);
    if (!account) {
      throw new NotFound('Account not found');
    }

    const isPasswordValid = await this.accountService.validatePassword(
      account,
      password
    );
    if (!isPasswordValid) {
      throw new BadRequest('Invalid password');
    }

    const tokenPayload = {
      userId: account.id,
      tenantId: account.tenant.toString(),
      email: account.email,
    };

    const token = this.authTokenService.generateToken(tokenPayload);

    return { holderName: account.holderName, balance: account.balance, token };
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
    login: accountResolverInstance.login.bind(accountResolverInstance),
  },
};
