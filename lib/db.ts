import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://rashidansari3868038:5jSGP7Vpg8TpMC8B@cluster0.gamfora.mongodb.net/second-brain";

const connectDB = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    if (!MONGODB_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }
    const connection = await mongoose.connect(MONGODB_URI);
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
