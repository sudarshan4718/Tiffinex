import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min:3,
        max: 30,
    },
    address:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "address",
    },
    phoneNumber : {
        required: true,
        type: String,
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

const userModel = mongoose.models.users || mongoose.model('users', userSchema);

export default userModel;