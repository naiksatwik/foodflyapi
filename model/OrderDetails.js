const mongoose=require('mongoose')

const OrderSchema = new mongoose.Schema(
    {
      email:{type:String, unique:true},
      order_data: { type: Array,required: true},
      address: {type:String,required:true},
      userName:{type:String,required:true},
      phone: {type:String,required:true},
      status:{type:String, default:'Order_Placed'},
      Time:{type:String,required:true}
    },
    {
      collation: "OrderDetails",
      timestamps:true
    }
  );
  
  mongoose.model("OrderDetails", OrderSchema);
  


