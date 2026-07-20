import express from "express";
import { exec } from "child_process";

const router = express.Router();

router.get("/scan", (req, res) => {
  const target = req.query.url;

  if (!target) {
    return res.status(400).json({ error: "URL target is required" });
  }

  // Nikto scan for web vulnerabilities
  exec(`nikto -h ${target}`, (err, stdout) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ result: stdout });
  });
});

export default router;
