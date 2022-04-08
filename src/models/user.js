const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const Task=require('./task')

const userSchema=mongoose.Schema(


    {

        name:{
            type:String,
            required:true
        },
        password:{
            minlength:7,
        type:String,
        required:true,
        validate(value){
    if(validator.contains(value,"password"))
    throw new Error("password too weak")
        },
        },
        email:{
            unique:true,
            type:String,
            required:true,
            validate(value){
                if(!validator.isEmail(value))
                throw new Error("Invalid Email")
            }
        },
      
        age:{
            type:Number,
            validate(value){
    
                if(value<0){
                    throw new Error("Age cannot be negative")
                }
            }
        },
        tokens:[{

            token:{
                type:String,
                required:true
            }
        }],
        avatar:{
           type:Buffer
        }
    },{
        timestamps:true
    }
)


userSchema.virtual('tasks',{

    ref:'Task',
    localField:'_id',
    foreignField:'author'
})
userSchema.methods.toJSON=function(){

    const user=this
    const user_object=user.toObject()
    delete user_object.password
    delete user_object.tokens

   // console.log(JSON.stringify(user_object))
    return user_object
}
userSchema.methods.generateAuthToken = async function(){

    const user=this
    const token=jwt.sign({_id:user._id.toString()},'mnewproject')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

//LOGIN VALIDATOR
userSchema.statics.findByCredential=async (email,password) =>{

    const user=await User.findOne({email:email})

    if(!user)
    throw new Error("unable to login")

    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error("unable to login")

    }

    return user;




}
//
userSchema.pre('remove',async function(next){
const user=this
await Task.deleteMany({author:user._id})
next()

})
//HASHING PASSWORD
userSchema.pre("save",async function (next){

const user=this

console.log("just b4 saving")

if(user.isModified('password')){

    user.password=await bcrypt.hash(user.password,8)
}
next()

})


const User=mongoose.model('User',userSchema)

module.exports=User