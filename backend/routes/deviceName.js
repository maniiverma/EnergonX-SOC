import express from "express";

const router = express.Router();

router.get("/:mac",(req,res)=>{

const mac=req.params.mac.substring(0,8).toUpperCase();

const vendors={
"00:1A:2B":"Cisco",
"00:1B:63":"Apple",
"00:1C:B3":"Samsung"
};

res.json({
vendor: vendors[mac] || "Unknown"
});

});

export default router;
