import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
// import dotenv from "dotenv";
// dotenv.config();

import { db } from "./database.js";
import { redis } from "./redisClient.js";

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
