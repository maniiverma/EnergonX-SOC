import { useState } from "react";
import ReportManager from "../components/ReportManager"; // Integrated ReportManager

export default function IPLookup() {
  const [target, setTarget] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLookup = async () => {
    if (!target) return setError("Please enter an IP or Domain");
    
    setLoading(true);
    setError("");
    setData(null);

    try {
      // Calling the backend route updated earlier
      const res = await fetch(`http://localhost:5000/api/ip/lookup/${target}`);
      
      if (!res.ok) throw new Error("Lookup failed");
      
      const result = await res.json();
      
      if (result.status === "fail") {
        throw new Error(result.message || "Invalid target IP or domain");
      }
      
      setData(result);
    } catch (err: any) {
      console.error("Lookup error:", err);
      setError(err.message || "IP Intelligence service unavailable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white min-h-screen">
      {/* Header Section with Integrated Report Manager */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
          IP Intelligence Lookup
        </h1>

        {/* Integrated Report Manager Component */}
        <ReportManager 
          moduleName="IP Lookup" 
          currentData={data} 
          targetHost={target} 
          loading={loading} 
        />
      </div>
      
      {/* Search Input Area */}
      <div className="flex gap-3 mb-8">
        <input
          type="text"
          placeholder="Enter IP address or domain (e.g. 8.8.8.8)"
          className="bg-[#1e293b] border border-gray-700 p-3 rounded-lg w-96 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLookup()}
        />
        <button
          onClick={handleLookup}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-2 rounded-lg font-semibold transition shadow-lg disabled:bg-gray-700 disabled:cursor-not-allowed"
        >
          {loading ? "Scanning Intel..." : "Analyze"}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-lg mb-6 flex items-center gap-3">
          <span className="text-xl">⚠️</span> {error}
        </div>
      )}

      {/* Intelligence Results Display */}
      {data && (
        <div className="bg-[#0f172a] border border-gray-800 p-6 rounded-xl shadow-2xl max-w-3xl animate-in fade-in duration-500">
          <h2 className="text-xl font-bold mb-6 text-cyan-400 border-b border-gray-800 pb-3 flex justify-between items-center">
            Security Intelligence Report
            <span className="text-xs bg-cyan-900/30 px-2 py-1 rounded text-cyan-300 uppercase tracking-widest">Live Data</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12 font-mono text-sm">
            <div className="flex justify-between border-b border-gray-800/50 pb-2">
              <span className="text-gray-400">Target IP/Host:</span>
              <span className="text-green-400 font-bold">{data.query}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 pb-2">
              <span className="text-gray-400">Country:</span>
              <span className="text-white">{data.country} ({data.countryCode})</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 pb-2">
              <span className="text-gray-400">City:</span>
              <span className="text-white">{data.city}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 pb-2">
              <span className="text-gray-400">ISP Provider:</span>
              <span className="text-blue-300">{data.isp}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 pb-2">
              <span className="text-gray-400">Organization:</span>
              <span className="text-white">{data.org || "Private Network"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 pb-2">
              <span className="text-gray-400">Timezone:</span>
              <span className="text-white">{data.timezone}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800/50 pb-2 col-span-1 md:col-span-2">
              <span className="text-gray-400">AS Number:</span>
              <span className="text-yellow-500">{data.as}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-800 text-[10px] text-gray-500 uppercase tracking-widest text-center">
            EnergonX Threat Intel Module v2.0
          </div>
        </div>
      )}
    </div>
  );
}
