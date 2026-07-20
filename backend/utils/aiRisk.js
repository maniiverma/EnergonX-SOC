export const calculateRisk=(ports,traffic)=>{

 let score=0

 if(ports>5) score+=40
 if(traffic>50) score+=30

 if(score>60) return "High"
 if(score>30) return "Medium"

 return "Low"

}
