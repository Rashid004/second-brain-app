import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    const connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`MongoDB connection error: ${error.message}`);
      throw error;
    } else {
      console.error(`Unexpected MongoDB error: ${error}`);
      throw new Error("Database connection failed");
    }
  }
};

export default connectDB;
