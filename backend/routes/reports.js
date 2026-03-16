const express=require('express'),router=express.Router(),Member=require('../models/Member'),auth=require('../middleware/auth');
const pop='district union assembly area administration position';

router.get('/biography',auth,async(req,res)=>{
  try{
    const{search}=req.query; let q={};
    if(search)q.$or=[{name:{$regex:search,$options:'i'}},{phone:{$regex:search,$options:'i'}},{voterId:{$regex:search,$options:'i'}}];
    res.json(await Member.find(q).populate(pop).sort({name:1}));
  }catch(e){res.status(500).json({message:e.message});}
});

router.get('/category',auth,async(req,res)=>{
  try{
    const{district,assembly,administration,position,area,union}=req.query; let q={};
    if(district)q.district=district; if(assembly)q.assembly=assembly;
    if(administration)q.administration=administration; if(position)q.position=position;
    if(area)q.area=area; if(union)q.union=union;
    res.json(await Member.find(q).populate(pop).sort({name:1}));
  }catch(e){res.status(500).json({message:e.message});}
});

router.get('/stats',auth,async(req,res)=>{
  try{
    const total=await Member.countDocuments();
    const byPosition=await Member.aggregate([
      {$group:{_id:'$position',count:{$sum:1}}},
      {$lookup:{from:'positions',localField:'_id',foreignField:'_id',as:'pos'}},
      {$project:{name:{$arrayElemAt:['$pos.name',0]},count:1}},{$sort:{count:-1}}
    ]);
    const byDistrict=await Member.aggregate([
      {$group:{_id:'$district',count:{$sum:1}}},
      {$lookup:{from:'districts',localField:'_id',foreignField:'_id',as:'dist'}},
      {$project:{name:{$arrayElemAt:['$dist.name',0]},count:1}},{$sort:{count:-1}}
    ]);
    res.json({total,byPosition,byDistrict});
  }catch(e){res.status(500).json({message:e.message});}
});

module.exports=router;
