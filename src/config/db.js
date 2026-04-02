import mongoose from "mongoose";
import { CONSTANTS } from "./constants.js";

export const connectDB = async () => {
  const isProduction = CONSTANTS.NODE_ENV === "production";

  try {
    const conn = await mongoose.connect(CONSTANTS.MONGO_URI, {
      dbName: CONSTANTS.DB_NAME,
      autoIndex: !isProduction, 
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });

    console.log(`MongoDB Connected on : ${conn.connection.host}:${conn.connection.port}`);
    mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected!'));
    mongoose.connection.on('reconnected', () => console.log('MongoDB reconnected!'));

  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1); 
  }
};
