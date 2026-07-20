import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReportManager from "../components/ReportManager"; 
import { Shield, Cpu, Activity, Server, Radio } from "lucide-react";

// Strict TypeScript Contracts for System Assets Mapping
interface Device {
  ip: string;
  mac: string;
  vendor: string;
  os?: string;
}

export default function NetworkDevices() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [interfaceUsed, setInterfaceUsed] = useState<string>("eth0");

  const scan = async () => {
    setLoading(true);
    try {
      // ✅ FIXED: Route mapped to our exact backend arpScanRoutes logic path
      const res = await fetch("http://localhost:5000/api/network/scan");
      
      if (!res.ok) {
        throw new Error(`Subnet mapping exception status: ${res.status}`);
      }
      
      const data = await res.json();
      
      // ✅ FIXED: Parsed according to our strict structured payload data layout
      if (data.success && data.devices) {
        setDevices(data.devices);
        if (data.interfaceUsed) setInterfaceUsed(data.interfaceUsed);
      }
    } catch (err) {
      console.error("Discovery engine tracking failure:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#020617', color: '#f8fafc', minHeight: '100vh', padding: '32px', fontFamily: 'monospace', position: 'relative', zIndex: 10 }}>
      
      {/* HEADER SECTION LAYOUT */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #1e293b', paddingBottom: '24px', marginBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Shield style={{ color: '#22d3ee', width: '28px', height: '28px' }} />
            <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'black', letterSpacing: '-0.02em', textTransform: 'uppercase', background: 'linear-gradient(to right, #38bdf8, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Network Asset Discovery
            </h1>
          </div>
          <p style={{ margin: '4px 0 0 0', color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.3em' }}>
            Live Monitoring & Intelligence For Local Endpoints • EnergonX Core
          </p>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'space-between' }}>
          <ReportManager 
            moduleName="Network Devices" 
            currentData={devices} 
            loading={loading} 
          />
          
          <button 
            onClick={scan} 
            disabled={loading}
            style={{ 
              backgroundColor: loading ? '#1e293b' : '#0284c7', 
              color: 'white', 
              fontWeight: 'bold', 
              padding: '12px 28px', 
              borderRadius: '9999px', 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontSize: '12px', 
              textTransform: 'uppercase', 
              boxShadow: loading ? 'none' : '0 4px 14px rgba(2, 132, 199, 0.3)', 
              transition: '0.3s all ease-in-out' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {loading ? (
                <span style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite' }}></span>
              ) : (
                <Radio style={{ width: '16px', height: '16px' }} />
              )}
              {loading ? "Discovering Assets..." : "Launch Network Discovery"}
            </div>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(12px)' }}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Total Discovered Assets</p>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', fontFamily: 'monospace', color: '#38bdf8' }}>{devices.length}</h3>
        </div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(12px)' }}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Active Interface Bound</p>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', fontFamily: 'monospace', color: '#10b981', textTransform: 'uppercase' }}>{interfaceUsed}</h3>
        </div>
        <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', border: '1px solid #1e293b', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(12px)' }}>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Discovery Scan Protocol</p>
          <h3 style={{ margin: '8px 0 0 0', fontSize: '28px', fontFamily: 'monospace', color: '#a855f7' }}>ARP-Scan ENGINE</h3>
        </div>
      </div>

      {/* ASSET ARCHITECTURE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {devices.length > 0 ? (
          devices.map((device, index) => (
            <div 
              key={index} 
              style={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #1e293b', 
                borderRadius: '24px', 
                padding: '24px', 
                transition: '0.3s border-color ease',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0284c7'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
                <div style={{ padding: '12px', backgroundColor: 'rgba(2, 132, 199, 0.1)', borderRadius: '12px' }}>
                  <Server style={{ color: '#38bdf8', width: '20px', height: '20px' }} />
                </div>
                <span style={{ fontSize: '9px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '9999px', textTransform: 'uppercase', fontWeight: 'bold', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  ACTIVE ENTRY
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>IP Target Address</label>
                  <p style={{ margin: 0, fontSize: '16px', fontFamily: 'monospace', color: '#22d3ee' }}>{device.ip}</p>
                </div>

                <div>
                  <label style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>MAC Mapping Segment</label>
                  <p style={{ margin: 0, fontSize: '12px', fontFamily: 'monospace', color: '#cbd5e1', textTransform: 'uppercase' }}>{device.mac}</p>
                </div>

                <div>
                  <label style={{ fontSize: '9px', textTransform: 'uppercase', color: '#64748b', fontWeight: 'bold', letterSpacing: '0.1em', display: 'block', marginBottom: '4px' }}>Hardware NIC Manufacturer</label>
                  <p style={{ margin: 0, fontSize: '12px', color: '#f8fafc', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{device.vendor || "LAN Asset Node"}</p>
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => navigate(`/device-intel?ip=${device.ip}`)}
                  style={{ flex: 1, padding: '10px 0', backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#ffffff', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}
                >
                  INTELLIGENCE
                </button>
                <button 
                  onClick={() => navigate(`/vulnerability`)}
                  style={{ flex: 1, padding: '10px 0', backgroundColor: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(2, 132, 199, 0.2)', borderRadius: '8px', color: '#38bdf8', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', fontFamily: 'monospace' }}
                >
                  AUDIT PORTS
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', padding: '80px 0', textAlign: 'center', border: '2px dashed #1e293b', borderRadius: '24px' }}>
            <Activity style={{ width: '48px', height: '48px', color: '#334155', margin: '0 auto 16px auto', display: 'block' }} />
            <p style={{ color: '#64748b', margin: 0, fontStyle: 'italic', fontSize: '13px' }}>No active asset layers verified inside infrastructure baseline maps. Deploy discovery sweep.</p>
          </div>
        )}
      </div>

      {/* DEPLOYMENT FOOTER BRAND STRIP */}
      <div style={{ color: '#334155', fontSize: '9px', paddingTop: '40px', textTransform: 'uppercase', textAlign: 'center', letterSpacing: '0.15em' }}>
        <Cpu style={{ width: '12px', height: '12px', verticalAlign: 'middle', marginRight: '6px', color: '#1e293b' }} /> Automated Dynamic Scanner Network Subsystem • Project EnergonX Architecture Patent
      </div>
    </div>
  );
}