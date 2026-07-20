import { LineChart,Line,XAxis,YAxis,Tooltip,ResponsiveContainer } from "recharts"

const data=[
 {time:"10:00",traffic:200},
 {time:"10:10",traffic:300},
 {time:"10:20",traffic:500},
 {time:"10:30",traffic:450},
 {time:"10:40",traffic:700},
]

export default function TrafficChart(){

 return(

 <div className="card h-72">

  <h2 className="mb-4">Network Traffic</h2>

  <ResponsiveContainer width="100%" height="100%">

   <LineChart data={data}>
    <XAxis dataKey="time"/>
    <YAxis/>
    <Tooltip/>
    <Line type="monotone" dataKey="traffic" stroke="#00f7ff"/>
   </LineChart>

  </ResponsiveContainer>

 </div>

 )

}
