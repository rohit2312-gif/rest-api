const express=require('express')
require('./db/mongoose.js')
const bcrypt=require("bcrypt")
const User=require('./models/user')
const Task=require('./models/task')
require('dotenv').config()


const app=express()

const port=process.env.PORT
const jwt=require('jsonwebtoken')




app.use(express.json()),
app.use(require("./routers/tasksroute"))
app.use(require("./routers/userroute"))

app.get("/",(req,res)=>{

    res.send('Hello ther');
})
app.get("*",(req,res)=>{


    res.status(404).send();
})



app.listen(port,()=>
{
    console.log('Listening on port'+port)
})

func=async ()=>{

     //const task=await Task.findById("6247316a6dd88a0677af70f3")
//     await task.populate("author")
// console.log(task.author)


//const user=await User.findById('623ccf4a3839f9c6a3ad41cd')
//await user.populate('tasks')
//console.log(user.tasks)
}

//func();


