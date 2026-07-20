import { Link, useLocation } from "react-router-dom";
import { 
  FaLayout, 
  FaShieldAlt, 
  FaHeartbeat, 
  FaNetworkWired, 
  FaSearchLocation, 
  FaGlobe, 
  FaCrosshairs, 
  FaShieldVirus,
  FaSkullHome,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  // Helper function to handle active page highlights smoothly
  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaLayout /> },
    { name: "Vulnerability Scanner", path: "/vulnerability-scanner", icon: <FaShieldAlt /> },
    { name: "Bounty Hunter Engine", path: "/bounty-hunter", icon: <FaCrosshairs /> },
    
    // 🎯 EXACT OPTION B IMPLEMENTATION AS SHOWN IN THE IMAGE
    { 
      name: "Internal Link Defensor", 
      path: "/link-defensor", 
      icon: <FaShieldAlt />, // Updated to match Option B image exactly
      highlight: true 
    },
    
    { name: "Network Monitor", path: "/network-monitor", icon: <FaHeartbeat /> },
    { name: "Network Devices", path: "/network-devices", icon: <FaNetworkWired /> },
    { name: "IP Lookup", path: "/ip-lookup", icon: <FaSearchLocation /> },
    { name: "Cyber Attack Map", path: "/attack-map", icon: <FaGlobe /> },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-900 h-screen p-6 flex flex-col justify-between relative overflow-hidden">
      {/* Background Subtle Glow Decoration */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/5 blur-[80px] rounded-full"></div>
      
      <div className="relative z-10">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-10 pl-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></div>
          <h1 className="text-xl font-black text-white uppercase tracking-wider font-mono">
            Energon<span className="text-emerald-400">X</span>
          </h1>
        </div>

        {/* Navigation Link List Context */}
        <nav className="space-y-1.5">
          {menuItems.map((item, index) => {
            const active = isActive(item.path);
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-mono text-[11px] uppercase tracking-wider transition-all duration-200 group relative ${
                  active
                    ? item.highlight 
                      ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold'
                    : item.highlight
                      ? 'text-slate-400 hover:bg-slate-900/60 hover:text-orange-400 border border-transparent'
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-white border border-transparent'
                }`}
              >
                {/* Active Indicator Bar */}
                {active && (
                  <span className={`absolute left-0 top-1/3 w-[3px] h-1/3 rounded-r-full ${
                    item.highlight ? 'bg-orange-500' : 'bg-emerald-400'
                  }`} />
                )}
                
                {/* Icon Rendering */}
                <span className={`text-xs transition-colors duration-200 ${
                  active 
                    ? item.highlight ? 'text-orange-400' : 'text-emerald-400'
                    : 'text-slate-500 group-hover:text-slate-300'
                }`}>
                  {item.icon}
                </span>

                {/* Item Name */}
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* System Footer Details */}
      <div className="border-t border-slate-900/60 pt-4 pl-2 relative z-10">
        <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
          Secured Interface Mode
        </p>
        <p className="text-[8px] font-mono text-slate-500 mt-0.5">
          v1.2.0 // Active Deployment
        </p>
      </div>
    </div>
  );
}
