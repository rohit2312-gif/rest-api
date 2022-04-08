const express=require("express")
const bodyParser=require('body-parser')
const User=require("../models/user")
const auth=require('../middleware/auth')
const routers=express.Router()
const sharp=require('sharp')
const credentials=require('../emails/account')
const credentials1=require('../emails/goodbye')
const multer=require('multer')
const app=express()

const upload=multer(
    {
    
        limits:{
            fileSize:10000000
        },
        fileFilter(req,file,cb){
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
                return cb(new Error("Upload valid file"))
            }

            cb(undefined,true)
        }
    }
)
routers.get("/users/me",auth,async (req,res)=>{

    // User.find({}).then((users)=>{
    //     res.send(users)
    // }).catch((e)=>{
    
    //     res.send(e);
    // })    
    try{
           // console.log(req.user.name)
         //   const users=await User.find({});
        res.send(req.user);
    }
    
    catch(e){
    console.log(e);
    
    }
    
    })

    routers.post("/users/logoutall",auth,async (req,res)=>{

        try{
        req.user.tokens=[]
        await req.user.save()
res.status(200).send()
        }
        catch(e){
            res.status(500).send(e)
        }
    })
    routers.post("/users/logout",auth,async (req,res)=>{

        try{
            req.user.tokens=req.user.tokens.filter((tokens)=>{
              return tokens.token!==req.token
            })
            await req.user.save()
            res.status(201).send()
        }catch(e){
            res.status(500).send(e)
        }

    })

    routers.delete("/users/me/avatar/delete",auth,async (req,res)=>{
        try{    
        req.user.avatar=undefined
            await req.user.save()
            res.status(200).send({message:"avatar deleted successfully"})
        }catch(e){
            res.status(500).send()
        }
    })
    routers.post("/users/me/avatar",auth,upload.single('upload'),async (req,res)=>{
        const buffer=await sharp(req.file.buffer).resize({
            height:250,
            width:250
        }).png().toBuffer()
        req.user.avatar=buffer
       await req.user.save()
        res.send()
    },(err,req,res,next)=>{

        res.send({err:'upload an image'})
    })
    routers.get("/users/:id",async(req,res)=>{
    
        const _id=req.params.id;
        try{
        const users=await User.findById({_id})
            if(users)
            res.send(users)
            else
            res.status(400).send()
        }
        catch(e){
        
            res.status(500).send(e);
        }    
        
        })
            routers.get("/users/:id/avatar",async (req,res)=>{
               try{

                   const user=await User.findById(req.params.id)
                   if(!user || !user.avatar){
                       throw new Error()
                   }
                   res.set('Content-Type','image/png')
                   res.send(user.avatar)
               }
               catch(e){
            res.status(404).send()       
            }
            })
        routers.patch("/users/:id",async(req,res)=>{
            const updates=Object.keys(req.body)

            const allowedUpdates=['name','email','password','age']
            const isValid=updates.every((u)=> allowedUpdates.includes(u))

            console.log(isValid)
            try{

                        const user= await User.findById(req.params.id);
                        
                        updates.forEach((up)=>user[up]=req.body[up])




                //const user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
                                if(!user){
                                    return res.status(404).send()
                                }
                                user.save(),
                                res.status(201).send(user)
            }
            catch(e){
    
                res.status(400).send(e)
            }
        })
    routers.post("/users",async (req,res)=>{
    try{
        const user=new User(req.body)
                await user.save()
             credentials(user.email,user.name)
            const token=user.generateAuthToken()

        res.status(201).send({user,token})
    
    }catch(err){
        console.log(err)
    res.status(400).send(err)
    
    }
    //res.send("testing")
    })

    routers.post("/users/login",async(req,res)=>{


        try{
                  
          //  console.log(req.body.email)
            const user= await User.findByCredential(req.body.email,req.body.password)
            const token=await user.generateAuthToken()
            res.send({user,token})
         //   console.log(user)
            //if(!user){

            //}
           //return res.send(user)
        }
        catch(e){
console.log(e)
            res.status(400).send()
        }
    })
    routers.delete("/users/me",auth,async(req,res)=>{

       // const _id=req.params.id
        try{
            await req.user.remove()
credentials1(req.user.email,req.user.name)
        //const user=await User.findByIdAndDelete(_id)
        //if(!user){
         //  return res.status(\404).send()
       // }
        res.send(req.user)
        }catch(e){
            res.status(500).send(e)
        }
    
    })
    module.exports=routers    