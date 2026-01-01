import express from "express";
import { addTransaction, getTransactions } from "../controllers/transactionController.js";
import { auth } from "../middleware/auth.js";
import { role } from "../middleware/role.js";
import { transactionLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get("/", auth, getTransactions);
router.post("/", auth, role("admin", "user"), transactionLimiter, addTransaction);

export default router;
