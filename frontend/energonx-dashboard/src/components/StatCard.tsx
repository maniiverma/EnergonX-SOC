import React from "react";
import { Shield, AlertTriangle, Activity } from "lucide-react";

interface Props{
 title:string
 value:string
 icon:string
}

export default function StatCard({title,value,icon}:Props){

 const getIcon=()=>{

  if(icon==="scan") return <Activity size={28}/>
  if(icon==="vuln") return <AlertTriangle size={28}/>
  if(icon==="alert") return <Shield size={28}/>

 }

 return(

 <div className="card flex justify-between items-center">

  <div>
   <p className="text-gray-400">{title}</p>
   <h2 className="text-3xl font-bold">{value}</h2>
  </div>

  <div className="text-cyan-400">
   {getIcon()}
  </div>

 </div>

 )

}
