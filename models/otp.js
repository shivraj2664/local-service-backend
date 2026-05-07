const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    otp:{
        type:String,
        required:true
    },
    is_active:{
        type:Boolean,
        default:true,
        required: [true,"is_active or not status is required"],  
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        default:null
  }
},
  { timestamps: true }
)
module.exports = mongoose.model("Otp", otpSchema);