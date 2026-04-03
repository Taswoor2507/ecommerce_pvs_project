import app from "./app.js";
import { mongoose as mongodb } from "mongoose";
import { CONSTANTS } from "./config/constants.js";
import { connectDB } from "./config/db.js";
import redis from "./config/redis.js";

const PORT = CONSTANTS.PORT || 5000;

async function startServer() {
  // Connect to MongoDB first — fail fast if it's down
  await connectDB();

  // Ping Redis to verify connection (non-fatal — see redis.js for graceful degradation)
  try {
    if (redis) {
      await redis.ping();
      console.log(':white_check_mark: Redis connected');
    } else {
      console.warn(':warning: Redis is disabled');
    }
  } catch (err) {
    console.warn(':warning:  Redis unavailable — caching and locking disabled:', err.message);
  }

  const server = app.listen(PORT, () => {
    console.log(`:rocket: Server running on http://localhost:${PORT} [${process.env.NODE_ENV}]`);
  });

  // Graceful shutdown: close HTTP server then DB/Redis connections
  const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received — shutting down gracefully…`);

    server.close(async () => {
      const mongoose = mongodb;

      try {
        await mongoose.connection.close();
        console.log(':white_check_mark: MongoDB disconnected!');
      } catch (err) {
        console.error(':x: Error closing MongoDB:', err.message);
      }

      try {
        if (redis) {
          await redis.quit();
          console.log(':white_check_mark: Redis disconnected!');
        }
      } catch (err) {
        console.error(':x: Error closing Redis:', err.message);
      }

      console.log(':white_check_mark: Connections closed. Goodbye.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error(':x: Failed to start server:', err);
  process.exit(1);
});