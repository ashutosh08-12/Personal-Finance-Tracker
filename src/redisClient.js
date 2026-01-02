import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redis = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,              
    rejectUnauthorized: false 
  }
});

redis.on("connect", () => {
  console.log("Redis connected to Upstash");
});

redis.on("error", (err) => {
  console.error(" Redis Error:", err);
});

await redis.connect();

export default redis;
