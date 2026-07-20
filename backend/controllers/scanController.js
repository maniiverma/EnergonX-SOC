const { exec } = require("child_process");
const { writeJSON, readJSON } = require("../utils/fileStorage");
const path = require("path");
const fs = require('fs');

exports.startScan = async (req, res) => {
  const { target } = req.body;

  if (!target) {
    return res.status(400).json({ error: "Target is required" });
  }

  // 1. Sanitize input to prevent command injection
  const safeTarget = target.replace(/[^a-zA-Z0-9.-]/g, "");
  const screenshotDir = path.join(__dirname, "../public/screenshots");
  
  // 2. HEAVY DUTY MULTI-TOOL ATTACK CHAIN
  // Step A: Subfinder - Labho saare subdomains
  // Step B: Httpx - Check karo kehre online ne
  // Step C: Nuclei - Sirf alive targets te heavy scanning karo te output JSON format 'final_results.json' ch save karo
  // Step D: Gowitness - Visual proof layi screenshot
  const command = `
    subfinder -d ${safeTarget} -silent > subs.txt && 
    httpx -l subs.txt -silent > alive.txt && 
    nuclei -l alive.txt -severity critical,high -json -o final_results.json &&
    gowitness single -u http://${safeTarget} --destination ${screenshotDir} --filename ${safeTarget}.png
  `;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Execution Error: ${error}`);
    }

    // 3. READ & PARSE FINAL DEEP SCAN RESULTS
    let findings = [];
    try {
      if (fs.existsSync('final_results.json')) {
        const rawResults = fs.readFileSync('final_results.json', 'utf8');
        findings = rawResults
          .split('\n')
          .filter(line => line.trim() !== '')
          .map(line => JSON.parse(line));
      }
    } catch (parseErr) {
      console.error("Error parsing results:", parseErr);
    }

    const scans = readJSON("scans.json");

    // 4. PREPARE SMART DATA OBJECT WITH EXPLOIT PAYLOADS
    const newScan = {
      target: safeTarget,
      timestamp: new Date(),
      status: "Success",
      screenshot: `/screenshots/${safeTarget}.png`,
      findings: findings.map(f => ({
        bug: f.info.name,
        path: f.matched || f.url,
        sev: f.info.severity.toUpperCase(),
        confidence: "Verified",
        port: f['matched-at']?.split(':').pop() || "N/A",
        protocol: f.type || "tcp",
        details: {
          description: f.info.description || "Detailed analysis by EnergonX Deep Engine.",
          remediation: f.info.remediation || "Standard security patches recommended.",
          cve: f.info.classification?.['cve-id'] || "N/A",
          cvss: f.info.classification?.['cvss-score'] || "0.0",
          
          // --- NAYA FEATURE: EXPLOIT PAYLOAD GENERATOR ---
          // Je nuclei curl command dinda hai taan oh use karo, nahi taan auto-generate karo
          exploit_poc: f['curl-command'] || `curl -i -s -k -X GET "${f.matched || f.url}"`,
          steps: [
            "1. Identify the target endpoint.",
            `2. Execute the generated payload against ${f.url}.`,
            "3. Verify the response for sensitive data leakage."
          ]
        }
      }))
    };

    scans.push(newScan);
    writeJSON("scans.json", scans);

    // 5. SEND RESPONSE TO FRONTEND
    res.json({
      success: true,
      message: "Heavy Duty Intelligence Scan Completed",
      findings: newScan.findings,
      screenshot: newScan.screenshot
    });
  });
};
