import express from "express"
import { exec } from "child_process"

const router = express.Router()

router.get("/usage",(req,res)=>{

 exec("sudo nethogs -t -c 1",(err,stdout)=>{

  res.json({
   result:stdout
  })

 })

})

export default router
