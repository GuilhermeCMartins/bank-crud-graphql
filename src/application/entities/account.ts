import mongoose, { type Document, Schema } from 'mongoose';

export interface IAccount extends Document {
  accountNumber: string;
  accountHolderName: string;
  balance: number;
  tenantId: number;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>({
  accountNumber: { type: String, required: true, unique: true },
  accountHolderName: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  tenantId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IAccount>('Account', accountSchema);
