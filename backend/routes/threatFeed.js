import express from "express"

const router = express.Router()

router.get("/feed",(req,res)=>{

const threats=[
{
ip:"185.220.101.1",
country:"Germany",
type:"Tor Exit Node",
risk:"High"
},
{
ip:"45.142.122.10",
country:"Russia",
type:"Malware C2",
risk:"Critical"
},
{
ip:"103.21.244.5",
country:"India",
type:"Botnet",
risk:"Medium"
}
]

res.json(threats)

})

export default router
