import { Link, useLocation } from "react-router-dom";
import { 
  FaThLarge,       // 🎯 FIXED: Standard grid layout icon for dashboard
  FaShieldAlt, 
  FaHeartbeat, 
  FaNetworkWired, 
  FaSearchLocation, 
  FaGlobe, 
  FaCrosshairs, 
  FaFileAlt,
  FaTerminal
} from "react-icons/fa";

export default function IconSidebar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const miniMenuItems = [
    { name: "Dashboard", path: "/", icon: <FaThLarge /> }, 
    { name: "Cyber Attack Map", path: "/attack-map", icon: <FaGlobe /> },
    { name: "Vulnerability Scanner", path: "/vulnerability", icon: <FaShieldAlt /> },
    { name: "Website Scanner", path: "/website-scanner", icon: <FaTerminal /> },
    { name: "Bounty Hunter Engine", path: "/bounty-hunter", icon: <FaCrosshairs /> },
    
    // 🛡️ INTERNAL LINK DEFENSOR PANEL (PORT 5001 OPERATIONAL)
    { 
      name: "Internal Link Defensor", 
      path: "/link-defensor", 
      icon: <FaShieldAlt />, 
      highlight: true 
    },
    
    { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
    { name: "Network Monitor", path: "/network-monitor", icon: <FaHeartbeat /> },
    { name: "Network Devices", path: "/network-devices", icon: <FaNetworkWired /> },
    { name: "IP Lookup", path: "/ip-lookup", icon: <FaSearchLocation /> },
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-6 h-full bg-slate-900 text-slate-400">
      {miniMenuItems.map((item, index) => {
        const active = isActive(item.path);
        return (
          <Link
            key={index}
            to={item.path}
            title={item.name}
            className={`p-3 rounded-xl transition-all duration-200 group relative flex items-center justify-center ${
              active
                ? item.highlight
                  ? "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : item.highlight
                ? "hover:bg-slate-800 hover:text-orange-400 border border-transparent"
                : "hover:bg-slate-800 hover:text-white border border-transparent"
            }`}
          >
            {active && (
              <span className={`absolute left-0 top-1/4 w-[3px] h-1/2 rounded-r-full ${
                item.highlight ? "bg-orange-500" : "bg-emerald-400"
              }`} />
            )}

            <span className="text-base">{item.icon}</span>
          </Link>
        );
      })}
    </div>
  );
}
