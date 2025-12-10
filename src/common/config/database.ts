import mongoose from "mongoose";
import { config } from ".";

const MONGO_URI = config.MONGO_URI as string;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      autoIndex: true,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1); // Stop app if DB fails
  }
};
