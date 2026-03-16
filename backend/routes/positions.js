const express=require('express'),r=express.Router(),{Position}=require('../models/Masters'),auth=require('../middleware/auth');
r.get('/',async(req,res)=>{try{res.json(await Position.find().sort({name:1}));}catch(e){res.status(500).json({message:e.message});}});
r.post('/',auth,async(req,res)=>{try{res.status(201).json(await new Position({name:req.body.name}).save());}catch(e){res.status(400).json({message:e.message});}});
r.put('/:id',auth,async(req,res)=>{try{res.json(await Position.findByIdAndUpdate(req.params.id,{name:req.body.name},{new:true}));}catch(e){res.status(400).json({message:e.message});}});
r.delete('/:id',auth,async(req,res)=>{try{await Position.findByIdAndDelete(req.params.id);res.json({message:'Deleted'});}catch(e){res.status(500).json({message:e.message});}});
module.exports=r;
