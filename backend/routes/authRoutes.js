import express from "express";
import { login } from "../controllers/authController.js";

const router = express.Router();

// User login endpoint
router.post("/login", login);

export default router;
