
const mongoose=require('mongoose')

const ProductSchema=new mongoose.Schema({
     product:{type:Array,required:true},
     item:{type:Number,required:true}
},{
    collation:"Products",
    timestamps:true,
})

mongoose.model('Products',ProductSchema)