import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

const connectDB = async () => {
  try {
    // const db = config.get<string>("DATABASE_URI);
    if (process.env.NODE_ENV === 'test') {
      const mongodb = new MongoMemoryServer();
      const uri = mongodb.getUri();
      await mongoose.connect(uri);
      return;
    } else {
      const db = process.env.DATABASE_URI || '';
      await mongoose.connect(db);
    }

  } catch (err) {
    console.error(err);
  }
}

export default connectDB;



