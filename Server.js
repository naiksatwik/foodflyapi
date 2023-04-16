const express=require('express')
const mongoose=require('mongoose')
const app=express();
const cors=require('cors')
const bcrypt=require('bcryptjs')
const jwt =require('jsonwebtoken')
const  ObjectId = require('mongodb').ObjectId;
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
require('./model/Product')


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
    const {name,email,password,address,phone}=req.body;
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
            password:encryptPassword,
            address,
            phone,
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
                address:registeredEmail.address,
                phone:registeredEmail.phone
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

//user Order data
const UserOrder =mongoose.model('UserOrder');
app.post('/api/orderData',async(req,res)=>{
     const {email,order_data,address,phone,order_date}=req.body;
     console.log("address:",address)
     console.log("phone:",phone)
  
     await  order_data.splice(0,0,{order_date:order_date})
    // await order_data

     let emailId=await UserOrder.findOne({email});

     if(emailId == null){
        try{
           await UserOrder.create({
                email,
                order_data,
                address,
                phone
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
app.post('/api/myOrder',async(req,res)=>{
    const {email}=req.body
  try{
    let myData= await UserOrder.findOne({email});
    res.json({
        order_data:myData
    })
  }catch(err){
    res.send({
        mess:"Internal Server Error"
    })
  }
})

// product api
const Products= mongoose.model('Products') 
app.post('/api/products',async(req,res)=>{
    const {product,item}= req.body;

    try{
        await Products.create({
            product,
            item,
        })

        res.send({
            status:"ok"
        })
    }catch(err){
        res.send({
            mess:err
        })
    }
})
app.get('/api/products',async(req,res)=>{
    //  let data=Products.find({ "_id" :"643bb4bb39182745f0fe63d3"})
 
       await  Products.findById(new ObjectId("643b99bc84c5083ba4bd018d"))
          .then(doc => {
            res.send({
                data:doc.product,
            })
          })
          .catch(err => {
            console.log(err);
          });
})
app.post('/api/addProduct',async(req,res)=>{
    const {name,category,image,price,noItem}=req.body;
    let data={
        name,
        category,
        image,
        price,
        noItem
    }

    try{
        await Products.findByIdAndUpdate(new ObjectId("643b99bc84c5083ba4bd018d"),{
            $push:{product:data}}).then(()=>{
                res.send({
                    mess:"product is updated...",
                    status:"ok"
                })
            })
    }catch(err){
        res.send({
            mess:"Internal Server Error"
        })
    }
})