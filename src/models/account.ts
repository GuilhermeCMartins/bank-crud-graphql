import mongoose, { Document, Schema } from "mongoose";

export interface IAccount extends Document {
  accountNumber: string;
  accountHolderName: string;
  balance: number;
}

const accountSchema = new Schema<IAccount>({
  accountNumber: { type: String, required: true, unique: true },
  accountHolderName: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
});

export default mongoose.model<IAccount>("Account", accountSchema);
