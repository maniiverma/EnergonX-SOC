import capModule from 'cap';
import { exec } from "child_process";
import { readJSON, writeJSON } from "../utils/fileStorage.js";

// capModule chon static methods te decoders ikko vaar safely destructure karo
const { Cap, decoders } = capModule;

// Create the missing cap instance for network sniffing
const cap = new Cap();

const filter = 'arp';
const bufSize = 10 * 1024 * 1024;
const buffer = Buffer.alloc(65535);
let arpTable = {}; 

// Universal Auto interface locator logic
const findActiveInterface = () => {
  const deviceList = Cap.deviceList();
  const wifiInterface = deviceList.find(d => d.name.includes('wlan'));
  if (wifiInterface) return wifiInterface.name;
  const ethInterface = deviceList.find(d => d.name.includes('eth'));
  if (ethInterface) return ethInterface.name;
  return Cap.findDevice();
};

// Named Export according to ES Modules standard
export const startArpMonitoring = (io) => {
  try {
    const device = findActiveInterface();
    let linkType = cap.open(device, filter, bufSize, buffer);
    cap.setMinBytes && cap.setMinBytes(0);

    console.log(`\n[ADVANCED SHIELD ACTIVE] Cyber Defense Unit Initiated on: ${device}`);

    // Auto configuration sync interval loop
    setInterval(() => {
      io.emit('interface-status', { interface: device, status: 'Active Defense Mode' });
    }, 3000);

    cap.on('packet', (nbytes, trunc) => {
      if (linkType === 'ETHERNET' || linkType === 'IEEE802_11_RADIO' || linkType === 'IEEE802_11') {
        let ret = decoders.Ethernet(buffer);
        
        if (ret.info.type === 2054) { 
          let arp = decoders.ARP(buffer, ret.offset);
          let senderIP = arp.info.senderProtocolAddr;
          let senderMAC = arp.info.senderHardwareAddr;

          // ANOMALY DETECTED: SAME IP, DIFFERENT MAC SIGNATURE
          if (arpTable[senderIP] && arpTable[senderIP] !== senderMAC) {
            const attackerIP = senderIP; 
            const attackerMAC = senderMAC;

            console.log(`[!] MITM ANOMALY EXPOSED: Attacker IP: ${attackerIP} [MAC: ${attackerMAC}]`);

            // OS FINGERPRINTING & DEFENSE CHAIN
            const threatChainCommand = `
              nmap -O --osscan-guess -F ${attackerIP} | grep "Running:" | head -n 1 || echo "Running: Undetermined Rogue OS";
              sudo iptables -A INPUT -m mac --mac-source ${attackerMAC} -j DROP
            `;

            exec(threatChainCommand, (err, stdout, stderr) => {
              const osGuessed = stdout.replace("Running:", "").trim() || "Hidden Linux Kernel (Possible Kali)";
              
              const alertPayload = {
                type: "ARP_SPOOF_ATTACK",
                ip: attackerIP,
                originalMac: arpTable[attackerIP],
                attackerMac: attackerMAC,
                attackerOs: osGuessed,
                defenseAction: "MAC Isolated via Active Firewall Drop Grid",
                timestamp: new Date(),
                message: `Critical Poisoning Terminated on ${device}!`
              };

              // Broadcast live to frontend via WebSockets
              io.emit('arp-alert', alertPayload);

              // Local logs configuration audit context append tracking
              const alerts = readJSON("alerts.json") || [];
              alerts.push(alertPayload);
              writeJSON("alerts.json", alerts);
            });

          } else {
            arpTable[senderIP] = senderMAC;
          }
        }
      }
    });
  } catch (err) {
    console.error("Advanced ARP Core initialization crash:", err);
  }
};
