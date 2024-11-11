import TenantPlugin from '@common/plugins/tenant.plugin';
import mongoose, { type Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

export enum Currency {
  USD = 'usd',
  BRL = 'brl',
}

export interface IAccount extends Document {
  number: string;
  holderName: string;
  balance: number;
  tenant: Schema.Types.ObjectId;
  email: string;
  password: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>({
  number: { type: String, required: true, unique: true, default: uuidv4 },
  holderName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, default: Currency.BRL },
  tenant: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

accountSchema.pre('save', async function (next) {
  const account = this as IAccount;

  if (!account.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    account.password = await bcrypt.hash(account.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

const plugin = new TenantPlugin();

plugin.applyTenantMiddleware(accountSchema);

export default mongoose.model<IAccount>('Account', accountSchema);
