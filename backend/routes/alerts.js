import express from "express"

const router=express.Router()

router.get("/",(req,res)=>{

const alerts=[
{type:"PORT SCAN",ip:"192.168.1.45"},
{type:"BRUTE FORCE",ip:"103.44.12.98"},
{type:"MALWARE TRAFFIC",ip:"77.22.90.33"}
]

res.json(alerts)

})

export default router
