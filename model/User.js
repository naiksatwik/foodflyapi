const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String, unique:true},
    password:{type:String,required:true},
},{
    collation:"User"
})

mongoose.model('User',UserSchema)


