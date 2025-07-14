import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    provider:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'providers'
    },
    food:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"foods",
        required:true
    },
    date:{
        type:String,
        required:true
    },
    time:{
        type:String,
    },
    address:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
        extra: {
        type: Map,
        of: String, 
        default: {}
        },
    totalAmount:{
        type:Number,
        required:true,
    },
    paymentMode:{
        type:String,
        enum:["COD", "Online"],
        default:"Online"
    },
    paymentStatus:{
        type:String,
        enum:["Pending","Success","Failed"]
    },
    orderStatus:{
        type:String,
        enum:["Ordered","Confirmed","Cancelled"],
        default:"Ordered"
    }
    
},
{timestamps:true}
)

const orderModel = mongoose.models.orders || mongoose.model('orders', orderSchema);

export default orderModel;