const mongoose = require('mongoose');

const serviceSchema =new mongoose.Schema({
    title:{
        type:String,
        required:[true,"title is required"],
        trim:true
    },
    description:{
        type:String,
        required:[true,"description is required"]
    },
    category:{
        type:String,
        required:[true,"category is required"],
        enum:[
            "Plumbing","Electrical","Cleaning","Carpentry","AC Repair","Painting",
        ],
    },
    price:{
        type:Number,
        required:[true,"price is required"],
    },
    discount_price:{
        type:Number,
        default:0
    },
    duration:{
        type:String,
    },
    image:{
        type:String
    },
    videos:{
        type:String
    },
    rating:{
        type:Number,
        default: 0,
    },
    total_reviews:{
        type:Number,
        default: 0,
    },
    is_active:{
        type:Boolean,
        default:true
    },
    is_deleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type:Date,
        default:null
    },
});

module.exports = mongoose.model("Service",serviceSchema)