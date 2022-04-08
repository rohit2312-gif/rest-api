require("./src/db/mongoose")
const Task=require("./src/models/task")


Task.findByIdAndDelete("6223cf5225a499a3a836750e").then((task)=>{

        
    console.log(task)

    return Task.countDocuments({completed:true}).then((count)=>{

        console.log(count)
    }).catch((e)=>{

        console.log(e)
    })

})