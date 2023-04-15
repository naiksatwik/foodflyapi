const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String, unique:true},
    password:{type:String,required:true},
    address:{type:String,required:true},
    phone:{type:String,required:true},
},{
    collation:"User",
    timestamps:true,
})

mongoose.model('User',UserSchema)


