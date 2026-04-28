const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        unique:[true,"name is already registered"],
        trim:true,
    },
    image:{
        type:String,
        //required:[true,"image is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true,
        validate:{
            validator:function(v){
                return v.includes("@");
            },
            message:"@ required in email"
        }
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"Password must be at least 6 characters"],
    },
    confirm_password:{
        type:String,
        required:[true,"password is required"],
        minlength:[6,"password must be at least 6 characters"],
    },
    phone:{
        type:String,
        required:[true,"phone no is required"],
        minlength:[10,"phone number must be 10 digits"],
        maxlength:[10,"phone number must be 10 digits"]
    },
    address:{
        street:{
            type:String,
            required:[true,"street is required"],
            trim:true
        },
        city:{
            type:String,
            required:[true,"city is required"],
            trim:true
        },
        state:{
            type:String,
            required:[true,"state is required"],
            trim:true
        },
        pincode:{
            type:String,
            required:[true,"state is required"],
            match:[/^[0-9]{6}$/,"Invalid pincode"]
        },
        country:{
            type:String,
            default:"India"
        }   
    }
})