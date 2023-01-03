import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // const db = config.get<string>("DATABASE_URI);
    const db = process.env.DATABASE_URI || '';
    await mongoose.connect(db);
  } catch (err) {
    console.error(err);
  }
}

export default connectDB;



