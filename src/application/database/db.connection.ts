import mongoose from 'mongoose';

class MongoDbConnection {
  private mongoUri: string;
  private connection: mongoose.Mongoose | null;

  constructor() {
    this.mongoUri = process.env.MONGODB_URI as string;
    this.connection = null;
  }

  public async connect(): Promise<void> {
    try {
      this.connection = await mongoose.connect(this.mongoUri, {
        dbName: 'bank',
      });

      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw new Error('Error connecting to MongoDB');
    }
  }

  public getConnection(): mongoose.Mongoose {
    if (!this.connection) {
      throw new Error('MongoDB connection is not established');
    }
    return this.connection;
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
