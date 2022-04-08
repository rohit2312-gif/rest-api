const sgmail=require('@sendgrid/mail')
const sendgridapikey="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"

sgmail.setApiKey(sendgridapikey)
const welcomemail=(mail,name)=>{
sgmail.send({

   "to": mail,
   
"subject":"testing",
    "from":"rohitpunkjha@gmail.com",
    "text":'hello there'
}).then((result)=>{

    console.log(result)
}).catch((err)=>{
    console.log(err)
})
}

module.exports=welcomemail