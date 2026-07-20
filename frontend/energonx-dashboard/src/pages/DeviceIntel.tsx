import { useState } from "react"

export default function DeviceIntel(){

const [ip,setIp] = useState("")
const [device,setDevice] = useState<any>(null)

const scanDevice = async ()=>{

 const res = await fetch(`http://localhost:5000/api/device-intel/${ip}`)
 const data = await res.json()

 setDevice(data)

}

return(

<div className="p-6 text-white">

<h1 className="text-2xl mb-4">Device Intelligence</h1>

<input
className="bg-gray-800 p-2 mr-3"
placeholder="Device IP"
value={ip}
onChange={(e)=>setIp(e.target.value)}
/>

<button
className="bg-blue-600 px-4 py-2 rounded"
onClick={scanDevice}
>
Scan Device
</button>

{device && (

<div className="mt-6 bg-gray-800 p-4 rounded">

<h2 className="text-lg mb-3">Device Info</h2>

<p>IP: {device.ip}</p>
<p>OS: {device.os}</p>
<p>Risk Score: {device.riskScore}</p>

<h3 className="mt-4">Open Ports</h3>

<ul>
{device.ports.map((p:any,i:number)=>(
<li key={i}>{p}</li>
))}
</ul>

<button className="mt-4 bg-green-600 px-4 py-2 rounded">
Download Report
</button>

</div>

)}

</div>

)

}
