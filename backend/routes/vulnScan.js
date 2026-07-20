import express from "express";
import { execFile } from "child_process";

const router = express.Router();

/**
 * @route   GET /api/device/scan-device
 * @desc    Natively executes structural Nmap binary probes using isolated argument arrays
 */
router.get("/scan-device", async (req, res) => {
  try {
    // Frontend query framework (?target=192.168.1.1) naal sync kita hai
    const target = req.query.target;

    if (!target) {
      return res.status(400).json({ 
        status: "FAILED", 
        error: "Missing target verification parameter, veer!" 
      });
    }

    // 🎯 PATENT SECURITY DEFENSE: Regular expression check to drop malicious shell characters
    const targetRegex = /^[a-zA-Z0-9][a-zA-Z0-9-._]{0,253}[a-zA-Z0-9]$/;
    if (!targetRegex.test(target)) {
      return res.status(400).json({ 
        status: "FAILED", 
        error: "Security Check Triggered: Malicious or illegal target sequence formatting." 
      });
    }

    console.log(`[CORE ENGINE] Initiating live binary port scan audit for: ${target}`);

    // ✅ FIXED: Using structured array parameter matrices via execFile.
    // Shell execution structures process natively without risking underlying injection vulnerabilities.
    const binaryUtility = "nmap";
    const structuredArgs = ["-sV", "--connect-timeout", "5", target];

    execFile(binaryUtility, structuredArgs, (error, stdout, stderr) => {
      if (error && error.code !== 0) {
        console.error(`[NMAP ERROR ENGINE]: ${stderr || error.message}`);
        return res.status(502).json({
          status: "FAILED",
          target: target,
          error: "Ecosystem probe tracking failed or target host completely unreachable."
        });
      }

      // Sends real terminal dump strings back to the React logger terminal hook window
      return res.json({
        status: "SUCCESS",
        target: target,
        result: stdout || "Scan completed successfully. No vulnerabilities or ports exposed."
      });
    });

  } catch (err) {
    console.error("Vulnerability Probe Failure:", err.message);
    return res.status(500).json({ status: "ERROR", error: err.message });
  }
});

export default router;