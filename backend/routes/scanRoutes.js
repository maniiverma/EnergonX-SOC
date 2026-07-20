import express from "express";
import { startScan } from "../controllers/scanController.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/scan/start
 * @desc    Initiates a multi-layered security scan on the target with middleware authentication
 * @access  Protected (Requires valid JWT/Auth Token)
 */
router.post("/start", auth, async (req, res, next) => {
  try {
    const { target } = req.body;

    // 1. Check if target parameter is present in payload body
    if (!target) {
      return res.status(400).json({ 
        status: "FAILED", 
        error: "Missing target parameter inside request payload body, veer!" 
      });
    }

    // 2. 🎯 PATENT SECURITY DEFENSE: Prevent Command/Argument Injection vectors at the router layer
    // Ensures target matches a strict IP address layout or domain name formatting
    const structuralTargetRegex = /^[a-zA-Z0-9][a-zA-Z0-9-._]{0,253}[a-zA-Z0-9]$/;
    if (!structuralTargetRegex.test(target)) {
      return res.status(400).json({
        status: "FAILED",
        error: "Security Check Triggered: Target contains malicious formatting or invalid sequences."
      });
    }

    console.log(`[ROUTE INITIATED] Auth verified. Passing clean target stream to controller logic: ${target}`);

    // 3. Hand over execution safely to the scanning controller architecture engine logic
    return startScan(req, res, next);

  } catch (error) {
    console.error("Critical scan setup router breakdown exception:", error.message);
    return res.status(500).json({ 
      status: "ERROR", 
      error: "Ecosystem engine routing failed to pass parameters cleanly down." 
    });
  }
});

export default router;