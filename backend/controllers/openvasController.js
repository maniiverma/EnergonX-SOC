const { exec } = require("child_process")

exports.openvasScan = (req,res)=>{

 const target = req.body.target

 if(!target){
  return res.status(400).json({error:"Target required"})
 }

 const command = `gvm-cli socket --xml "<create_target><name>scan</name><hosts>${target}</hosts></create_target>"`

 exec(command,(error,stdout,stderr)=>{

  if(error){
   console.log(error)
   return res.status(500).json({error:"OpenVAS scan failed"})
  }

  res.json({
   message:"Scan started",
   output:stdout
  })

 })

}
