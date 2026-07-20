import express from "express";
import { exec } from "child_process";

const router = express.Router();

router.get("/scan", (req, res) => {
  // Root privilege needed for MAC and Vendor detection
  exec("sudo nmap -sn 192.168.100.0/24", (err, stdout) => {
    if (err) return res.status(500).json({ error: "Scan failed" });
    
    const devices = [];
    const lines = stdout.split("\n");
    let currentDevice = {};

    lines.forEach(line => {
      if (line.includes("Nmap scan report for")) {
        currentDevice = { ip: line.split(" ").pop().replace(/[()]/g, ""), mac: "Unknown", vendor: "Unknown" };
      }
      if (line.includes("MAC Address:")) {
        const parts = line.split("MAC Address: ")[1].split(" ");
        currentDevice.mac = parts[0];
        currentDevice.vendor = parts.slice(1).join(" ").replace(/[()]/g, "");
        devices.push(currentDevice);
      }
    });
    res.json(devices);
  });
});

export default router;
