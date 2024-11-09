import mongoose, { type Document, Schema } from 'mongoose';

export enum TenantStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export interface ITenant extends Document {
  name: string;
  blocks: number;
  status: TenantStatus;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>({
  name: { type: Schema.Types.String, required: true, unique: true },
  blocks: { type: Schema.Types.Number, required: true },
  status: { type: String, enum: TenantStatus, default: TenantStatus.ACTIVE },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model<ITenant>('Tenant', tenantSchema);
