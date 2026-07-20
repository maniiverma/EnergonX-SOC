import React from 'react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf, FaFileCsv, FaSpinner } from "react-icons/fa";

interface ReportProps {
  moduleName: string;
  currentData: any; // Findings Array ya SOC Object
  targetHost: string;
  loading: boolean;
}

const ReportManager: React.FC<ReportProps> = ({ moduleName, currentData, targetHost, loading }) => {

  const generatePDF = () => {
    // 1. Safety Check
    if (!currentData || (Array.isArray(currentData) && currentData.length === 0)) {
      return alert("Scan results not found. Please run a scan first!");
    }

    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // --- Header Branding (Dark SOC Style) ---
    doc.setFillColor(15, 23, 42); // Slate-900 background
    doc.rect(0, 0, 210, 45, 'F');
    
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Energon-X Emerald Green
    doc.setFont("helvetica", "bold");
    doc.text("ENERGON-X CYBER INTELLIGENCE", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(200, 200, 200);
    doc.text(`AUDIT MODULE: ${moduleName.toUpperCase()}`, 14, 32);
    doc.text(`TARGET HOST: ${targetHost || "GLOBAL ANALYSIS"}`, 14, 38);

    doc.setTextColor(100, 116, 139);
    doc.text(`REPORT DATE: ${timestamp}`, 140, 38);

    // --- Dynamic Content Rendering ---
    try {
      // CASE A: Data is an Array (Used in Bounty Hunter / Vulnerability Scanner)
      if (Array.isArray(currentData)) {
        const isBountyData = currentData[0]?.bug !== undefined || currentData[0]?.details !== undefined;

        const tableHead = isBountyData 
          ? [['#', 'Finding / Vulnerability', 'Severity', 'Path', 'Confidence']]
          : [['Port', 'Service', 'Risk Level', 'Status']];

        const tableRows = currentData.map((item: any, index: number) => {
          if (isBountyData) {
            return [index + 1, item.bug || "Unknown", item.sev || "INFO", item.path || "/", item.confidence || "Verified"];
          } else {
            return [item.port || "N/A", item.service || "Unknown", item.risk || "Safe", item.state || "Open"];
          }
        });

        autoTable(doc, {
          startY: 55,
          head: tableHead,
          body: tableRows,
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129], textColor: 255 }, // Emerald
          alternateRowStyles: { fillColor: [241, 245, 249] },
          styles: { font: "courier", fontSize: 8 },
        });

        // --- DEEP INTELLIGENCE SECTION (The "Smart" part from Version 1) ---
        if (isBountyData) {
          let finalY = (doc as any).lastAutoTable.finalY + 15;
          doc.setFontSize(14);
          doc.setTextColor(15, 23, 42);
          doc.text("Deep Vulnerability Intelligence & Fixes", 14, finalY);
          finalY += 10;

          currentData.forEach((bug, index) => {
            if (finalY > 250) { doc.addPage(); finalY = 20; }

            doc.setFontSize(11);
            doc.setTextColor(185, 28, 28); // Red for bug name
            doc.text(`${index + 1}. ${bug.bug} [${bug.sev}]`, 14, finalY);
            finalY += 6;

            doc.setFontSize(9);
            doc.setTextColor(50, 50, 50);
            
            const desc = bug.details?.description || "Detailed analysis available in SOC dashboard.";
            const fix = bug.details?.remediation || "Update service and apply firewall rules.";
            const cve = bug.details?.cve || "N/A";

            const splitDesc = doc.splitTextToSize(`Description: ${desc}`, 180);
            doc.text(splitDesc, 14, finalY);
            finalY += (splitDesc.length * 5) + 2;

            doc.setTextColor(5, 150, 105); // Emerald Green for Fix
            const splitFix = doc.splitTextToSize(`Recommended Remediation: ${fix}`, 180);
            doc.text(splitFix, 14, finalY);
            finalY += (splitFix.length * 5) + 4;

            doc.setTextColor(100);
            doc.text(`CVE Reference: ${cve} | CVSS: ${bug.details?.cvss || "0.0"}`, 14, finalY);
            finalY += 8;
            doc.line(14, finalY, 196, finalY);
            finalY += 10;
          });
        }
      } 
      // CASE B: Data is an Object (Advanced SOC / Intel)
      else {
        const socRows = [
          ["VirusTotal Malicious Hits", currentData.vt?.malicious || "0"],
          ["VirusTotal Reputation Score", currentData.reputation || "0"],
          ["Shodan OS Detected", currentData.shodan?.os || "N/A"],
          ["Shodan Organization", currentData.shodan?.org || "N/A"],
          ["Exposed Network Ports", currentData.shodan?.ports?.join(", ") || "No Public Ports"],
          ["Security Recommendations", "Check SSL/TLS and patch exposed services."]
        ];

        autoTable(doc, {
          startY: 55,
          head: [['Intelligence Metric', 'Value / Analysis']],
          body: socRows,
          theme: 'striped',
          headStyles: { fillColor: [249, 115, 22], textColor: 255 }, // Orange for SOC
          styles: { fontSize: 10 },
        });
      }

      // --- Footer ---
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`CONFIDENTIAL - ENERGON-X SOC PROPERTY - PAGE ${i} OF ${pageCount}`, 105, 285, { align: "center" });
      }

      doc.save(`EnergonX_${moduleName.replace(/\s+/g, '_')}_${targetHost || "Report"}.pdf`);

    } catch (error) {
      console.error("PDF Generation Failed:", error);
      alert("Error generating PDF. Check console for details.");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={generatePDF}
        disabled={loading || !currentData}
        className={`flex items-center gap-3 px-6 py-2.5 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all border shadow-lg
          ${loading || !currentData 
            ? "bg-slate-800 border-slate-700 text-slate-600 cursor-not-allowed opacity-50" 
            : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-900/20"
          }`}
      >
        {loading ? <FaSpinner className="animate-spin text-sm" /> : <FaFilePdf className="text-sm" />}
        {loading ? "Analyzing..." : "Export Intelligence PDF"}
      </button>

      <button
        disabled={loading || !currentData}
        className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-600 hover:text-orange-500 hover:border-orange-500/30 transition-all disabled:opacity-30 shadow-xl"
        title="CSV Export Coming Soon"
      >
        <FaFileCsv className="text-sm" />
      </button>
    </div>
  );
}

export default ReportManager;
