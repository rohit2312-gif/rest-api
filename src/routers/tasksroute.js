const express=require("express")
const Task=require("../models/task")
const routers=express.Router()
const auth=require("../middleware/auth")


//GET /tasks
routers.get("/tasks",auth,async(req,res)=>{
const match={}
var sortby=0
if(req.query.completed){
    
    if(match.completed=req.query.completed==="true")
    match.completed=true
}
if(req.query.sortBy){

    const parts=req.query.sortBy.split(':')
    console.log(parts)
    sortby=parts[1]==="desc"?-1:1
}
//else{
  //  match.completed=false
//}
    try{
        await req.user.populate({path:'tasks',match,options:{

            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort:{
                completed:sortby
            }
        }})
//const tasks=await Task.find({author:req.user._id})
//console.log(tasks)
//if(tasks.length===0)
//return res.status(404).send()

    res.status(200).send(req.user.tasks)
}catch(e){

    res.status(401).send(e)
}

})
routers.delete("/tasks:id",auth,async(req,res)=>{


try{


    const task=Task.findOneAndDelete({_id:req.params.id,author:req.user._id})
    if(!task){
        return res.status(404).send()
    }
    res.send(task)
}

catch(e){
    res.status(500).send(e)
}

})
routers.patch("/tasks/:id",auth,async(req,res)=>{

const updates=Object.keys(req.body)
const allowedUpdates=['description','completed']

const isValid=updates.every((up)=>allowedUpdates.includes(up))
console.log(isValid)
if(!isValid)
return res.send("invalid params").status(400)

    try{

        const task=await Task.findOne({_id:req.params.id,author:req.user._id})


        if(!task){
            console.log('as')
            return res.status(404).send()
        }
        updates.forEach((u)=>task[u]=req.body[u])
            //const task=await Task.findByIdAndUpdate(req.params._id,req.body,{new:true,runValidators:true})
            
            await task.save()
            res.send(task)
    }catch(e){
            res.status(500).send(500)
    }
})

routers.get("/tasks/:id",auth,async(req,res)=>{

    const _id=req.params.id
    try{
    tasks=await Task.findOne({_id,author:req.user._id});
    if(!tasks)
    res.status(404).send()

    res.status(201).send(tasks)
    
    }catch(e){
    
        res.status(401).send(e)
    }
})


routers.post("/tasks",auth,async (req,res)=>{


const task=new Task({
    ...req.body,
author:req.user._id,
})
try{
await task.save()
res.status(201).send()
}
catch(e){
res.status(400).send(task)

}
})
module.exports=routers