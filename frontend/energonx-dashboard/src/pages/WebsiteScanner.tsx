import {useState} from "react"

export default function WebsiteScanner(){

const [target,setTarget]=useState("")
const [result,setResult]=useState("")

const startScan=async()=>{

const res=await fetch("http://localhost:5000/api/website/scan",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({target})
})

const data=await res.json()

setResult(data.result)

}

return(

<div className="p-8">

<h1 className="text-2xl font-bold mb-4">
Website Vulnerability Scanner
</h1>

<input
className="border p-2 mr-4"
placeholder="Enter website"
value={target}
onChange={(e)=>setTarget(e.target.value)}
/>

<button
className="bg-blue-600 px-4 py-2 rounded"
onClick={startScan}
>
Scan Website
</button>

<pre className="mt-6 bg-black text-green-400 p-4 rounded">

{result}

</pre>

</div>

)

}
