const express=require('express'),r=express.Router(),{Union}=require('../models/Masters'),auth=require('../middleware/auth');
r.get('/',async(req,res)=>{
  try{
    const q={};
    if(req.query.district) q.district=req.query.district;
    res.json(await Union.find(q).populate('district','name').sort({name:1}));
  }catch(e){res.status(500).json({message:e.message});}
});
r.post('/',auth,async(req,res)=>{
  try{res.status(201).json(await new Union(req.body).save());}
  catch(e){res.status(400).json({message:e.message});}
});
r.put('/:id',auth,async(req,res)=>{
  try{res.json(await Union.findByIdAndUpdate(req.params.id,req.body,{new:true}));}
  catch(e){res.status(400).json({message:e.message});}
});
r.delete('/:id',auth,async(req,res)=>{
  try{await Union.findByIdAndDelete(req.params.id);res.json({message:'Deleted'});}
  catch(e){res.status(500).json({message:e.message});}
});
module.exports=r;
