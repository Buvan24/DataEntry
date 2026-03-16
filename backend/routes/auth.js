// routes/auth.js
const express=require('express'),router=express.Router(),jwt=require('jsonwebtoken');
router.post('/login',(req,res)=>{
  const{email,password}=req.body;
  if(email===process.env.ADMIN_EMAIL&&password===process.env.ADMIN_PASSWORD){
    const token=jwt.sign({email,role:'admin'},process.env.JWT_SECRET,{expiresIn:'24h'});
    return res.json({token,role:'admin'});
  }
  res.status(400).json({message:'Invalid credentials'});
});
module.exports=router;
