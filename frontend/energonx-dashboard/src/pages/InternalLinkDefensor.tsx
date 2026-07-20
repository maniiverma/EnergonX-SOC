import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { 
  Shield, ShieldAlert, ToggleLeft, ToggleRight, 
  Activity, XCircle, RefreshCw, BellRing, Cpu, Smartphone 
} from 'lucide-react';

// Establish strictly-typed socket initialization connection
const socket = io('http://localhost:5000'); // Port 5000 maps to your backend server

// Core Data Contracts for Patent-Grade Robust Typing
interface ChatOpsConfig {
  discord_url?: string;
  telegram_token?: string;
  telegram_chat?: string;
}

interface IncidentLog {
  timestamp: string;
  ip: string;
  legitMac: string;
  attackerMac: string;
  threatLevel?: string;
}

interface NetworkNode {
  ip: string;
  mac: string;
  status: 'ONLINE' | 'OFFLINE' | string;
  activeTasks: string;
  performance: string;
}

interface SystemStats {
  monitoredDevices: number;
  whitelistCount: number;
  autoMitigation: boolean;
  antiPoisoning: boolean;
  networkMap: NetworkNode[];
  blockedIps: string[];
  blockedMacs: string[];
  history: IncidentLog[];
  subnetMask: string;
  chatops?: ChatOpsConfig;
}

interface GraphMetric {
  pps: number;
}

