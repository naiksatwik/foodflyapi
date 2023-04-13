const express=require('express')
const mongoose=require('mongoose')
const app=express();
const cors=require('cors')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')

const JWT_SECRET="vufyterityr56i448987r8@%$@$#^6787v_++69867338";


app.use(cors());
app.use(express.json());


// Our server
app.listen(5000,()=>{
    console.log("Server is started ...")
})


// importing from models
require('./model/User')
require('./model/Order')


// const MongoUrl='mongodb://127.0.0.1:27017/rest-api?authSource=admin&w=1'
const MongoUrl='mongodb+srv://codedefault555:Siddu@10@cluster0.4igv70x.mongodb.net/?retryWrites=true&w=majority'


mongoose.set('useFindAndModify',false);

// connect express to mongodb
mongoose.connect(MongoUrl,{
    useNewUrlParser:true
}).then(()=>{
    console.log('Connection Done ... ')
}).catch((err)=>{
    console.log(err)
})


//user info
const User=mongoose.model('User');
app.post('/api/register',async(req,res)=>{
    const {name,email,password}=req.body;
    user=email;
    const encryptPassword = await bcrypt.hash(password,10)
     try{
        const oldUser= await User.findOne({email});

         if(oldUser){
           return res.send({error:"User Exists"});
        }
        await User.create({
            name:name,
            email:email,
            password:encryptPassword
        })
        res.send({
            status:"ok"
        })
    }catch(err){
        res.send({
            status:err
        })
    }
})


app.post('/api/sign-in', async(req,res)=>{
    const {email,password}=req.body;
    const registeredEmail= await User.findOne({email});

    if(!registeredEmail){
        return res.send({
            error:"Email Not Exist"
        })
    }
    
    if(await bcrypt.compare(password,registeredEmail.password)){
        const token=jwt.sign({email:registeredEmail.email},JWT_SECRET);

        if(res.status(201)){
            return res.json({
                status:'ok',
                data:token,
                profile:registeredEmail.name,
                userId:registeredEmail._id,
            })
        }else{
            return res.json({
                error:"error"
            })            
        }
    }

    res.send({
        error:"invalid password"
    })
})


const UserOrder =mongoose.model('UserOrder');

app.post('/api/orderData',async(req,res)=>{
     const {email,order_data,phone,address}=req.body;
     await order_data.splice(0,0,{order_date:req.body.order_date})

     let emailId=await UserOrder.findOne({email});

     if(emailId == null){
        try{
           await UserOrder.create({
                email,
                order_data,
                phone:phone,
                address:address,
            })

            res.send({
                status:"ok"
            })
        }catch(err){
            res.send({
                mess:err
            })
        }
     }else{
        try{
            await UserOrder.findOneAndUpdate({email},
            {$push:{order_data}}).then(()=>{
                res.send({
                    mess:"Old User order Page is Updated",
                    status:"ok"
                })
            })
        }catch(err){
            res.send({
                mess:"Internal Server Error"
            })
        }
     }
})
