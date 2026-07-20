import express from "express";
import { exec } from "child_process";

const router = express.Router();

router.get("/scan", (req,res)=>{

exec("arp -a",(err,stdout)=>{

if(err){
return res.status(500).json({error:"scan failed"});
}

const devices=[];

stdout.split("\n").forEach(line=>{

const match=line.match(/\((.*?)\) at ([0-9a-f:]+)/i);

if(match){
devices.push({
ip:match[1],
mac:match[2],
vendor:"Unknown",
os:"Unknown"
});
}

});

res.json(devices);

});

});

export default router;
