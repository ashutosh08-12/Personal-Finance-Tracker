import express from "express";
import {
  addTransaction,
  deleteTransaction,
  getTransactions,
  updateTransaction,
} from "../controllers/transactionController.js";

import { auth } from "../middleware/auth.js";
import { role } from "../middleware/role.js";
import { transactionLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get("/", auth, getTransactions);

router.post("/", auth, role("admin", "user"), transactionLimiter, addTransaction);

router.put("/:id", auth, role("admin", "user"), updateTransaction);

router.delete("/:id", auth, role("admin", "user"), deleteTransaction);

export default router;
