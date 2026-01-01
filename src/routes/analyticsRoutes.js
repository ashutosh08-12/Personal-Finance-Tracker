import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { auth } from "../middleware/auth.js";
import { analyticsLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get("/", auth, analyticsLimiter, getAnalytics);

export default router;
