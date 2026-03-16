const express=require('express'),r=express.Router(),{Administration}=require('../models/Masters'),auth=require('../middleware/auth');
r.get('/',async(req,res)=>{
  try{
    const q={};
    if(req.query.district) q.district=req.query.district;
    if(req.query.union) q.union=req.query.union;
    if(req.query.assembly) q.assembly=req.query.assembly;
    if(req.query.area) q.area=req.query.area;
    res.json(await Administration.find(q).populate('district union assembly area','name').sort({name:1}));
  }catch(e){res.status(500).json({message:e.message});}
});
r.post('/',auth,async(req,res)=>{
  try{res.status(201).json(await new Administration(req.body).save());}
  catch(e){res.status(400).json({message:e.message});}
});
r.put('/:id',auth,async(req,res)=>{
  try{res.json(await Administration.findByIdAndUpdate(req.params.id,req.body,{new:true}));}
  catch(e){res.status(400).json({message:e.message});}
});
r.delete('/:id',auth,async(req,res)=>{
  try{await Administration.findByIdAndDelete(req.params.id);res.json({message:'Deleted'});}
  catch(e){res.status(500).json({message:e.message});}
});
module.exports=r;
