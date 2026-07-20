import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Components
import IconSidebar from "./components/IconSidebar";
import TopNavbar from "./components/TopNavbar";

// Pages
import Dashboard from "./pages/Dashboard";
import AttackMap from "./pages/AttackMap";
import VulnerabilityScanner from "./pages/VulnerabilityScanner";
import NetworkDevices from "./pages/NetworkDevices";
import WebsiteScanner from "./pages/WebsiteScanner";
import IPLookup from "./pages/IPLookup";
import DeviceDetails from "./pages/DeviceDetails";
import DeviceIntel from "./pages/DeviceIntel";
import AdvancedSOC from "./pages/AdvancedSOC";
import NetworkMonitor from "./pages/NetworkMonitor";
import BountyHunter from "./pages/BountyHunter";
import Reports from "./pages/Reports";

// 🎯 PATENT MATRIX IMPORT: Map your new operational TypeScript TSX page asset
import InternalLinkDefensor from "./pages/InternalLinkDefensor";

function App() {
  return (
    <BrowserRouter>
      {/* Root Container */}
      <div className="bg-slate-950 h-screen w-screen text-white flex flex-col overflow-hidden">
        
        {/* 1. TOP NAVBAR */}
        <div className="z-[100] border-b border-slate-800 bg-slate-900/80 backdrop-blur-md shadow-xl">
          <TopNavbar />
        </div>

        <div className="flex flex-1 overflow-hidden relative">
          
          {/* 2. SIDEBAR (Mini Icon Version - w-14) */}
          <div className="z-[90] w-14 border-r border-slate-800 bg-slate-900 shadow-2xl shrink-0">
            <IconSidebar />
          </div>

          {/* 3. MAIN CONTENT AREA */}
          <main className="flex-1 min-w-0 overflow-y-auto bg-slate-950 scrollbar-hide">
            <div className="pl-2 pr-6 pt-10 pb-10 min-h-full"> 
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/attack-map" element={<AttackMap />} />
                <Route path="/vulnerability" element={<VulnerabilityScanner />} />
                <Route path="/network-devices" element={<NetworkDevices />} />
                <Route path="/website-scanner" element={<WebsiteScanner />} />
                <Route path="/network-monitor" element={<NetworkMonitor />} />
                <Route path="/device-details" element={<DeviceDetails/>}/>
                <Route path="/device-intel" element={<DeviceIntel />} />
                <Route path="/adv-soc" element={<AdvancedSOC />} />
                <Route path="/ip-lookup" element={<IPLookup />} />
                <Route path="/bounty-hunter" element={<BountyHunter />} />
                
                {/* 🎯 CORE REPLACEMENT: Old AntiMitm path is now securely replaced by InternalLinkDefensor */}
                <Route path="/link-defensor" element={<InternalLinkDefensor />} />
                
                <Route path="/reports" element={<Reports />} />
                
                {/* Global Wildcard Fallback Router Link */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
