import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

export const redis = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  }
});

redis.on("connect", () => console.log("Redis connected"));
redis.connect();
