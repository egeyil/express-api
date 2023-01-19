import mongoose from 'mongoose';
import config from '../config/config';

const connectDB = async () => {
  try {
    const {databaseUrl} = config;
    if (!databaseUrl) {
      console.error('No database url found');
      process.exit(1);
    }
    const conn = await mongoose.connect(databaseUrl);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(err);
  }
}

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
  } catch (e) {
    console.log(e)
    process.exit(1);
  }
};

export default connectDB;



