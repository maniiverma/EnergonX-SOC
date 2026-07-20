import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

// ================= CONTROLLERS =================
import { startArpMonitoring } from "./controllers/arpController.js";

// ================= ROUTES =================
import setupBountyRoutes from "./routes/bountyRoutes.js";
import vulnerabilityRoutes from "./routes/vulnerabilityRoutes.js";
import networkScanner from "./routes/networkScanner.js";
import deviceScan from "./routes/deviceScan.js";
import networkMonitor from "./routes/networkMonitor.js";
import websiteScanner from "./routes/websiteScanner.js";
import ipLookup from "./routes/ipLookup.js";
import deviceName from "./routes/deviceName.js";
import bandwidth from "./routes/bandwidth.js";
import attackMonitor from "./routes/attackMonitor.js";
import threatFeed from "./routes/threatFeed.js";
import deviceDetails from "./routes/deviceDetails.js";
import deviceIntel from "./routes/deviceIntelligence.js";
import advancedIntel from "./routes/advancedIntel.js";
import networkDevices from "./routes/networkDevices.js";
import arpGuardRoutes from "./routes/arpGuardRoutes.js";

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ================= HTTP SERVER =================
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ================= SYSTEM STARTUP =================
if (process.env.NODE_ENV !== "test") {
  console.log("\n[SYSTEM] Booting EnergonX Core Engine Interfaces...");
  startArpMonitoring(io);
}

// ================= API ROUTES =================

// 🛡️ Offensive Security
app.use("/api/vulnerability", vulnerabilityRoutes);
app.use("/api/device", deviceScan);
app.use("/api/website", websiteScanner);

// 🎯 Bounty Module (Socket.IO injected)
// NOTE: setupBountyRoutes(io) is called ONCE and reused — calling it twice
// (as the original file did) creates duplicate routers and double-registers
// any socket listeners inside it, which can cause duplicated events/emails/etc.
app.use("/api/bounty", setupBountyRoutes(io));

// 📡 Recon & Discovery
app.use("/api/network-scan", networkScanner);
app.use("/api/network-devices", networkDevices);
app.use("/api/device-name", deviceName);
app.use("/api/device-details", deviceDetails);

// 📊 Monitoring & Traffic
app.use("/api/network", networkMonitor);
app.use("/api/bandwidth", bandwidth);
app.use("/api/attack", attackMonitor);

// 🧠 Intelligence & SOC
app.use("/api/ip", ipLookup);
app.use("/api/device-intel", deviceIntel);
app.use("/api/adv", advancedIntel);
app.use("/api/threat-feed", threatFeed);
app.use("/api", arpGuardRoutes);

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => res.json({ status: "ONLINE" }));

app.get("/", (req, res) => {
  res.status(200).json({
    status: "Online",
    system: "EnergonX Advanced SOC Core",
    version: "2.5.0",
    active_engines: ["Nmap", "Nuclei", "VirusTotal", "Shodan"],
  });
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Security Endpoint Not Found",
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("[CRITICAL ERROR]", err.stack || err.message);
  res.status(500).json({
    success: false,
    error: "Internal Intelligence Engine Error",
  });
});

// ================= SERVER BOOT =================
const PORT = process.env.PORT || 5001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`
    ==================================================
🚀 ENERGON-X ADVANCED SOC BACKEND IS LIVE
📡 PORT: ${PORT}
🌐 URL: http://localhost:${PORT}
🛠️ ENGINES: NMAP | NUCLEI | SHODAN | VT
⚡ SOCKET.IO LAYER ACTIVE
🧠 ARP MONITORING ONLINE
==================================================
`);
  console.log(
    `[📡 SYSTEM HEARTBEAT] Sockets channel attached. Awaiting frontend tracking mappings...`
  );
});

// ================= GRACEFUL SHUTDOWN =================
process.on("SIGINT", () => {
  console.log("\n[SYSTEM] Shutting down gracefully...");
  server.close(() => process.exit(0));
});

process.on("SIGTERM", () => {
  console.log("\n[SYSTEM] SIGTERM received. Shutting down...");
  server.close(() => process.exit(0));
});

// Catch unhandled errors so the process doesn't crash silently
process.on("unhandledRejection", (reason) => {
  console.error("[UNHANDLED REJECTION]", reason);
});

process.on("uncaughtException", (err) => {
  console.error("[UNCAUGHT EXCEPTION]", err);
});