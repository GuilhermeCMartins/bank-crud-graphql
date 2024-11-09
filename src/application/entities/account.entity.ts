import TenantPlugin from '@common/plugins/tenant.plugin';
import mongoose, { type Document, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export enum Currency {
  USD = 'usd',
  BRL = 'brl',
}

export interface IAccount extends Document {
  number: string;
  holderName: string;
  balance: number;
  tenant: Schema.Types.ObjectId;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const accountSchema = new Schema<IAccount>({
  number: { type: String, required: true, unique: true, default: uuidv4 },
  holderName: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
  currency: { type: String, required: true, default: Currency.BRL },
  tenant: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const plugin = new TenantPlugin();

plugin.applyTenantMiddleware(accountSchema);

export default mongoose.model<IAccount>('Account', accountSchema);
