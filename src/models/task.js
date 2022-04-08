const mongoose=require('mongoose')
const validator=require('validator')


const taskschema=mongoose.Schema({

    description:{
        type:String,
        required:true

    },
    author:{

        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    completed:{
        type:Boolean,
        default:false,

    }
},{
    timestamps:true
})
const Task=mongoose.model("Task",taskschema)

module.exports=Task