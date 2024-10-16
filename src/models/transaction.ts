import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  accountId: mongoose.Schema.Types.ObjectId;
  amount: number;
  type: 'credit' | 'debit';
  date: Date;
}

const transactionSchema = new Schema<ITransaction>({
  accountId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
