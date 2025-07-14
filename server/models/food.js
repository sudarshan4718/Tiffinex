import mongoose from "mongoose"

const foodSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    isVeg:{
        type:Boolean,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    provider:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'providers'
    },
    image:{
        type:String
    },
    description:{
        type:String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1,
    }
})

const foodModel = mongoose.models.foods || mongoose.model('foods', foodSchema);

export default foodModel;