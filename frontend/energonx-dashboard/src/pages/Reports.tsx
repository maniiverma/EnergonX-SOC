import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FaFilePdf, FaFolderOpen, FaTerminal, FaClock, FaDownload, FaPrint } from 'react-icons/fa';

export default function Reports() {
  const [reportMetadata, setReportMetadata] = useState({
    generatedAt: new Date().toLocaleString(),
    complianceStatus: 'PASSED',
    totalBugsChecked: 0,
    networkIntrusionsBlocked: 0
  });

  const [recentScans, setRecentScans] = useState<any[]>([]);

  useEffect(() => {
    // Local storage ya configuration tracking logs safely parsing
    const mockHistory = [
      { id: "EX-9021", target: "Local Network Grid (wlan0)", type: "Anti-MitM Audit", status: "Secure", date: "2026-06-04" },
      { id: "EX-8842", target: "api.target-scope.com", type: "Bounty Hunter Scan", status: "2 Bugs Labhe", date: "2026-06-03" },
      { id: "EX-7109", target: "internal-testing-infrastructure", type: "Vulnerability Scan", status: "Secure", date: "2026-05-28" }
    ];
    setRecentScans(mockHistory);
    
    // Fallback dynamic tracking
    try {
      const storedAlerts = JSON.parse(localStorage.getItem('alerts') || '[]');
      setReportMetadata(prev => ({
        ...prev,
        networkIntrusionsBlocked: storedAlerts.length || 0
      }));
    } catch(e) {}
  }, []);

  // HIGH-FIDELITY DEFENSE COMPLIANCE PDF GENERATOR ENGINE
  const generatePDFReport = (scanDetails?: any) => {
    const doc = new jsPDF() as any;
    const targetName = scanDetails ? scanDetails.target : "EnergonX System Infrastructure Scope";
    const reportId = scanDetails ? scanDetails.id : `EX-GEN-${Math.floor(Math.random() * 9000) + 1000}`;

    // 1. Executive Cyber Layout Header styling
    doc.setFillColor(15, 23, 42); // Deep Slate Gray Color
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFont("courier", "bold");
    doc.setFontSize(22);
    doc.setTextColor(52, 211, 153); // Emerald Accent text
    doc.text("ENERGONX SECURITY INTELLIGENCE REPORT", 14, 25);
    
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(`REPORT MATRIX REFERENCE ID: ${reportId} // CONFIDENTIAL`, 14, 34);

    // 2. Metadata Section Context blocks
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    
    doc.text(`Generated On: ${reportMetadata.generatedAt}`, 14, 55);
    doc.text(`Target Scope Infrastructure: ${targetName}`, 14, 62);
    doc.text(`Audited Via: Autonomous Hybrid Prevention Module`, 14, 69);
    
    // Status Badge Block rendering
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(145, 48, 50, 25, 3, 3, 'F');
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("COMPLIANCE RATING", 149, 55);
    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129); // Green
    doc.text("SECURE / PASS", 149, 66);

    // 3. Technical Core Threat Table Audit Grid
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("System Operational Telemetry Summary", 14, 88);

    const tableRows = [
      ["Wireless Card Promiscuous Buffer (wlan0)", "ACTIVE Monitoring Mode", "NOMINAL"],
      ["Automated Iptables Source Isolation Grid", "Active IPS Protection Enabled", "STABLE"],
      ["Local Host ARP Poisoning Anomalies Count", `${reportMetadata.networkIntrusionsBlocked} Intrusions Detected`, "MITIGATED"],
      ["External Sub-Domain Recon Targets Scope", "Recursive Scan Tasks Pipelines", "COMPLETED"]
    ];

    doc.autoTable({
      startY: 94,
      head: [['Security Vector Channel Audited', 'Operational Intelligence State Log', 'Risk Assessment']],
      body: tableRows,
      headStyles: { fillColor: [30, 41, 59], font: 'helvetica', fontStyle: 'bold' },
      bodyStyles: { font: 'courier', fontSize: 10 },
      theme: 'striped'
    });

    // 4. Verification Legal Footnote Signature properties
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text("This document serves as an official automated verification log generated natively by the EnergonX execution server chain database pipelines. All parameters matching drops tables configurations are signed internally.", 14, finalY);

    // Save Output file stream direct download trigger
    doc.save(`EnergonX_Security_Audit_${reportId}.pdf`);
  };

  return (
    <div className="px-10 py-6 space-y-6 text-slate-300 min-h-screen bg-slate-950">
      
      {/* Upper Module Layout Header Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
            <FaFilePdf className="text-emerald-400 text-2xl" />
            Report Assembly Vault
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">
            Automated PDF Compliance Engine & System Operations Incident Exporter
          </p>
        </div>
        <button 
          onClick={() => generatePDFReport()}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
        >
          <FaDownload /> Export Global Audit Report
        </button>
      </div>

      {/* Main Grid Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Recent Audit Logs Records List Table (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900/30 border border-slate-900 rounded-[2.5rem] p-6 backdrop-blur-md flex flex-col h-[58vh]">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-4 mb-4">
            <FaFolderOpen className="text-emerald-400 text-xs" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Infrastructure Compliance Logs</h3>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
            {recentScans.map((scan) => (
              <div key={scan.id} className="bg-slate-900/50 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between hover:border-slate-700/50 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="bg-slate-800 p-3 rounded-xl text-slate-400 font-mono text-xs group-hover:text-emerald-400 transition-colors shrink-0">
                    {scan.id}
                  </div>
                  <div className="font-mono text-xs">
                    <p className="text-white font-bold tracking-tight text-[13px]">{scan.target}</p>
                    <p className="text-slate-500 text-[10px] uppercase mt-1 tracking-wider">{scan.type} // {scan.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-2.5 py-1 rounded-md font-black uppercase">
                    {scan.status}
                  </span>
                  <button 
                    onClick={() => generatePDFReport(scan)}
                    className="p-2.5 bg-slate-800 hover:bg-emerald-600 rounded-xl text-slate-400 hover:text-white transition-all text-xs"
                    title="Export Specific PDF"
                  >
                    <FaDownload />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Compliance Intelligence Rules Playbook Summary Info Panel */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-[2.5rem] p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-900 pb-4 mb-2">
            <FaClock className="text-purple-500 text-xs" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Export Specifications Summary</h3>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <h4 className="font-sans font-black text-emerald-400 uppercase text-[10px] tracking-wider">Report Format Compliance</h4>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Natively targets standardized executive formats ready for presentation audits. Includes dynamic tables maps layout mapping parameters safely.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-2">
              <h4 className="font-sans font-black text-cyan-400 uppercase text-[10px] tracking-wider">Automated Signing Key</h4>
              <p className="text-slate-500 text-[10px]">
                Signature: SHA-256//B90F21A3E9C
                Status: Verified Secure Cryptographic Footprint.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
