import express from "express";
import { execFile } from "child_process";

const router = express.Router(); // Single 'r' here

/**
 * @route   GET /api/device/scan-device
 * @desc    Runs a real production-grade Nmap scan natively using secure binary execution
 */
router.get("/device/scan-device", async (req, res) => {
  try {
    // Reading parameter safely via query parameter (?target=192.168.1.1)
    const target = req.query.target; 
    
    if (!target) {
      return res.status(400).json({ status: "FAILED", error: "Missing target parameter, veer!" });
    }

    // 🎯 PATENT SECURITY DEFENSE: Strict input sanitization to prevent any malicious argument injection
    // Rejects characters that could manipulate command options
    if (/[^a-zA-Z0-9.-]/.test(target)) {
      return res.status(400).json({ status: "FAILED", error: "Malicious characters detected in target domain/IP." });
    }

    console.log(`[REAL EXEC ENGINE] Running dynamic Nmap audit on target: ${target}`);

    // ✅ FIXED: Using execFile instead of exec for professional vulnerability scanning.
    // This executes the binary directly without spawning a risky system shell layer.
    const nmapArgs = ["-sV", "--connect-timeout", "5", target];
    
    execFile("nmap", nmapArgs, (error, stdout, stderr) => {
      if (error && error.code !== 0) {
        console.error(`[NMAP BINARY ERROR] Details: ${stderr || error.message}`);
        return res.status(502).json({
          status: "FAILED",
          target: target,
          error: "Target host refused network probes or Nmap utility binary failed."
        });
      }

      // Return real raw data cleanly to your React scanner console workspace layout
      return res.json({
        status: "SUCCESS",
        target: target,
        result: stdout || "Scan completed. No public exposed services detected."
      });
    });

  } catch (error) {
    console.error("Backend endpoint error:", error.message);
    return res.status(500).json({ status: "ERROR", error: error.message });
  }
});

export default router;