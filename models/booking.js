const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user_id is required"]
    },
    service:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service",
        required:[true,"service_id is required"]
    },
    bookingDate:{
        type:String,
        required:[true,"booking date is required"]
    },
    bookingTime:{
        type:String,
        required:[true,"booking time is required"]
    },
    address:{
        type:String,
        required:[true,"address is required"],
        trim:true
    },
    mobileNumber:{
        type:String,
        required:true
    },
    bookingStatus:{
        type:String,
        enum:["Pending","Confirmed","Completed","Cancelled"],
        default:"Pending"
    },
}, {timestamps: true});

module.exports = mongoose.model("Booking",bookingSchema);