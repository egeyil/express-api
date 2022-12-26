import mongoose from 'mongoose';
import config from "config";

const connectDB = async () => {
  try {
    const db = config.get<string>("dbUri");
    await mongoose.connect(db);
  } catch (err) {
    console.error(err);
  }
}

export default connectDB;



