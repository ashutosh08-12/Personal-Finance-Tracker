import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
// import xss from "xss-clean";

import authRoutes from "./routes/authRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
// app.use(xss());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/analytics", analyticsRoutes);

export default app;
