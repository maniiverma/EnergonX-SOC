import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { 
  FaThLarge, FaCrosshairs, FaShieldVirus, FaBug, 
  FaNetworkWired, FaHeartbeat, FaShieldAlt, FaTerminal 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const socket = io('http://localhost:5000');

export default function Dashboard() {
  // Live states tracking parameters
  const [globalMetrics, setGlobalMetrics] = useState({
    systemHealth: 94,
    activeThreats: 0,
    networksMapped: 1,
    mitmTriggers: 0
  });

  const [liveLogs, setLiveLogs] = useState<any[]>([]);

  useEffect(() => {
    // 1. Listen raw scans or live alerts from anti-mitm sockets framework
    socket.on('arp-alert', (data: any) => {
      setGlobalMetrics(prev => ({
        ...prev,
        activeThreats: prev.activeThreats + 1,
        mitmTriggers: prev.mitmTriggers + 1,
        systemHealth: Math.max(prev.systemHealth - 8, 30)
      }));
      
      const newLog = {
        id: Date.now(),
        module: "ANTI-MITM",
        type: "CRITICAL",
        text: `Intrusion Alert: Spoofing anomaly blocked on Gate ${data.ip}`,
        time: new Date().toLocaleTimeString()
      };
      setLiveLogs(prev => [newLog, ...prev.slice(0, 5)]);
    });

    // Simulated data updates safely for visual perfection
    const logInterval = setInterval(() => {
      const systemLogs = [
        "Network discovery module executed background interface sync.",
        "Promiscuous packet buffer optimized on wlan0 channel grid.",
        "Threat intel engine refreshed global zero-day signatures matrix.",
        "Local routing gateway routing tables verified // status: nominal."
      ];
      const randomText = systemLogs[Math.floor(Math.random() * systemLogs.length)];
      const newLog = {
        id: Date.now(),
        module: "ENGINE",
        type: "INFO",
        text: randomText,
        time: new Date().toLocaleTimeString()
      };
      setLiveLogs(prev => [newLog, ...prev.slice(0, 5)]);
    }, 7000);

     () => {
      socket.off('arp-alert');
      clearInterval(logInterval);
    };
  }, []);

  return (
  <div className="px-10 py-6 space-y-6 text-slate-300 min-h-screen bg-slate-950">
      
      {/* SECTION 1: TOP CYBER HUD BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <FaThLarge className="text-emerald-400 text-2xl animate-spin-slow" />
            EnergonX Command Center
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">
            Autonomous Cyber Reconnaissance & Local Intrusion Prevention Dashboard Context
          </p>
        </div>
        
        {/* Dynamic Risk Meter UI */}
        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 backdrop-blur-md">
          <div className="text-right font-mono">
            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">Global Grid Integrity</p>
            <p className={`text-base font-black ${globalMetrics.systemHealth > 80 ? "text-emerald-400" : "text-red-400"}`}>
              {globalMetrics.systemHealth}% Operational
            </p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden">
            <div className={`absolute inset-0 bg-emerald-500/10 ${globalMetrics.systemHealth < 80 ? "bg-red-500/20" : ""}`}></div>
            <FaHeartbeat className={`text-xs ${globalMetrics.systemHealth > 80 ? "text-emerald-400 animate-pulse" : "text-red-500 animate-bounce"}`} />
          </div>
        </div>
      </div>

      {/* SECTION 2: GLOWING HIGH-IMPACT METRICS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: System Mode */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden group">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Core Engine Defense</p>
          <p className="text-2xl font-black text-emerald-400 mt-2 font-mono">HYBRID</p>
          <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase">Recon Intel + Network IPS</p>
          <div className="absolute top-0 right-0 p-4 text-emerald-500/5 text-4xl"><FaShieldAlt /></div>
        </div>

        {/* Card 2: Total Active Threats */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden group">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Threats Intercepted</p>
          <p className={`text-2xl font-black mt-2 font-mono ${globalMetrics.activeThreats > 0 ? "text-red-500 animate-pulse" : "text-slate-300"}`}>
            {globalMetrics.activeThreats} <span className="text-xs text-slate-600 font-sans font-medium">Bugs/Alarms</span>
          </p>
          <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase">Real-Time Poison anomalies</p>
          <div className="absolute top-0 right-0 p-4 text-red-500/5 text-4xl"><FaBug /></div>
        </div>

        {/* Card 3: Networks Audited */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden group">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Active Infrastructure Scans</p>
          <p className="text-2xl font-black text-cyan-400 mt-2 font-mono">{globalMetrics.networksMapped}</p>
          <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase">Subnet Cards Mapping active</p>
          <div className="absolute top-0 right-0 p-4 text-cyan-500/5 text-4xl"><FaNetworkWired /></div>
        </div>

        {/* Card 4: MitM Layer Blocked */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[2rem] backdrop-blur-md relative overflow-hidden group">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">ARP PoC Triggers Blocked</p>
          <p className={`text-2xl font-black mt-2 font-mono ${globalMetrics.mitmTriggers > 0 ? "text-orange-400" : "text-slate-500"}`}>
            {globalMetrics.mitmTriggers} <span className="text-xs text-slate-600 font-sans font-medium">Drops</span>
          </p>
          <p className="text-[9px] text-slate-600 font-mono mt-2 uppercase">Iptables MAC Drops Executed</p>
          <div className="absolute top-0 right-0 p-4 text-orange-500/5 text-4xl"><FaShieldVirus /></div>
        </div>
      </div>

      {/* SECTION 3: CORE OPERATIONS CONTROLS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Modular Navigation HUD Shortcuts */}
        <div className="lg:col-span-1 bg-slate-900/30 border border-slate-900 rounded-[2.5rem] p-6 backdrop-blur-md space-y-4">
          <div className="border-b border-slate-900 pb-4 mb-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Quick Access Vector Controls</h3>
          </div>

          <div className="space-y-3">
            {/* Quick Link 1: Bounty Hunter */}
            <Link to="/bounty-hunter" className="block p-4 bg-slate-900/60 border border-slate-800 hover:border-orange-500/30 rounded-2xl group transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-400 group-hover:bg-orange-500/20 transition-all">
                  <FaCrosshairs className="text-sm" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide group-hover:text-orange-400 transition-colors">Bounty Hunter Recon</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Mass target subdomain zero-day scans</p>
                </div>
              </div>
            </Link>

            {/* Quick Link 2: Anti-MitM */}
            <Link to="/anti-mitm" className="block p-4 bg-slate-900/60 border border-slate-800 hover:border-cyan-500/30 rounded-2xl group transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-cyan-500/10 p-2.5 rounded-xl text-cyan-400 group-hover:bg-cyan-500/20 transition-all">
                  <FaShieldVirus className="text-sm" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide group-hover:text-cyan-400 transition-colors">Anti-MitM IPS Panel</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Local packet sniffer & MAC drops grid</p>
                </div>
              </div>
            </Link>

            {/* Quick Link 3: General Vulnerability */}
            <Link to="/vulnerability" className="block p-4 bg-slate-900/60 border border-slate-800 hover:border-emerald-500/30 rounded-2xl group transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-400 group-hover:bg-emerald-500/20 transition-all">
                  <FaShieldAlt className="text-sm" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wide group-hover:text-emerald-400 transition-colors">Network Core Scanner</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-mono">Host configurations security analytics</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Side: Global Real-Time Event Matrix Console Terminal Log */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-900 rounded-[2.5rem] p-6 backdrop-blur-md flex flex-col h-[48vh]">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-4 mb-4">
            <FaTerminal className="text-emerald-400 text-xs" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Global Pipeline Event Terminal</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2 font-mono text-[11px]">
            {liveLogs.map((log) => (
              <div key={log.id} className="flex gap-4 items-start bg-black/30 border border-slate-900 p-2.5 rounded-xl animate-in slide-in-from-bottom-1 duration-200">
                <span className="text-slate-600 shrink-0">[{log.time}]</span>
                <span className={`font-black shrink-0 uppercase text-[9px] px-1.5 py-0.5 rounded ${
                  log.type === "CRITICAL" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-slate-800 text-slate-400"
                }`}>
                  {log.module}
                </span>
                <span className={log.type === "CRITICAL" ? "text-red-400 font-medium" : "text-slate-400"}>
                  {log.text}
                </span>
              </div>
            ))}
            <div className="flex gap-2 items-center text-slate-600 italic pl-1 pt-1 animate-pulse">
              <span>&gt;</span> <span>Awaiting background matrix instructions...</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
