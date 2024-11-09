import TenantPlugin from '@common/plugins/tenant.plugin';
import mongoose, { type Document, Schema } from 'mongoose';

export enum TransactionType {
  TRASFER = 'transfer',
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface ITransaction extends Document {
  sender: string;
  receiver: string;
  amount: number;
  type: TransactionType;
  tenant: Schema.Types.ObjectId;
  description?: string;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransactionPayload {
  receiver: string;
  sender: string;
  amount: number;
  type: TransactionType;
}

const transactionSchema = new Schema<ITransaction>({
  sender: { type: String, ref: 'Account', required: true },
  receiver: { type: String, ref: 'Account', required: false },
  description: { type: String, required: false },
  amount: { type: Number, required: true },
  type: { type: String, enum: TransactionType, required: true },
  status: { type: String, enum: TransactionStatus, required: false },
  tenant: { type: Schema.Types.ObjectId, ref: 'Tenant', required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const plugin = new TenantPlugin();

plugin.applyTenantMiddleware(transactionSchema);

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
