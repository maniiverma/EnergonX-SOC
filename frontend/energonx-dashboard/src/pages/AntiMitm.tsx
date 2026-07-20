import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FaShieldVirus, FaExclamationTriangle, FaTerminal, FaNetworkWired, FaServer, FaHistory } from 'react-icons/fa';

const socket = io('http://localhost:5000');

interface ArpAlert {
  type: string;
  ip: string;
  originalMac: string;
  attackerMac: string;
  timestamp: string;
  message: string;
  defenseAction?: string;
  attackerOs?: string;
}

const AntiMitm: React.FC = () => {
  const [arpAlerts, setArpAlerts] = useState<ArpAlert[]>([]);
  const [activeNetwork, setActiveNetwork] = useState({
    interface: 'Detecting...', // Initial interface status text
    gatewayIp: '192.168.1.1',
    status: 'Initializing System...'
  });

  useEffect(() => {
    // 1. Backend interface settings sync trigger listen karo
    socket.on('interface-status', (data: any) => {
      console.log("[SHIELD] Received Interface Config:", data);
      setActiveNetwork(prev => ({
        ...prev,
        interface: data.interface || 'wlan0',
        status: data.status || 'Secure Monitoring'
      }));
    });

    // 2. Real-time Spoof alerts handle array logic
    socket.on('arp-alert', (data: ArpAlert) => {
      setArpAlerts((prev) => [data, ...prev]);
      setActiveNetwork(prev => ({ ...prev, status: 'ATTACK DETECTED' }));
    });

    return () => {
      socket.off('interface-status');
      socket.off('arp-alert');
    };
  }, []);

  const clearLogs = () => {
    setArpAlerts([]);
    setActiveNetwork(prev => ({ ...prev, status: 'Secure Monitoring' }));
  };

  return (
    <div className="p-8 space-y-6 text-slate-300 min-h-screen bg-slate-950">
      
      {/* Layout Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <FaShieldVirus className="text-orange-500 text-3xl animate-pulse" />
            Anti-MitM Intrusion Shield
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">
            Real-time Local Area Network Packet Inspection & ARP Spoofing Detection
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={clearLogs}
            className="px-6 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
          >
            Clear Shield Logs
          </button>
          <span className={`px-4 py-2 font-mono text-[10px] font-bold rounded-xl border uppercase tracking-widest ${
            activeNetwork.status === 'ATTACK DETECTED' 
              ? 'bg-red-500/10 text-red-400 border-red-500/20 animate-bounce' 
              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          }`}>
            {activeNetwork.status}
          </span>
        </div>
      </div>

      {/* Real-time Enterprise Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-2 right-4 opacity-5 text-cyan-500 text-5xl font-black"><FaNetworkWired /></div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Monitored Interface</p>
          <p className="text-2xl font-black text-cyan-400 mt-2 font-mono">{activeNetwork.interface}</p>
          <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase">Promiscuous Mode Enabled</p>
        </div>
        
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-2 right-4 opacity-5 text-purple-500 text-5xl font-black"><FaServer /></div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Local Gateway Target</p>
          <p className="text-2xl font-black text-purple-400 mt-2 font-mono">{activeNetwork.gatewayIp}</p>
          <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase">Subnet Mapping Vector Checked</p>
        </div>

        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-2 right-4 opacity-5 text-red-500 text-5xl font-black"><FaExclamationTriangle /></div>
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Poisoning Triggers</p>
          <p className={`text-2xl font-black mt-2 font-mono ${arpAlerts.length > 0 ? 'text-red-500 animate-pulse' : 'text-slate-400'}`}>
            {arpAlerts.length} <span className="text-xs font-sans font-medium text-slate-600">Events</span>
          </p>
          <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase">Total Corrupted MAC Mappings</p>
        </div>
      </div>

      {/* Console Alert Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-900 rounded-[2.5rem] p-6 backdrop-blur-md flex flex-col h-[55vh]">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-4 mb-4">
            <FaTerminal className="text-orange-500 text-xs" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Intrusion Security Stream</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {arpAlerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 italic text-xs font-mono py-12">
                <span className="relative flex h-2 w-2 mb-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                No Man-in-the-Middle spoof vectors or poisoning anomalies detected on local grid interface ({activeNetwork.interface}).
              </div>
            ) : (
              arpAlerts.map((alert: ArpAlert, index: number) => (
                <div key={index} className="bg-red-950/10 border border-red-900/40 p-5 rounded-3xl flex gap-4 items-start animate-in slide-in-from-bottom-2 duration-300 shadow-lg shadow-red-950/5 relative overflow-hidden group">
                  
                  {/* Active Blocker Grid Badge Indicator layout right top section alignment */}
                  <div className="absolute top-3 right-4 flex gap-2">
                    <span className="text-[8px] font-mono font-black bg-red-500/20 text-red-400 px-2 py-0.5 rounded border border-red-500/30 tracking-widest uppercase">
                      {alert.defenseAction ? "Mitigation Active" : "Analyzing Threat"}
                    </span>
                  </div>

                  <div className="bg-red-500/10 p-3 rounded-2xl text-red-400 mt-1 shrink-0">
                    <FaExclamationTriangle className="text-base" />
                  </div>

                  <div className="font-mono text-xs flex-1 space-y-2">
                    <div className="flex flex-col text-red-400 font-bold">
                      <span className="text-sm tracking-tight">{alert.message}</span>
                      <span className="text-[9px] text-slate-600 font-normal mt-0.5">Anomaly Detected at {new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>

                    {/* Deep Telemetry Intelligence Data Rows Breakdown info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 mt-2 border-t border-red-900/20 text-[11px]">
                      <div>
                        <span className="text-slate-500 font-sans block uppercase text-[8px] tracking-wider font-black">Target Gateway</span>
                        <span className="text-slate-300 font-medium">{alert.ip}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans block uppercase text-[8px] tracking-wider font-black">Rogue Device footprint</span>
                        <span className="text-pink-400 font-black">{alert.attackerMac}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans block uppercase text-[8px] tracking-wider font-black">Attacker Fingerprint OS</span>
                        <span className="text-orange-400 font-bold bg-orange-500/5 px-1.5 py-0.5 rounded border border-orange-500/10 inline-block mt-0.5">{alert.attackerOs || "Analyzing signature..."}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans block uppercase text-[8px] tracking-wider font-black">Automated Firewall Response</span>
                        <span className="text-emerald-400 font-medium">{alert.defenseAction || "Executing drop table rules..."}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Playbook Sidebar Summary */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-[2.5rem] p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-4 mb-2">
            <FaHistory className="text-purple-500 text-xs" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Threat Mitigation Playbook</h3>
          </div>
          
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-orange-400 uppercase text-[10px] tracking-wider mb-1">What is an ARP Spoof?</h4>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                An attacker sends falsified ARP requests to the local network to bind their MAC address with the IP address of a legitimate gateway, intercepting your data packets.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <h4 className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider mb-2">Defensive Actions</h4>
              <ul className="space-y-2 text-[11px] text-slate-400 list-disc pl-4 font-medium italic">
                <li>Execute static ARP table configurations (`arp -s`).</li>
                <li>Isolate the offending MAC device signature from the routing infrastructure immediately.</li>
                <li>Deploy Layer-2 Dynamic ARP Inspection (DAI) on managed switches.</li>
              </ul>
            </div>

            {/* Live Monitoring Summary Dashboard Tracker Widget */}
            <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl font-mono text-[10px] text-slate-500 space-y-1">
              <h4 className="font-sans font-black uppercase text-[9px] text-cyan-500 tracking-wider mb-2">Monitoring State</h4>
              <p>Monitor: <span className="text-emerald-400 font-bold">ACTIVE</span></p>
              <p>Interface: <span className="text-white font-bold">{activeNetwork.interface}</span></p>
              <p>Gateway: <span className="text-white">{activeNetwork.gatewayIp}</span></p>
              <p>Status: <span className="text-slate-400">{activeNetwork.status}</span></p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AntiMitm;
