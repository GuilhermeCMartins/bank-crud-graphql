import tenant from '@application/entities/tenant.entity';
import MongoDbConnection from './db.connection';

export const seedTenants = async () => {
  const dbConnection = new MongoDbConnection();

  const tenantsArray = [
    {
      name: 'tenant',
      blocks: 5,
      status: 'active',
    },
    {
      name: 'tenant2',
      blocks: 10,
      status: 'active',
    },
    {
      name: 'tenant3',
      blocks: 8,
      status: 'inactive',
    },
  ];

  try {
    await dbConnection.connect();

    const tenants = await tenant.find();
    if (tenants.length > 0) return;

    await tenant.insertMany(tenantsArray);
    console.log('Tenants seeded successfully');
  } catch (error) {
    console.error('Error seeding tenants:', error);
  } finally {
    await dbConnection.disconnect();
  }
};
