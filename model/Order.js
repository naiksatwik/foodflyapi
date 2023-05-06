const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    email:{type:String, unique:true},
    order_data: { type: Array,required: true},
    address: {type:String,required:true},
    phone: {type:String,required:true},
    paymentType: { type: String, default:"COD"},
    status:{type:String, default:'Order_Placed'}
  },
  {
    collation: "UserOrder",
    timestamps:true
  }
);

mongoose.model("UserOrder", OrderSchema);


