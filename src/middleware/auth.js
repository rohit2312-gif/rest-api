const jwt=require('jsonwebtoken')
const User=require('../models/user')


const auth=async(req,res,next)=>{
console.log(process.env.JWT_SECRET)
try{
    console.log('from auth')
    const token=req.header('Authorization').replace('Bearer ','')
     const decode=jwt.verify(token,process.env.JWT_SECRET)
     console.log(decode)
     const user=await User.findOne({_id:decode._id,"tokens.token":token})

     if(!user)
     throw new Error()
     else{
            console.log(user.email)
         req.user=user
         req.token=token
         next()
     }
 }
catch(e){
res.status(401).send({"error":"Please authenticate"})
}
}


module.exports=auth