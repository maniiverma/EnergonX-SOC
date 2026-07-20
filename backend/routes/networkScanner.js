import express from "express";
import { execFile } from "child_process";
import os from "os";

const router = express.Router();

/**
 * Dynamic Interface Target Picker
 * Automatically isolates active networking cards to pass inside system utilities
 */
function getActiveInterface() {
  const interfaces = os.networkInterfaces();
  let detected = Object.keys(interfaces).find(name => name.startsWith('wlan'));
  if (!detected) detected = Object.keys(interfaces).find(name => name.startsWith('eth') || name.startsWith('en'));
  return detected || null;
}

/**
 * @route   GET /api/network/arp-scan
 * @desc    Runs hardware-level local subnet mapping using secure direct binary tracing
 */
router.get("/scan", async (req, res) => {
  try {
    const targetInterface = getActiveInterface();
    
    if (!targetInterface) {
      return res.status(502).json({
        success: false,
        error: "Active hardware interface (wlan/eth) could not be mapped dynamically."
      });
    }

    console.log(`[REAL EXEC ENGINE] Deploying ARP Subnet Sweep over interface: ${targetInterface}`);

    // 🎯 PATENT SECURITY DEFENSE:
    // Replaced loose shell 'exec' with structural 'execFile' matrix.
    // NOTE: For this binary to execute smoothly inside Node runtime environments,
    // the host environment must have: 'sudo chmod +s /usr/sbin/arp-scan' configured.
    const binaryPath = "arp-scan";
    const scanArgs = ["--interface", targetInterface, "--localnet"];

    execFile(binaryPath, scanArgs, (error, stdout, stderr) => {
      if (error && error.code !== 0) {
        console.error(`[ARP-SCAN BINARY ERROR] Status breakdown: ${stderr || error.message}`);
        return res.status(502).json({
          success: false,
          error: "ARP utility failed or runtime privileges are insufficient."
        });
      }

      const devices = [];
      const lines = stdout.split("\n");

      // Regular Expression targeted to parse IPv4 patterns, hardware MAC blocks, and hardware vendor names cleanly
      const arpRegex = /^([0-9.]+)\s+([0-9a-fA-F:]+)\s+(.*)$/;

      lines.forEach((line) => {
        const match = line.trim().match(arpRegex);
        if (match) {
          devices.push({
            ip: match[1],
            mac: match[2].toLowerCase(),
            vendor: match[3] || "Unknown Infrastructure Vendor"
          });
        }
      });

      // Pure asynchronous response payload mapped straight to EnergonX ecosystem
      return res.json({
        success: true,
        interfaceUsed: targetInterface,
        scanTimestamp: new Date().toISOString(),
        devices: devices
      });
    });

  } catch (err) {
    console.error("Critical Scanner Engine Exception:", err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;