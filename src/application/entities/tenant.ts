import mongoose, { type Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  blocks: number;
  status: 'active' | 'inactive';
  configuration: {
    currency: string;
    plan: 'basic' | 'medium' | 'premium';
    limits: {
      transactions: number;
      users: number;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>({
  name: { type: Schema.Types.String, required: true, unique: true },
  blocks: { type: Schema.Types.Number, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  configuration: {
    currency: { type: Schema.Types.String, required: true },
    plan: { type: Schema.Types.String, required: true },
    limits: {
      transactions: { type: Schema.Types.Number, default: 100 },
      users: { type: Schema.Types.Number, default: 10 },
    },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

tenantSchema.pre<ITenant>('save', function (next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model<ITenant>('Tenant', tenantSchema);
