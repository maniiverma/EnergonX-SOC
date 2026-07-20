import { useEffect,useState } from "react"

export default function AlertStream(){

const [alerts,setAlerts]=useState([])

useEffect(()=>{

setInterval(async()=>{

const res=await fetch("http://localhost:5000/api/alerts")

const data=await res.json()

setAlerts(data)

},5000)

},[])

return(

<div>

<h2>SOC Alert Stream</h2>

{alerts.map((a,i)=>(
<p key={i}>
⚠ {a.type} from {a.ip}
</p>
))}

</div>

)

}
