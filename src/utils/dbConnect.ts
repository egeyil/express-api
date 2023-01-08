import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    let db = process.env.DATABASE_URI || '';
    const conn = await mongoose.connect(db);
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



