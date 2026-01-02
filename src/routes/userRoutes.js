import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import { auth } from "../middleware/auth.js";
import { role } from "../middleware/role.js";

const router = express.Router();

router.get("/", auth, role("admin"), getAllUsers);

export default router;
