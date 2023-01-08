import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';

let mongod: any = null;

const connectDB = async () => {
  try {
    // const db = config.get<string>("DATABASE_URI);
    let db = process.env.DATABASE_URI || '';
    // if (process.env.NODE_ENV === 'test') {
    //   mongod = await MongoMemoryServer.create();
    //   db = mongod.getUri();
    // }
    const conn = await mongoose.connect(db);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    // if (process.env.NODE_ENV === 'test' && mongod) {
    //   await mongod.stop();
    // }
  } catch (e) {
    console.log(e)
    process.exit(1);
  }
};

export default connectDB;



