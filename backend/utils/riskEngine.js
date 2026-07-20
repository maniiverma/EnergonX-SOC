export const calculateRisk = (os)=>{

 if(os==="Windows"){
  return "High"
 }

 if(os==="Android"){
  return "Medium"
 }

 if(os==="Linux"){
  return "Low"
 }

 return "Unknown"

}

