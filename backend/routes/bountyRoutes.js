import express from 'express';
import { spawn } from 'child_process';
import { readJSON, writeJSON } from '../utils/fileStorage.js';

/**
 * PATENT-READY ARCHITECTURE blueprint:
 * Asynchronous Multi-Threaded Scanner Interface using Event-Driven Stream Binding
 */
export default function setupBountyRoutes(io) {
  // ✅ FIX 1: Defined router inside the factory function to ensure clean encapsulation and thread isolation
  const router = express.Router();
  
  router.post("/scan", (req, res) => {
    const { target } = req.body;

    if (!target) {
      return res.status(400).json({ error: "Target domain or infrastructure parameter is missing, veer!" });
    }

    // Clean user input to prevent command injection boundaries
    const cleanTarget = target.trim().replace(/[^a-zA-Z0-9.-]/g, '');
    console.log(`\n[⚡ COGNITIVE ENGINE] Initiating Real-Time Threat Audit on: ${cleanTarget}`);

    // Immediately respond to the client frontend that the thread has safely spawned
    res.json({
      status: "SPAWNED",
      message: "Autonomous live scanning child-process initiated successfully.",
      target: cleanTarget
    });

    // 1. Emit live status tracking directly via active socket lines
    io.emit('scan-stream-log', { target: cleanTarget, log: `[INIT] Spawning active network reconnaissance threads for ${cleanTarget}...` });

    let findings = [];
    let rawHeaders = '';

    // 2. SPAWN LIVE DETACHED PROCESS: Run real network header analysis via raw curl execution streams
    const curlProcess = spawn('curl', ['-I', '-s', '--connect-timeout', '10', `https://${cleanTarget}`]);

    // ✅ FIX 2: Added error event handler to prevent server crashes if binary invocation fails
    curlProcess.on('error', (err) => {
      console.error(`[CURL INSTANTIATION FAULT]: ${err.message}`);
      io.emit('scan-stream-log', { target: cleanTarget, log: `[ERROR] Network check subsystem initialization failed.` });
    });

    curlProcess.stdout.on('data', (data) => {
      rawHeaders += data.toString();
      io.emit('scan-stream-log', { target: cleanTarget, log: `[LIVE TRACE] Fetching remote server headers map...` });
    });

    curlProcess.on('close', (code) => {
      io.emit('scan-stream-log', { target: cleanTarget, log: `[PROCESSING] Analyzing protocol response metadata arrays...` });

      const normalizedHeaders = rawHeaders.toLowerCase();

      // REAL AUDIT LOGIC CHIP 1: Check Strict-Transport-Security Header
      if (!normalizedHeaders.includes('strict-transport-security')) {
        findings.push({
          id: `EX-HSTS-${Math.floor(Math.random() * 9000) + 1000}`,
          vulnName: "Missing Strict-Transport-Security (HSTS) Protection Flag",
          severity: "HIGH",
          endpoint: `https://${cleanTarget}/`,
          businessLoss: "High corporate exposure. The infrastructure allows cleartext HTTP communication down-grades, exposing users to cryptographic session hijacking.",
          remediation: "Configure the web server routing gateway to append the 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload' header properties natively."
        });
      }

      // REAL AUDIT LOGIC CHIP 2: Check Clickjacking Protection (X-Frame-Options)
      if (!normalizedHeaders.includes('x-frame-options') && !normalizedHeaders.includes('content-security-policy')) {
        findings.push({
          id: `EX-XFRAME-${Math.floor(Math.random() * 9000) + 1000}`,
          vulnName: "Missing X-Frame-Options / Clickjacking Vulnerability",
          severity: "MEDIUM",
          endpoint: `https://${cleanTarget}/`,
          businessLoss: "Regulatory and financial risk. Malicious third-party frames can wrap the application layer into invisible overlays.",
          remediation: "Enforce deployment policies mapping 'X-Frame-Options: DENY' inside corporate Content Security Policies."
        });
      }

      // 3. SPAWN CONDITIONAL DEEP ENGINES: Run an active ports validation check via Nmap
      io.emit('scan-stream-log', { target: cleanTarget, log: `[STAGE 2] Spawning active Nmap network fingerprint mapper...` });

      const nmapProcess = spawn('nmap', ['-F', '--open', cleanTarget]);
      let nmapOutput = '';

      // ✅ FIX 3: Added error event handler for Nmap execution step to prevent backend unhandled crashes
      nmapProcess.on('error', (err) => {
        console.error(`[NMAP INSTANTIATION FAULT]: ${err.message}`);
        io.emit('scan-stream-log', { target: cleanTarget, log: `[ERROR] Port scanning subsystem execution blocked.` });
        finalizeScan(); // Ensure data gets safely stored even if nmap errors out
      });

      nmapProcess.stdout.on('data', (data) => {
        const line = data.toString();
        nmapOutput += line;
        io.emit('scan-stream-log', { target: cleanTarget, log: `[NMAP STREAM] ${line.trim()}` });
      });

      nmapProcess.on('close', () => {
        if (nmapOutput.includes('21/tcp')) {
          findings.push({
            id: `EX-PORT-21`,
            vulnName: "Insecure Plaintext FTP Daemon Service Detected",
            severity: "CRITICAL",
            endpoint: `${cleanTarget}:21`,
            businessLoss: "Immediate compromise vector. Internal administrative file storage pathways are processing requests over an unencrypted layer.",
            remediation: "Terminate port 21 transmission bindings immediately and transition storage operations to SFTP."
          });
        }
        finalizeScan();
      });

      // Encapsulated data persistence loop to handle async workflow exits cleanly
      function finalizeScan() {
        io.emit('scan-stream-log', { target: cleanTarget, log: `[FINALIZE] Core compilation routine complete. Saving records...` });

        const finalPayload = {
          status: "COMPLETED",
          target: cleanTarget,
          bugsFound: findings.length,
          findings: findings,
          timestamp: new Date().toISOString()
        };

        // Broadcast the final completed dataset directly to the React listener hooks
        io.emit('scan-completed', finalPayload);

        // Append the telemetry logs permanently to the disk log repository safely
        try {
          const currentRecords = readJSON('bounty_reports.json') || [];
          currentRecords.push(finalPayload);
          writeJSON('bounty_reports.json', currentRecords);
        } catch (storageError) {
          console.error("[CRITICAL] Failed to append infrastructure audit log to disk file storage:", storageError);
        }
      }
    });
  });

  return router;
}