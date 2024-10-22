import mongoose from 'mongoose';

class MongoDbConnection {
  private mongoUri: string;

  constructor(mongoUri: string) {
    this.mongoUri = mongoUri;
  }

  // @TODO: Add other configs and put on .env file
  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.mongoUri, {
        dbName: 'bank',
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Error connecting to MongoDB');
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw new Error('Error disconnecting from MongoDB');
    }
  }
}

export default MongoDbConnection;
