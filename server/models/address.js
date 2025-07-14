import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        min: 3,
        max: 30
    },
    addressType: {
        type: String,
        enum : ["WORK", "HOME"],
        required: true,
    },
    pinCode: {
        type: String,
        min: 6,
        max: 6,
        required: true,
    },
    addressLine1: {
        type: String,
        required: true,
    },
    locality: {
        type: String,
        required: true,
    },
    landmark: {
        type: String,
        required: true,
    },

});

const addressModel = mongoose.models.address || mongoose.model('address', addressSchema);

export default addressModel;