import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import ReportManager from "../components/ReportManager";

export default function AdvancedSOC() {
  const [searchParams] = useSearchParams();
  const initialIP = searchParams.get("ip") || "";
  
  const [target, setTarget] = useState(initialIP);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Memoized function taaki loop na bane
  const handleDeepScan = useCallback(async (scanTarget: string) => {
    if (!scanTarget) return;
    
    setLoading(true);
    setError("");
    setResults(null);

    try {
      const res = await fetch(`http://localhost:5000/api/adv/deep-scan/${scanTarget}`);
      
      if (!res.ok) throw new Error("Server communication failed");
      
      const data = await res.json();
      
      if (data.success) {
        setResults(data);
        if (data.note) setError(data.note); // Private IP warning handle karna
      } else {
        setError(data.error || "Scan failed to retrieve data.");
      }
    } catch (err: any) {
      console.error("Deep Scan Error:", err);
      setError("Failed to connect to Intelligence Engine.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Sirf pehli vaar jado page load hove te IP URL ch hove
  useEffect(() => {
    if (initialIP) {
      handleDeepScan(initialIP);
    }
  }, [initialIP, handleDeepScan]);

  return (
    <div className="p-8 text-white min-h-screen animate-in fade-in duration-700">
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 uppercase">
            Advanced SOC Intelligence
          </h1>
          <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mt-1">
            Global Threat Intel & Surface Mapping
          </p>
        </div>

        <ReportManager 
          moduleName="Advanced Deep Scan" 
          currentData={results} 
          targetHost={target} 
          loading={loading} 
        />
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800 backdrop-blur-md">
        <input
          type="text"
          placeholder="Enter Public IP (e.g. 8.8.8.8)"
          className="flex-1 bg-black border border-slate-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleDeepScan(target)}
        />
        <button 
          onClick={() => handleDeepScan(target)}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-500 px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
        >
          {loading ? "ANALYSING..." : "RUN DEEP SCAN"}
        </button>
      </div>

      {/* Error / Private IP Warning */}
      {error && (
        <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/30 rounded-xl text-purple-300 text-sm font-mono text-center">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Card 1: VirusTotal */}
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden">
          <h3 className="text-xl font-bold text-blue-400 mb-8 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
            VirusTotal Reputation
          </h3>

          {results?.vt ? (
            <div className="space-y-6 font-mono text-sm">
              <div className="flex justify-between border-b border-slate-800/50 pb-3">
                <span className="text-gray-500">Malicious Hits:</span>
                <span className={results.vt.malicious > 0 ? "text-red-500 font-bold" : "text-green-500"}>
                  {results.vt.malicious}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-800/50 pb-3">
                <span className="text-gray-500">Suspicious:</span>
                <span className="text-orange-400">{results.vt.suspicious}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-500">Reputation Score:</span>
                <span className="text-cyan-400">{results.reputation || 0}</span>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-600 italic border-2 border-dashed border-slate-800 rounded-2xl">
              {loading ? "Requesting VirusTotal API..." : "No Reputation Data"}
            </div>
          )}
        </div>

        {/* Card 2: Shodan */}
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden">
          <h3 className="text-xl font-bold text-orange-400 mb-8 flex items-center gap-3">
            <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
            Shodan Intelligence
          </h3>

          {results?.shodan ? (
            <div className="space-y-6 font-mono text-sm">
              <div className="flex justify-between border-b border-slate-800/50 pb-3">
                <span className="text-gray-500">Organization:</span>
                <span className="text-white truncate">{results.shodan.org || "N/A"}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/50 pb-3">
                <span className="text-gray-500">OS:</span>
                <span className="text-green-400">{results.shodan.os || "Undetected"}</span>
              </div>
              <div className="mt-4">
                <span className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">Open Ports</span>
                <div className="flex gap-2 mt-3 flex-wrap">
                  {results.shodan.ports?.map((p: any) => (
                    <span key={p} className="bg-orange-500/10 text-orange-400 px-3 py-1 rounded-lg border border-orange-500/20 text-xs font-bold">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-600 italic border-2 border-dashed border-slate-800 rounded-2xl">
              {loading ? "Querying Shodan Database..." : "No Global Intel Found"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