export default function InternalLinkDefensor() {
  const [stats, setStats] = useState<SystemStats>({
    monitoredDevices: 0,
    whitelistCount: 0,
    autoMitigation: false,
    antiPoisoning: false,
    networkMap: [],
    blockedIps: [],
    blockedMacs: [],
    history: [],
    subnetMask: '24',
    chatops: { discord_url: '', telegram_token: '', telegram_chat: '' }
  });

  const [selectedInspect, setSelectedInspect] = useState<IncidentLog | null>(null);
  const [graphData, setGraphData] = useState<GraphMetric[]>(
    Array(30).fill(0).map(() => ({ pps: 0 }))
  );

  const [discordInput, setDiscordInput] = useState<string>('');
  const [teleTokenInput, setTeleTokenInput] = useState<string>('');
  const [teleChatInput, setTeleChatInput] = useState<string>('');

  // ✅ FIXED: Missing fetchStats definition injected here cleanly
  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/stats");
      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }
      const data = await res.json();
      
      setStats({
        monitoredDevices: data.monitoredDevices || 0,
        whitelistCount: data.whitelistCount || 0,
        autoMitigation: data.autoMitigation || false,
        antiPoisoning: data.antiPoisoning || false,
        networkMap: data.networkMap || [],
        blockedIps: data.blockedIps || [],
        blockedMacs: data.blockedMacs || [],
        history: data.history || [],
        subnetMask: data.subnetMask || '24',
        chatops: data.chatops || { discord_url: '', telegram_token: '', telegram_chat: '' }
      });

      // Sync form inputs with saved backend values if inputs are empty
      if (data.chatops) {
        if (!discordInput) setDiscordInput(data.chatops.discord_url || '');
        if (!teleTokenInput) setTeleTokenInput(data.chatops.telegram_token || '');
        if (!teleChatInput) setTeleChatInput(data.chatops.telegram_chat || '');
      }
    } catch (err) {
      console.error("Safely caught stats engine validation exception:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    
    socket.on('arp_alert_stream', () => { fetchStats(); });
    socket.on('agent_registry_update', () => { fetchStats(); });
    
    socket.on('graph_metrics_stream', (metrics: GraphMetric) => {
      setGraphData((prev) => {
        const current = [...prev, metrics];
        if (current.length > 30) current.shift();
        return current;
      });
    });

    return () => {
      socket.off('arp_alert_stream');
      socket.off('agent_registry_update');
      socket.off('graph_metrics_stream');
    };
  }, []); // Removed selectedInspect dependency matrix to prevent infinite loops

  const saveChatOpsTokens = async (): Promise<void> => {
    try {
      await fetch('http://localhost:5000/api/configure-chatops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discord_url: discordInput,
          telegram_token: teleTokenInput,
          telegram_chat: teleChatInput
        })
      });
      alert("[CONFIG]: Notification integrations tokens updated.");
      fetchStats();
    } catch (e) {
      alert("Config integration error.");
    }
  };

  const toggleFeature = async (featureName: 'autoMitigation' | 'antiPoisoning'): Promise<void> => {
    try {
      await fetch('http://localhost:5000/api/toggle-feature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: featureName })
      });
      fetchStats();
    } catch (err) {
      alert("Toggle failed");
    }
  };

  const triggerMitigation = async (target: string, mode: 'mac' | string, action: 'block' | 'unblock'): Promise<void> => {
    try {
      await fetch('http://localhost:5000/api/mitigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target, mode, action })
      });
      fetchStats();
    } catch (error) {
      alert("IPS execution error");
    }
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '24px', fontFamily: 'monospace' }}>
      
      {/* Top Navbar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1e293b', paddingBottom: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield style={{ color: '#22d3ee', width: '28px', height: '28px' }} />
          <span style={{ fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.05em' }}>INTERNAL LINK DEFENSOR // ENTERPRISE THREAT PREVENTION SUITE</span>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', marginLeft: 'auto' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '6px 12px', borderRadius: '6px', border: '1px solid #334155', color: '#cbd5e1' }}>
            <span>SUBNET RANGE: 10.74.131.0/{stats.subnetMask}</span>
          </div>
          <div style={{ backgroundColor: '#0f172a', padding: '6px 12px', borderRadius: '6px', border: '1px solid #10b981', color: '#10b981', fontWeight: 'bold' }}>
            <span>SHIELD: ONLINE</span>
          </div>
        </div>
      </div>

      {/* Primary Feature Switches */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div onClick={() => toggleFeature('autoMitigation')} style={{ backgroundColor: '#0f172a', border: stats.autoMitigation ? '1px solid #ef4444' : '1px solid #1e293b', padding: '16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ display: 'block', fontWeight: 'bold', color: stats.autoMitigation ? '#ef4444' : '#f1f5f9' }}>Autonomous IPS Firewall System Injection</span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Instantly drops rogue hardware interfaces.</span>
          </div>
          {stats.autoMitigation ? <ToggleRight style={{ color: '#ef4444', width: '28px', height: '28px' }} /> : <ToggleLeft style={{ color: '#475569', width: '28px', height: '28px' }} />}
        </div>

        <div onClick={() => toggleFeature('antiPoisoning')} style={{ backgroundColor: '#0f172a', border: stats.antiPoisoning ? '1px solid #10b981' : '1px solid #1e293b', padding: '16px', borderRadius: '12px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ display: 'block', fontWeight: 'bold', color: stats.antiPoisoning ? '#10b981' : '#f1f5f9' }}>🛠️ Rogue Gateway Recovery Engine</span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Auto-spoof back configurations to hold active paths.</span>
          </div>
          {stats.antiPoisoning ? <ToggleRight style={{ color: '#10b981', width: '28px', height: '28px' }} /> : <ToggleLeft style={{ color: '#475569', width: '28px', height: '28px' }} />}
        </div>
      </div>

      {/* ChatOps Bot Panel Config */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', color: '#cbd5e1', marginBottom: '16px' }}>
          <BellRing style={{ width: '16px', height: '16px', color: '#f59e0b' }} /> ChatOps Threat Notification Channels Panel Config
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#22d3ee', fontSize: '10px', fontWeight: 'bold' }}>DISCORD WEBHOOK URL</span>
            <input type="text" value={discordInput} onChange={(e) => setDiscordInput(e.target.value)} placeholder="Enter full webhook link..." style={{ backgroundColor: '#020617', border: '1px solid #475569', borderRadius: '8px', padding: '10px', color: '#ffffff', outline: 'none' }}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#22d3ee', fontSize: '10px', fontWeight: 'bold' }}>TELEGRAM BOT TOKEN</span>
            <input type="text" value={teleTokenInput} onChange={(e) => setTeleTokenInput(e.target.value)} placeholder="Token code arrays..." style={{ backgroundColor: '#020617', border: '1px solid #475569', borderRadius: '8px', padding: '10px', color: '#ffffff', outline: 'none' }}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ color: '#22d3ee', fontSize: '10px', fontWeight: 'bold' }}>TELEGRAM CHAT ID</span>
            <input type="text" value={teleChatInput} onChange={(e) => setTeleChatInput(e.target.value)} placeholder="e.g., -100123456" style={{ backgroundColor: '#020617', border: '1px solid #475569', borderRadius: '8px', padding: '10px', color: '#ffffff', outline: 'none' }}/>
          </div>
        </div>
        <button onClick={saveChatOpsTokens} style={{ backgroundColor: '#0891b2', color: 'white', fontWeight: 'bold', padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>SAVE CONFIGURATION CHANNELS</button>
      </div>

      {/* Counters Metrics Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px' }}><p style={{ color: '#94a3b8', fontSize: '10px', margin: 0 }}>SQLite Intercept Records</p><h3 style={{ fontSize: '24px', margin: '4px 0 0 0', color: '#f43f5e' }}>{stats.history ? stats.history.length : 0}</h3></div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px' }}><p style={{ color: '#94a3b8', fontSize: '10px', margin: 0 }}>Active Bans</p><h3 style={{ fontSize: '24px', margin: '4px 0 0 0', color: '#f59e0b' }}>{stats.blockedMacs.length}</h3></div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px' }}><p style={{ color: '#94a3b8', fontSize: '10px', margin: 0 }}>Discovered Subnet Nodes</p><h3 style={{ fontSize: '24px', margin: '4px 0 0 0', color: '#22d3ee' }}>{stats.monitoredDevices}</h3></div>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px' }}><p style={{ color: '#94a3b8', fontSize: '10px', margin: 0 }}>Exceptions Whitelist</p><h3 style={{ fontSize: '24px', margin: '4px 0 0 0', color: '#10b981' }}>{stats.whitelistCount}</h3></div>
      </div>

      {/* Real-time Socket Velocity Chart */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
        <div style={{ color: '#94a3b8', fontWeight: 'bold', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity style={{ width: '14px', height: '14px', color: '#22d3ee' }} /> Subnet Real-time Socket Packet Velocity Graph Engine
        </div>
        <div style={{ height: '100px', backgroundColor: '#020617', border: '1px solid #1e293b', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'end', gap: '4px', overflow: 'hidden' }}>
          {graphData.map((d, idx) => {
            const calculatedHeight = d && d.pps ? Math.min(d.pps * 8 + 2, 80) : 2;
            return (
              <div key={idx} style={{ flex: 1, height: `${calculatedHeight}px`, backgroundColor: d && d.pps > 0 ? '#ef4444' : '#22d3ee', borderRadius: '2px 2px 0 0', transition: 'all 0.2s ease', minWidth: '4px' }} />
            );
          })}
        </div>
      </div>

      {/* Intrusion Telemetry Stream Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', fontWeight: 'bold', fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert style={{ width: '14px', height: '14px' }} /> 🚨 Live ARP Spoofing / Poisoning Incident Telemetry Stream
          </div>
          <div style={{ padding: '16px' }}>
            {!stats.history || stats.history.length === 0 ? (
              <div style={{ padding: '24px 0', fontSize: '11px', textAlign: 'center', color: '#64748b' }}>No malicious ARP anomalies detected on the local subnet. System clean.</div>
            ) : (
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: '#94a3b8', borderBottom: '1px solid #334155', fontSize: '10px' }}>
                    <th style={{ padding: '8px' }}>Timestamp</th>
                    <th style={{ padding: '8px' }}>Attacker Source IP</th>
                    <th style={{ padding: '8px' }}>Legit Gateway MAC</th>
                    <th style={{ padding: '8px' }}>Spoofed Rogue MAC</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>IPS Isolation Controls</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.history.map((h, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #1e293b', color: '#ef4444', cursor: 'pointer' }} onClick={() => setSelectedInspect(h)}>
                      <td style={{ padding: '8px', color: '#94a3b8' }}>{h.timestamp}</td>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{h.ip}</td>
                      <td style={{ padding: '8px', color: '#cbd5e1' }}>{h.legitMac}</td>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{h.attackerMac}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => triggerMitigation(h.attackerMac, 'mac', 'block')} style={{ backgroundColor: '#ef4444', border: 'none', color: 'white', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '10px' }}>BLOCK MAC</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Forensics Technical Metadata Inspector Card View */}
        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', fontWeight: 'bold', fontSize: '12px', color: '#22d3ee' }}>🔍 Forensics Data Layer Frame Inspector</div>
          <div style={{ padding: '16px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: '11px', textAlign: 'center' }}>
            {selectedInspect ? (
              <div style={{ width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div><span style={{ color: '#64748b', fontSize: '9px' }}>INTRUSION TARGET IP:</span> <span style={{ color: '#fff', fontWeight: 'bold' }}>{selectedInspect.ip}</span></div>
                <div><span style={{ color: '#64748b', fontSize: '9px' }}>SPOOFED ROGUE HARDWARE FRAME:</span> <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{selectedInspect.attackerMac}</span></div>
                <div><span style={{ color: '#64748b', fontSize: '9px' }}>BENIGN STORAGE CACHE MAC:</span> <span style={{ color: '#10b981' }}>{selectedInspect.legitMac}</span></div>
                <div style={{ borderTop: '1px solid #334155', paddingTop: '8px', fontSize: '10px', color: '#94a3b8' }}>SEVERITY LEVEL: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>{selectedInspect.threatLevel || 'CRITICAL'}</span></div>
              </div>
            ) : "Select any active incident trace row to deploy deep PCAP hardware parameters filter."}
          </div>
        </div>
      </div>

      {/* Foreground App Telemetry Registry Grid Map */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden', marginBottom: '24px' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', fontWeight: 'bold', fontSize: '12px', color: '#22d3ee', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Cpu style={{ width: '14px', height: '14px' }} /> Advanced Foreground App Telemetry & Hardware Resource Matrix
        </div>
        <div style={{ padding: '16px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ color: '#94a3b8', borderBottom: '1px solid #334155', fontSize: '10px' }}>
                <th style={{ padding: '12px' }}>TARGET NODE IP</th>
                <th style={{ padding: '12px' }}>HARDWARE MAC</th>
                <th style={{ padding: '12px' }}>MANAGEMENT STATUS</th>
                <th style={{ padding: '12px', color: '#22d3ee' }}>LIVE FOREGROUND APP / ACTIVE WINDOW</th>
                <th style={{ padding: '12px', color: '#10b981' }}>HARDWARE SPEC METRICS LOAD</th>
              </tr>
            </thead>
            <tbody>
              {stats.networkMap.map((node, i) => {
                const isOnline = node.status === "ONLINE";
                const isOffline = node.status === "OFFLINE";
                
                return (
                  <tr key={i} style={{ borderBottom: '1px solid #1e293b', height: '50px', backgroundColor: isOffline ? '#7f1d1d10' : 'transparent' }}>
                    <td style={{ padding: '12px', color: '#ffffff', fontWeight: 'bold' }}>{node.ip}</td>
                    <td style={{ padding: '12px', color: '#94a3b8', textTransform: 'uppercase' }}>{node.mac}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        padding: '3px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold',
                        backgroundColor: isOnline ? '#10b98120' : isOffline ? '#ef444420' : '#33415540',
                        color: isOnline ? '#10b981' : isOffline ? '#ef4444' : '#94a3b8',
                        border: isOnline ? '1px solid #10b98140' : isOffline ? '1px solid #ef444440' : '1px solid #33415540'
                      }}>{node.status}</span>
                    </td>
                    <td style={{ padding: '12px', color: isOnline ? '#f59e0b' : '#64748b', fontWeight: 'bold' }}>{node.activeTasks}</td>
                    <td style={{ padding: '12px', color: isOnline ? '#10b981' : '#64748b' }}>{node.performance}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Blacklist Firewall Enforcement Table Manager */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', overflow: 'hidden' }}>
        <div style={{ backgroundColor: '#1e293b', padding: '12px 16px', fontWeight: 'bold', fontSize: '12px', color: '#f59e0b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>🛡️ Active Kernel Firewall Drops Isolation Rules Table Registry</span>
          <button onClick={fetchStats} style={{ backgroundColor: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', marginLeft: 'auto' }}>
            <RefreshCw style={{ width: '12px', height: '12px' }} />
          </button>
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '8px' }}>
          {stats.blockedMacs.length === 0 ? (
            <span style={{ color: '#475569', gridColumn: '1/-1', textAlign: 'center' }}>No active isolation rules currently loaded inside Linux firewall architecture modules.</span>
          ) : (
            stats.blockedMacs.map((mac, i) => (
              <div key={i} style={{ backgroundColor: '#020617', border: '1px solid #334155', padding: '8px 12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>{mac}</span>
                <button onClick={() => triggerMitigation(mac, 'mac', 'unblock')} style={{ backgroundColor: 'transparent', border: 'none', color: '#10b981', fontWeight: 'bold', cursor: 'pointer', fontSize: '10px' }}>
                  <XCircle style={{ width: '14px', height: '14px' }} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ color: '#475569', fontSize: '10px', paddingTop: '16px', textTransform: 'uppercase', textAlign: 'center' }}>
        <Smartphone style={{ width: '12px', height: '12px', verticalAlign: 'middle', marginRight: '4px' }} /> Hardware Telemetry Data Mode Bound via SocketIO Drivers
      </div>
    </div>
  );
}