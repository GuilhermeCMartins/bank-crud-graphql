import mongoose from 'mongoose';
import transaction, {
  type ITransactionPayload,
  type ITransaction,
} from '@application/entities/transaction.entity';
import { AccountService } from './account.service';
import { InsufficientBalance } from '@common/errors/insufficient-balance';
import { BadRequest } from '@common/errors/bad-request';
import { NotFound } from '@common/errors/not-found';

export class TransactionService {
  protected accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  async getTransactionsByAccountId(id: string): Promise<ITransaction[]> {
    return await transaction.find({
      $or: [{ sender: id }, { receiver: id }],
    });
  }

  async createTransaction(
    transactionInput: ITransactionPayload
  ): Promise<ITransaction> {
    const session = await mongoose.startSession();
    session.startTransaction();

    const transactionHandlers = {
      transfer: this.createTransfer.bind(this),
      deposit: this.createDeposit.bind(this),
      withdraw: this.createWithdraw.bind(this),
    };

    try {
      const { type } = transactionInput;
      const handler = transactionHandlers[type];

      if (!handler) {
        throw new BadRequest('Unsupported transaction type');
      }

      const result = await handler(transactionInput, session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private async createTransfer(
    transactionInput: ITransactionPayload,
    session: mongoose.ClientSession
  ): Promise<ITransaction> {
    const { sender, receiver, amount } = transactionInput;

    await this.validateAccountsExist(sender, receiver, 'transfer');
    await this.validateSufficientBalance(sender, amount);

    await this.accountService.findByIdAndUpdate(
      sender,
      {
        $inc: { balance: -amount },
      },
      session
    );
    await this.accountService.findByIdAndUpdate(
      receiver,
      {
        $inc: { balance: amount },
      },
      session
    );

    return await this.saveTransaction(transactionInput, session);
  }

  private async createDeposit(
    transactionInput: ITransactionPayload,
    session: mongoose.ClientSession
  ): Promise<ITransaction> {
    const { receiver, amount } = transactionInput;

    await this.validateAccountsExist(null, receiver, 'deposit');
    await this.accountService.findByIdAndUpdate(
      receiver,
      {
        $inc: { balance: amount },
      },
      session
    );

    return await this.saveTransaction(transactionInput, session);
  }

  private async createWithdraw(
    transactionInput: ITransactionPayload,
    session: mongoose.ClientSession
  ): Promise<ITransaction> {
    const { sender, amount } = transactionInput;

    await this.validateAccountsExist(sender, null, 'withdraw');
    await this.validateSufficientBalance(sender, amount);

    await this.accountService.findByIdAndUpdate(
      sender,
      {
        $inc: { balance: -amount },
      },
      session
    );

    return await this.saveTransaction(transactionInput, session);
  }

  private async saveTransaction(
    transactionInput: ITransactionPayload,
    session: mongoose.ClientSession
  ): Promise<ITransaction> {
    const ts = new transaction(transactionInput);

    return await ts.save({ session });
  }

  private async validateAccountsExist(
    senderId: string | null,
    receiverId: string | null,
    type: string
  ): Promise<void> {
    const accountChecks = {
      sender: senderId && type !== 'deposit',
      receiver: receiverId && type === 'transfer',
    };

    const [senderAccount, receiverAccount] = await Promise.all([
      accountChecks.sender
        ? this.accountService.getAccountById(senderId as string)
        : null,
      accountChecks.receiver
        ? this.accountService.getAccountById(receiverId as string)
        : null,
    ]);

    if (accountChecks.sender && !senderAccount) {
      throw new NotFound('Sender account not found');
    }
    if (accountChecks.receiver && !receiverAccount) {
      throw new NotFound('Receiver account not found');
    }
  }

  private async validateSufficientBalance(
    senderId: string,
    amount: number
  ): Promise<void> {
    const senderAccount = await this.accountService.getAccountById(senderId);

    if (!senderAccount || senderAccount.balance < amount) {
      throw new InsufficientBalance('Insufficient balance in sender account');
    }
  }
}
