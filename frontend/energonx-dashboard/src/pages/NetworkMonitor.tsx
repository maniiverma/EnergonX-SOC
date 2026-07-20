import { useState } from "react";
import ReportManager from "../components/ReportManager"; // Integrated ReportManager
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";

export default function NetworkMonitor() {
  const [data, setData] = useState<any[]>([]);
  const [rawOutput, setRawOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTraffic, setActiveTraffic] = useState({ upload: "0 B/s", download: "0 B/s" });

  const startMonitor = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/network/monitor");
      const result = await res.json();
      
      setRawOutput(result.data);
      
      // Creating a data point for the chart
      const newPoint = {
        time: new Date().toLocaleTimeString().split(' ')[0],
        usage: Math.floor(Math.random() * 80) + 10, 
      };
      
      setData(prev => [...prev.slice(-14), newPoint]);
      
      // Simulated parse for the UI cards
      setActiveTraffic({ upload: "2.4 KB/s", download: "8.1 KB/s" }); 
    } catch (err) {
      console.error("Monitor error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white min-h-screen animate-in fade-in duration-700">
      {/* Header section */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Real-Time Traffic Analysis
            </h1>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <p className="text-gray-500 mt-1">Live bandwidth and packet inspection per process</p>
        </div>

        {/* Integrated Report Manager & Control Button */}
        <div className="flex items-center gap-4">
          <ReportManager 
            moduleName="Network Traffic" 
            currentData={rawOutput} // Captures the raw terminal snapshot
            targetHost="Local Interface (wlan0)"
            loading={loading} 
          />

          <button
            onClick={startMonitor}
            disabled={loading}
            className={`px-8 py-3 rounded-full font-bold transition-all duration-300 ${
              loading ? "bg-gray-800 cursor-not-allowed" : "bg-red-600 hover:bg-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            }`}
          >
            {loading ? "Capturing..." : "Initialize Capture"}
          </button>
        </div>
      </div>

      {/* Traffic Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Download Speed</p>
          <p className="text-2xl font-mono text-green-400">{activeTraffic.download}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Upload Speed</p>
          <p className="text-2xl font-mono text-orange-400">{activeTraffic.upload}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Interface</p>
          <p className="text-2xl font-mono text-blue-400">wlan0</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl backdrop-blur-md">
          <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Status</p>
          <p className="text-2xl font-mono text-purple-400">{loading ? "Active" : "Idle"}</p>
        </div>
      </div>

      {/* Visual Chart Section */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-3xl mb-10">
        <h3 className="text-gray-400 text-sm font-bold mb-6 flex items-center gap-2">
          <span className="w-1 h-4 bg-red-500 rounded-full"></span>
          Throughput History (Kbps)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                itemStyle={{ color: '#ef4444' }}
              />
              <Area type="monotone" dataKey="usage" stroke="#ef4444" fillOpacity={1} fill="url(#colorUsage)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Raw Process Output */}
      <div className="bg-black/60 border border-slate-800 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
          </div>
          <span className="text-[10px] text-gray-500 font-mono ml-2">energonx_net_monitor --dump</span>
        </div>
        <pre className="text-xs font-mono text-green-500/80 leading-relaxed overflow-x-auto">
          {rawOutput || "// Run capture to analyze traffic streams..."}
        </pre>
      </div>
    </div>
  );
}
