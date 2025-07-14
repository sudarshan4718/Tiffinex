import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min:3,
        max: 30,
    },
    tiffinName: {
        type: String,
        required: true,
        min:9,
        max: 30,
    },
    address:
    {
       type: mongoose.Schema.Types.ObjectId,
      ref: "address",
    },
    phoneNumber : {
        required: true,
        type: Number,
        min:10,
        max:10
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    rating:{
        type:String,
        default: "0"
    },
    isAuthorized:{
        type:Boolean,
        default: false
    },
    providerLogo:{
        type:String
    },
    verifyOtp : {
        type: String,
        default: ""
    },
    verifyOtpExpireAt : {
        type: Number,
        default: 0
    },
    resetOtp : {
        type: String,
        default: ""
    },
    resetOtpExpireAt : {
        type: Number,
        default : 0,
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    }
})

const providerModel = mongoose.models.providers || mongoose.model('providers', providerSchema);

export default providerModel;