import express from "express";
import { auth } from "../middleware/auth.js";
import {
  getSummary,
  getMonthlyAnalytics,
  getYearlyAnalytics,
  getCategoryAnalytics
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/summary", auth, getSummary);
router.get("/monthly", auth, getMonthlyAnalytics);
router.get("/yearly", auth, getYearlyAnalytics);
router.get("/category", auth, getCategoryAnalytics);

export default router;
