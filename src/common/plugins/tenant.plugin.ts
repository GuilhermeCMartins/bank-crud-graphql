import type { Schema } from 'mongoose';

class TenantPlugin {
  private static tenantId: string;

  public static setTenant(id: string) {
    TenantPlugin.tenantId = id;
  }

  public static getTenant(): string {
    return TenantPlugin.tenantId;
  }

  public applyTenantMiddleware(schema: Schema): void {
    schema.pre('find', function () {
      const tenantId = TenantPlugin.getTenant();
      this.where('tenant').equals(tenantId);
    });

    schema.pre('findOne', function () {
      const tenantId = TenantPlugin.getTenant();
      this.where('tenant').equals(tenantId);
    });

    schema.pre('updateMany', function () {
      const tenantId = TenantPlugin.getTenant();
      this.setQuery({ tenant: tenantId, ...this.getQuery() });
    });

    schema.pre('deleteOne', function () {
      const tenantId = TenantPlugin.getTenant();
      this.setQuery({ tenant: tenantId, ...this.getQuery() });
    });

    schema.pre('deleteMany', function () {
      const tenantId = TenantPlugin.getTenant();
      this.setQuery({ tenant: tenantId, ...this.getQuery() });
    });

    schema.pre('updateOne', function () {
      const tenantId = TenantPlugin.getTenant();
      this.setQuery({ tenant: tenantId, ...this.getQuery() });
    });

    schema.pre('save', function (next) {
      const tenantId = TenantPlugin.getTenant();
      if (!this.tenant) {
        this.tenant = tenantId;
      }
      next();
    });
  }
}

export default TenantPlugin;
