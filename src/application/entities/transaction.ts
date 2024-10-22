import mongoose, { type Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  accountId: mongoose.Schema.Types.ObjectId;
  amount: number;
  type: 'credit' | 'debit' | 'pix';
  date: Date;
  tenantId: number;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  tenantId: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
