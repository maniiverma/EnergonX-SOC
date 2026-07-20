import { exec } from "child_process";

/**
 * Scans the local network for connected devices
 * @returns {Promise<Array>} List of devices with IP and MAC
 */
export const scanNetwork = () => {
  return new Promise((resolve, reject) => {
    // -l is shorthand for --localnet
    exec("sudo arp-scan -l", (err, stdout) => {
      if (err) {
        return reject(err);
      }

      const lines = stdout.split("\n");
      const devices = [];

      lines.forEach((line) => {
        // Trim and split by whitespace (handles tabs or multiple spaces)
        const parts = line.trim().split(/\s+/);

        // Basic validation: Check if first part looks like an IP and we have a MAC
        if (parts.length >= 2 && parts[0].includes(".")) {
          devices.push({
            ip: parts[0],
            mac: parts[1],
          });
        }
      });

      resolve(devices);
    });
  });
};

/**
 * Attempts to detect the Operating System of a specific IP
 * @param {string} ip - The target IP address
 * @returns {Promise<string>} Detected OS name or "Unknown"
 */
export const detectOS = (ip) => {
  return new Promise((resolve) => {
    // -O: Enable OS detection
    // -Pn: Treat all hosts as online (skip host discovery)
    exec(`sudo nmap -O -Pn ${ip}`, (err, stdout) => {
      // If there's an error or no output, default to Unknown
      if (err || !stdout) {
        return resolve("Unknown");
      }

      const output = stdout.toLowerCase();

      if (output.includes("linux")) {
        resolve("Linux");
      } else if (output.includes("windows")) {
        resolve("Windows");
      } else if (output.includes("android")) {
        resolve("Android");
      } else if (output.includes("apple") || output.includes("ios") || output.includes("mac")) {
        resolve("macOS/iOS");
      } else {
        resolve("Unknown");
      }
    });
  });
};
