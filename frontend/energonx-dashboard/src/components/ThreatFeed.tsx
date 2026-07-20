export default function ThreatFeed() {

 const threats = [

  {
   ip:"185.22.55.11",
   country:"Russia",
   type:"Port Scan",
   severity:"High"
  },

  {
   ip:"102.44.12.98",
   country:"China",
   type:"Brute Force",
   severity:"Critical"
  },

  {
   ip:"77.22.90.33",
   country:"Brazil",
   type:"SQL Injection",
   severity:"Medium"
  },

  {
   ip:"51.210.77.12",
   country:"Germany",
   type:"DDoS Attempt",
   severity:"High"
  }

 ]

 return(

 <div className="card h-72 overflow-y-auto">

 <h2 className="mb-4 text-lg font-semibold">
  Live Threat Feed
 </h2>

 <div className="space-y-3">

 {threats.map((t,i)=>(

 <div
 key={i}
 className="flex justify-between p-3 bg-[#0f172a] rounded"
 >

 <div>

 <p className="font-semibold">{t.ip}</p>

 <p className="text-xs text-gray-400">
 {t.country}
 </p>

 </div>

 <div>

 <p className="text-sm">{t.type}</p>

 <p className="text-xs text-red-400">
 {t.severity}
 </p>

 </div>

 </div>

 ))}

 </div>

 </div>

 )

}
