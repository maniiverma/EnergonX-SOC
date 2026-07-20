import express from "express"
import { exec } from "child_process"

const router = express.Router()

router.get("/monitor",(req,res)=>{

 exec("sudo tcpdump -nn -c 20",(err,stdout)=>{

  let alert="Normal traffic"

  if(stdout.includes("SYN")){
   alert="⚠ Possible Port Scan"
  }

  res.json({alert})

 })

})

export default router
