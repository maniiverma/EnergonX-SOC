import { useEffect, useRef } from "react";
import Globe from "globe.gl";

export default function AttackMap() {
  const globeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!globeRef.current) return;

    // Combined Data Points from both snippets
    const attacks = [
      { startLat: 35.6, startLng: 139.7, endLat: 37.7, endLng: -122.4 }, // Tokyo to SF
      { startLat: 55.7, startLng: 37.6, endLat: 52.5, endLng: 13.4 },    // Moscow to Berlin
      { startLat: -23.5, startLng: -46.6, endLat: 28.6, endLng: 77.2 }, // Brazil to India
      { startLat: 35, startLng: 103, endLat: 37, endLng: -95 },         // China to US
      { startLat: -15, startLng: -47, endLat: 20, endLng: 78 }          // S. America to India
    ];

    // Initialize Globe
    const globe = Globe()(globeRef.current)
      .globeImageUrl("//unpkg.com/three-globe/example/img/earth-dark.jpg")
      .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
      .backgroundColor("#020617")
      .width(globeRef.current.clientWidth)
      .height(600);

    // Visual Styling (Merged animations and colors)
    globe
      .arcsData(attacks)
      .arcColor(() => ["#ff3e3e", "#22c55e", "#eab308"]) // Gradient: Red to Green to Yellow
      .arcAltitude(0.25)
      .arcStroke(0.5)
      .arcDashLength(0.4)
      .arcDashGap(2)
      .arcDashAnimateTime(2000)
      .arcDashInitialGap(() => Math.random() * 5);

    // Auto-rotate for that "Security Ops Center" feel
    globe.controls().autoRotate = true;
    globe.controls().autoRotateSpeed = 0.5;

    // Handle Window Resize
    const handleResize = () => {
      if (globeRef.current) {
        globe.width(globeRef.current.clientWidth);
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      // Clean up Three.js scene on unmount
      const scene = globe.scene();
      if (scene) {
        globe._destructor?.(); 
      }
    };
  }, []);

  return (
    <div className="p-6 bg-[#020617] rounded-xl border border-gray-800 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Global Threat Monitor</h1>
          <p className="text-gray-400 text-sm">Real-time visualized network intrusions</p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
            <span className="text-xs text-gray-300 uppercase font-mono">Live Feed</span>
          </div>
        </div>
      </div>

      {/* Globe Container */}
      <div 
        ref={globeRef} 
        className="w-full rounded-lg cursor-grab active:cursor-grabbing overflow-hidden"
        style={{ height: "600px" }}
      />
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div className="p-2 bg-[#0f172a] rounded">
          <p className="text-gray-500 text-xs uppercase">Active Threats</p>
          <p className="text-xl font-bold text-red-500">1,284</p>
        </div>
        <div className="p-2 bg-[#0f172a] rounded">
          <p className="text-gray-500 text-xs uppercase">Origin Points</p>
          <p className="text-xl font-bold text-blue-400">42</p>
        </div>
        <div className="p-2 bg-[#0f172a] rounded">
          <p className="text-gray-500 text-xs uppercase">Targeted Assets</p>
          <p className="text-xl font-bold text-green-400">912</p>
        </div>
      </div>
    </div>
  );
}
