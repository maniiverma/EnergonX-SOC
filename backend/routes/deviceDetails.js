import express from "express";
import { exec } from "child_process";

const router = express.Router();

router.get("/:ip", (req,res)=>{

const ip = req.params.ip;

exec(`nmap -O ${ip}`, (err, stdout)=>{

if(err){
return res.json({os:"Unknown"});
}

let os="Unknown";

stdout.split("\n").forEach(line=>{
if(line.includes("Running:")){
os=line.replace("Running:","").trim();
}
});

res.json({os});

});

});

export default router;
