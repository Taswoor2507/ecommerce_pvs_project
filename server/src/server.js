import app from "./app.js";
import mongoose from "mongoose";
import { CONSTANTS } from "./config/constants.js";
import { connectDB } from "./config/db.js";

const PORT = CONSTANTS.PORT || 7070;
const startServer = async () => {
  try {
    //  Connect to MongoDB
    await connectDB();

    // Start Express server
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${CONSTANTS.NODE_ENV} mode`);
    });

    //  Graceful shutdown
    const shutdown = async () => {
      console.log(" Shutting down server...");
      server.close(async () => {
        console.log("HTTP server closed");
        try {
          await mongoose.connection.close();
          console.log("MongoDB connection closed");
          process.exit(0);
        } catch (err) {
          console.error("Error closing MongoDB connection:", err);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", shutdown);   
    process.on("SIGTERM", shutdown);  

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();