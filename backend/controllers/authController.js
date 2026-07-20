const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { readJSON } = require("../utils/fileStorage");

exports.login = async (req,res)=>{

 const {username,password} = req.body;

 const users = readJSON("users.json");

 const user = users.find(u => u.username === username);

 if(!user){
  return res.status(401).json({message:"User not found"});
 }

 const valid = await bcrypt.compare(password,user.password);

 if(!valid){
  return res.status(401).json({message:"Invalid password"});
 }

 const token = jwt.sign(
   {id:user.id,role:user.role},
   process.env.JWT_SECRET,
   {expiresIn:"12h"}
 );

 res.json({
  token,
  role:user.role
 });

}
