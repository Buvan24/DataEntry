const express=require('express'),router=express.Router(),Member=require('../models/Member');
const pop='district union assembly area administration position';
router.get('/',async(req,res)=>{
  try{
    const{search,district,assembly,position,administration,union,area}=req.query;
    let q={};
    if(search)q.$or=[{name:{$regex:search,$options:'i'}},{phone:{$regex:search,$options:'i'}},{voterId:{$regex:search,$options:'i'}}];
    if(district)q.district=district; if(assembly)q.assembly=assembly;
    if(position)q.position=position; if(administration)q.administration=administration;
    if(union)q.union=union; if(area)q.area=area;
    res.json(await Member.find(q).populate(pop).sort({createdAt:-1}));
  }catch(e){res.status(500).json({message:e.message});}
});
router.get('/:id',async(req,res)=>{
  try{const m=await Member.findById(req.params.id).populate(pop);
    if(!m)return res.status(404).json({message:'Not found'});res.json(m);
  }catch(e){res.status(500).json({message:e.message});}
});
router.post('/',async(req,res)=>{
  try{res.status(201).json(await new Member(req.body).save());}
  catch(e){res.status(400).json({message:e.message});}
});
router.put('/:id',async(req,res)=>{
  try{res.json(await Member.findByIdAndUpdate(req.params.id,req.body,{new:true}));}
  catch(e){res.status(400).json({message:e.message});}
});
router.delete('/:id',async(req,res)=>{
  try{await Member.findByIdAndDelete(req.params.id);res.json({message:'Deleted'});}
  catch(e){res.status(500).json({message:e.message});}
});
module.exports=router;
