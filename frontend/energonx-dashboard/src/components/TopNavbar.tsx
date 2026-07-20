export default function TopNavbar() {
  return (
    /* Removed 'fixed' and 'top-0' to let Flexbox handle the layout */
    <div className="w-full">
      <div className="h-16 bg-slate-900 flex items-center justify-between px-6 border-b border-slate-800 shadow-xl">
        
        {/* Logo Section */}
        <div className="text-cyan-400 text-2xl font-black tracking-tighter uppercase">
          ⚡ Energon<span className="text-white">X</span>
        </div>

        {/* Navigation Links - Added hover effects for professional look */}
        <div className="hidden lg:flex gap-8 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Dashboard</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Threats</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Network</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Endpoints</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Incidents</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Compliance</span>
          <span className="hover:text-cyan-400 cursor-pointer transition-colors">Reports</span>
        </div>

        {/* User Profile / Admin Section */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-800 px-4 py-1 rounded-full border border-slate-700">
            <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">Admin</span>
          </div>
        </div>

      </div>
    </div>
  );
}
