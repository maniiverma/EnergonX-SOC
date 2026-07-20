import express from "express";
import { exec } from "child_process";

const router = express.Router();

// backend/routes/networkMonitor.js update karo
router.get("/monitor", (req, res) => {
  // '-a' flag use karo taaki loopback te saare interfaces monitor hon
  exec("sudo nethogs -t -c 3 -a", (err, stdout) => {
    if (err) {
      console.error("Monitor error:", err);
      return res.status(500).json({ error: "No active network interface found." });
    }
    res.json({ success: true, data: stdout });
  });
});

export default router;
