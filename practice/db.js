//CRUD


//const mongodb=require("mongodb");
//const MongoClient=mongodb.MongoClient;
const {MongoClient,ObjectID, ObjectId}=require("mongodb")
const connectionUrl="mongodb://127.0.0.1:27017"
const databasName='task-manager'

MongoClient.connect(connectionUrl,{useNewUrlParser:true},(err,client)=>{

    if(err)
    return console.log("error")

const db=client.db(databasName)

// db.collection("users").findOne({name:'Rohit'},(error,result)=>{

//     if(error)
//     return console.log("Error")

//     return console.log(result)
// })
// db.collection("tasks").findOne({_id: new ObjectId("6220fba9b7d38e0abb91eeda")},(error,result)=>{
// if(error)
// return console.log(error)
// console.log(result)
// })
// db.collection("tasks").find({completed:true}).toArray((error,result)=>{

//    // if(error)
//   //  return console.log(error)
//     console.log(result)
// })
// db.collection("tasks").updateMany({completed:false},{
//     $set:{
//         completed:true
//     }
// }).then((result)=>{
//             console.log(result)
//         }).catch((error)=>{
//             console.log(error)
//         })


db.collection("tasks").deleteOne({

    _id:new ObjectId("6220fba9b7d38e0abb91eeda")
}).then((result)=>{

    console.log(result)
}).catch((err)=>{

    console.log(err)
})
})

