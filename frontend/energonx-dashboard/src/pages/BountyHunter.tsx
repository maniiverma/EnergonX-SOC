import React, { useState } from 'react';
import { FaCrosshairs, FaTerminal, FaShieldAlt, FaCircle, FaExclamationTriangle, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

interface BugDetail {
  id: string;
  vulnName: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  endpoint: string;
  businessLoss: string;
  remediation: string;
}

interface TargetInstance {
  domain: string;
  status: 'PENDING' | 'SCANNING' | 'COMPLETED' | 'FAILED';
  bugsFound: number;
  details: BugDetail[];
}

export default function AdvancedBountyHunter() {
  const [scopeInput, setScopeInput] = useState('');
  const [targetQueue, setTargetQueue] = useState<TargetInstance[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isHunting, setIsHunting] = useState(false);
  const [consoleStream, setConsoleStream] = useState<string[]>([]);

  const parseAndLaunchHunt = async () => {
    if (!scopeInput.trim()) return;

    const items = scopeInput
      .split(/[\n,]+/)
      .map(d => d.trim().replace(/https?:\/\//, ''))
      .filter(d => d !== '');

    if (items.length === 0) return;

    const initialQueue = items.map(domain => ({
      domain,
      status: 'PENDING' as const,
      bugsFound: 0,
      details: []
    }));

    setTargetQueue(initialQueue);
    setIsHunting(true);
    setConsoleStream([`[SYSTEM] Initializing asynchronous threads for ${items.length} nodes...`]);

    for (let i = 0; i < initialQueue.length; i++) {
      setActiveTab(i);
      setTargetQueue(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'SCANNING' } : item));
      setConsoleStream(prev => [...prev, `[PROCESS] Processing payload definitions for: ${items[i]}...`]);

      try {
        const res = await fetch('http://localhost:5000/api/bounty/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target: items[i] })
        });
        const data = await res.json();
        const findingsArray = data.findings || [];

        setTargetQueue(prev => prev.map((item, idx) => 
          idx === i ? { 
            ...item, 
            status: 'COMPLETED', 
            bugsFound: findingsArray.length,
            details: findingsArray 
          } : item
        ));
        
        setConsoleStream(prev => [...prev, `[SUCCESS] Pipeline executed on ${items[i]} // audit saved.`]);
      } catch (err) {
        setTargetQueue(prev => prev.map((item, idx) => idx === i ? { ...item, status: 'FAILED', bugsFound: 0, details: [] } : item));
        setConsoleStream(prev => [...prev, `[ERROR] Extraction timeout on target node.`]);
      }
    }
    setIsHunting(false);
  };

  return (
    <div className="p-6 space-y-6 text-slate-300 min-h-screen bg-[#050b14] font-sans">
      
      {/* Upper Module Controls Matrix Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-4 gap-4">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-3">
            <FaCrosshairs className="text-orange-500 text-xl animate-pulse" />
            Advanced Mass Hunting Workspace
          </h1>
          <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest mt-1">
            Asynchronous multi-threading scanning pipeline engine // automated recursive loops
          </p>
        </div>
      </div>

      {/* Main Structural Twin Columns Alignment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Input Card */}
        <div className="lg:col-span-1 bg-slate-900/15 border border-slate-900 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-[340px]">
          <div className="space-y-2 w-full">
            <label className="text-[10px] text-slate-400 font-mono uppercase tracking-widest pl-1 font-bold block">Mass Target Injection Root</label>
            <textarea 
              value={scopeInput}
              onChange={(e) => setScopeInput(e.target.value)}
              placeholder="gemini.google.com"
              disabled={isHunting}
              className="w-full h-44 bg-[#03070c]/80 border border-slate-900 rounded-xl p-4 text-xs font-mono text-white outline-none focus:border-orange-500/30 transition-all custom-scrollbar resize-none"
            />
          </div>

          <button 
            onClick={parseAndLaunchHunt}
            disabled={isHunting}
            className={`w-full py-3.5 rounded-xl font-mono text-xs uppercase tracking-widest font-black transition-all ${
              isHunting 
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse' 
                : 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/10'
            }`}
          >
            {isHunting ? 'SCANNING PIPELINE...' : 'Engage Mass Engines'}
          </button>
        </div>

        {/* Right Status Tab Monitor Panel */}
        <div className="lg:col-span-2 bg-slate-900/15 border border-slate-900 rounded-2xl p-5 backdrop-blur-md flex flex-col justify-between h-[340px]">
          
          <div className="flex border-b border-slate-900 overflow-x-auto whitespace-nowrap pb-2 gap-2 custom-scrollbar">
            {targetQueue.length === 0 ? (
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-600 pl-1 py-1">Awaiting workspace configuration targets queue...</span>
            ) : (
              targetQueue.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-lg border transition-all ${
                    activeTab === idx 
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/30 font-bold'
                      : 'bg-transparent border-transparent text-slate-500 hover:text-slate-400'
                  }`}
                >
                  <span className="inline-block mr-1.5 text-[7px]">
                    <FaCircle className={item.status === 'SCANNING' ? 'text-orange-500 animate-ping' : item.status === 'COMPLETED' ? 'text-emerald-500' : 'text-slate-600'} />
                  </span>
                  {item.domain}
                </button>
              ))
            )}
          </div>

          {/* Configuration and Vulnerabilities Dashboard blocks wrapper grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto">
            {targetQueue.length > 0 && targetQueue[activeTab] ? (
              <>
                <div className="p-4 bg-[#03070c]/60 border border-slate-900/80 rounded-xl space-y-1.5">
                  <h4 className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-wider">Asset Configuration</h4>
                  <p className="font-mono text-xs text-white uppercase truncate">{targetQueue[activeTab].domain}</p>
                  <p className="text-[10px] text-slate-400 font-mono">Status: <span className="font-bold text-orange-400">{targetQueue[activeTab].status}</span></p>
                </div>

                <div className="p-4 bg-[#03070c]/60 border border-slate-900/80 rounded-xl space-y-1.5">
                  <h4 className="text-[9px] font-mono font-bold uppercase text-slate-500 tracking-wider">Vulnerabilities Detected</h4>
                  <p className={`font-mono text-base font-black ${targetQueue[activeTab].bugsFound > 0 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`}>
                    {targetQueue[activeTab].bugsFound} <span className="text-[10px] font-mono text-slate-500 font-normal">Bugs Identified</span>
                  </p>
                </div>
              </>
            ) : (
              <div className="col-span-2 text-center text-xs font-mono text-slate-600 italic py-8">
                Active automated workspace is idle. Inject assets to spin pipelines.
              </div>
            )}
          </div>

          {/* Micro Terminal Stream Row */}
          <div className="border-t border-slate-900/60 pt-3 font-mono text-[10px] text-slate-500 flex items-center gap-3">
            <FaTerminal className="text-orange-500 shrink-0" />
            <div className="flex-1 truncate tracking-wide">
              {consoleStream[consoleStream.length - 1] || 'Workspace execution line status: NOMINAL'}
            </div>
          </div>

        </div>
      </div>

      {/* DYNAMIC COMPONENT: INTELLIGENCE DEEP ANALYSIS INDUSTRIAL CARDS */}
      {targetQueue.length > 0 && targetQueue[activeTab] && targetQueue[activeTab].status === 'COMPLETED' && (
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-5 backdrop-blur-md space-y-4 animate-in fade-in duration-200">
          
          <div className="flex items-center gap-2 border-b border-slate-900 pb-3">
            <FaShieldAlt className="text-orange-400 text-xs" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">Target Vulnerability Intelligence Logs</h3>
          </div>

          <div className="space-y-4">
            {targetQueue[activeTab].details.length === 0 ? (
              <div className="p-6 bg-[#03070c]/40 border border-slate-900 rounded-xl text-center text-xs font-mono text-emerald-400/80">
                ✔️ Secure Scan: No threat vectors or security leaks exposed on this target node.
              </div>
            ) : (
              targetQueue[activeTab].details.map((bug, index) => (
                <div key={index} className="bg-[#03070c]/50 border border-slate-900/90 p-5 rounded-xl space-y-4">
                  
                  {/* Vulnerability Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-900/60 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-900 font-bold">{bug.id}</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-wide font-mono">{bug.vulnName}</h4>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded font-mono text-[9px] font-black tracking-widest uppercase border self-start sm:self-auto ${
                      bug.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {bug.severity} RISK
                    </span>
                  </div>

                  {/* Core 3-Column Grid Block Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    
                    {/* Block 1: Endpoint area */}
                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col justify-between space-y-2">
                      <div className="text-[9px] font-mono uppercase tracking-wider font-bold text-slate-500 flex items-center gap-1.5">
                        <FaInfoCircle className="text-cyan-500" /> Vulnerable Endpoint Area
                      </div>
                      <div className="text-cyan-400 break-all bg-black/40 p-3 rounded-lg border border-slate-900 font-mono text-[10px] leading-relaxed">
                        {bug.endpoint}
                      </div>
                    </div>

                    {/* Block 2: Damage Area */}
                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col justify-start space-y-2">
                      <div className="text-[9px] font-mono uppercase tracking-wider font-bold text-red-400/80 flex items-center gap-1.5">
                        <FaExclamationTriangle className="text-red-500" /> Corporate & Financial Damage
                      </div>
                      <p className="text-slate-400 text-[11px] font-sans leading-relaxed">
                        {bug.businessLoss}
                      </p>
                    </div>

                    {/* Block 3: Remediation Area */}
                    <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl flex flex-col justify-start space-y-2">
                      <div className="text-[9px] font-mono uppercase tracking-wider font-bold text-emerald-400/80 flex items-center gap-1.5">
                        <FaCheckCircle className="text-emerald-500" /> Technical Remediation Fix
                      </div>
                      <p className="text-slate-400 text-[11px] font-sans italic leading-relaxed">
                        {bug.remediation}
                      </p>
                    </div>

                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
