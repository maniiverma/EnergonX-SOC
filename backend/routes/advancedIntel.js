import express from "express";
import axios from "axios";

const router = express.Router();

// ================= API KEYS =================
// Keys provided by user
const VT_API_KEY = "47343c53c5eed22d12802397a65deced59e205647b3f960aca5a22a607ddb5ef";
const SHODAN_API_KEY = "hmhEkBusyVPi4i4uX9fgn89rmnOltQSW";

/**
 * Helper: Check if IP is Private (Local)
 * VirusTotal/Shodan do NOT scan local network IPs
 */
const isPrivateIP = (ip) => {
    return /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(ip) || ip === "127.0.0.1" || ip === "localhost";
};

/**
 * @route   GET /api/adv/reputation/:ip
 */
router.get("/reputation/:ip", async (req, res) => {
    try {
        const { ip } = req.params;

        if (isPrivateIP(ip)) {
            return res.json({
                success: true,
                stats: { malicious: 0, suspicious: 0, harmless: 0, undetected: 0 },
                reputation: 0,
                note: "Private IP detected. VirusTotal only scans Public IPs."
            });
        }

        const response = await axios.get(
            `https://www.virustotal.com/api/v3/ip_addresses/${ip}`,
            { headers: { "x-apikey": VT_API_KEY } }
        );

        res.json({
            success: true,
            stats: response.data.data.attributes.last_analysis_stats,
            reputation: response.data.data.attributes.reputation
        });

    } catch (err) {
        console.error("VT Reputation Error:", err.response?.data?.error?.message || err.message);
        res.json({
            success: false,
            error: "Could not fetch reputation data",
            stats: null
        });
    }
});

/**
 * @route   GET /api/adv/deep-scan/:ip
 */
router.get("/deep-scan/:ip", async (req, res) => {
    try {
        const { ip } = req.params;

        // Validation for Private IPs
        if (isPrivateIP(ip)) {
            return res.json({
                success: true,
                vt: null,
                shodan: null,
                note: "Deep Scan is only available for Public Internet IPs."
            });
        }

        // 1. VirusTotal Request
        const vtRes = await axios
            .get(`https://www.virustotal.com/api/v3/ip_addresses/${ip}`, {
                headers: { "x-apikey": VT_API_KEY }
            })
            .catch((err) => {
                console.error("VT API Error:", err.response?.status || err.message);
                return null;
            });

        // 2. Shodan Request
        const shodanRes = await axios
            .get(`https://api.shodan.io/shodan/host/${ip}?key=${SHODAN_API_KEY}`)
            .catch((err) => {
                console.error("Shodan API Error:", err.response?.status || err.message);
                return null;
            });

        // backend/routes/advancedIntel.js de end vich jithe response bhej rahe ho
res.json({
    success: true,
    vt: vtRes ? vtRes.data.data.attributes.last_analysis_stats : { malicious: 0, suspicious: 0, harmless: 0, undetected: 0 },
    reputation: vtRes ? vtRes.data.data.attributes.reputation : 0,
    shodan: shodanRes ? shodanRes.data : { org: "N/A", os: "N/A", ports: [] },
    note: (isPrivateIP(ip)) ? "Private IP - No External Data" : null
});

    } catch (err) {
        console.error("Critical Deep Scan Failure:", err.message);
        res.status(500).json({
            success: false,
            error: "Intelligence engine timeout"
        });
  }
});

export default router;
