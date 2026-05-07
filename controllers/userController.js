const User = require("../models/user.js")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Otp = require("../models/otp.js");
const otpGenerator = require("otp-generator");
const sendEmail = require("../utils/sendEmail.js");


exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirm_password,
      phone,
      image,
      address
    } = req.body;

    if (password !== confirm_password) {
      return res.status(400).json({
        message: "Password and Confirm Password must match"
      });
    }

    // if (!email.includes("@")) {
    //   return res.status(400).json({
    //     message: "@ required in email"
    //   });
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      confirm_password: hashedPassword,
      phone,
      image,
      address
    });

    res.status(201).json({
      message: "User Created Successfully",
      data: user
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(val => val.message);

      return res.status(400).json({
        message: errors
      });
    }

    res.status(500).json({
      message: error.message
    });
  }
};

exports.getUsers = async(req,res)=>{
  try{
    const page= parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 5;

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments({ is_deleted:false })

    const users = await User.find().select("-password").skip(skip).limit(limit)

    res.status(200).json({
      message:"User fetched successfully",
      totalUsers,
      currentPage:page,
      totalPages:Math.ceil(totalUsers / limit),
      data:users
    })
  } catch(error){
    res.status(500).json({
      error:error.message
    })
  }
};

exports.updateUser = async(req,res)=>{
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new:true}
  );
  res.json(user);
};

exports.deleteUser = async(req,res)=>{
  await User.findByIdAndDelete(req.params.id);
  res.json({message:"User deleted successfully"});
}

exports.softDeleteUser = async(req,res)=>{
  try{
    const{id}=req.params;
    const users = await User.findByIdAndUpdate(id,
      {
        is_deleted:true,
        is_active:false,
        deletedAt:new Date()
      },
      {new:true}
    );
    if(!users){
      return res.status(404).json({message:"User not found"});
    }
    res.json({message:"successfully soft deleted",
              data:users});
  }catch(error){
    res.status(500).json({error:error.message});
  }
};

// exports.restoreUser = async(req,res)=>{
  
//     const {id}=req.params;
//     const user = await User.findByIdAndUpdate(id,
//       {
//         is_active:true,
//         is_deleted:false,
//         deletedAt:null
//       },
//       {new:true}
//     );
//     res.json({message:"User restored",
//             data:user}) 
// }

exports.restoreUser = async(req,res)=>{
  try{
  const {id}=req.body;

  if(!id){
    return res.status(400).json({
      message:"user id is required"
    });
  }

  const user = await User.findById(id);

  if(!user){
    return res.status(404).json({
      message:"user not found"
    });
  }

  if(user.is_active === false && user.is_deleted === true){

    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        is_active:true,
        is_deleted:false,
        deletedAt:null
      },
      {new:true}
    );
    return res.json({
      message:"user restored successfully",
      data: updateUser
    });
  }
  return res.status(400).json({
    message:"user is already active, cannot restore"
  });
 } catch(error){
  res.status(500).json({
    error:error.message
  });
}
}

exports.loginUser = async(req,res)=>{
  try{
    const {email,password}=req.body;

    if(!email || !password){
      return res.status(400).json({
        success:false,
        message:"Email and Password are required"
      })
    }

    const user = await User.findOne({email});

    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
      return res.status(400).json({
        success:false,
        message:"invalid password"
      })
    }

    if(user.token){
      try{
        jwt.verify(user.token,"secretkey");
        return res.status(200).json({
          success:true,
          message:"login successfully",
          token:user.token,
          user
        });
      }catch (err){
        //
      }
    }

    const token = jwt.sign(
      {id:user._id},
      "secretkey",
      {expiresIn:"7d"}
    );

    user.token = token;
    await user.save();

    res.status(200).json({
      success:true,
      message:"Login successfully",
      token,
      user
    });

  } catch(error){
    res.status(500).json({
      success:false,
      message:"login error",
      error:error.message
    })
  }
}

exports.logoutUser = async(req,res)=>{
  try{
    const userId = req.user.id;
    
    await User.findByIdAndUpdate(userId,{token:null});

    return res.status(200).json({
      success:true,
      message:"Logout successfull"
    });
  } catch(error){
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}

exports.forgotPassword = async(req,res)=>{
  try{
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    }

    if(!user.is_active || user.is_deleted){
      return res.status(400).json({
        success:false,
        message:"user is inactive or deleted"
      })
    }

    const otp = otpGenerator.generate(6,{
      digits:true,
      alphabets:false,
      upperCase:false,
      specialChars:false
    });

    await Otp.create({
      userId:user._id,
      otp,
      expireAt:Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(user.email,"password reset otp",otp);

    return res.status(200).json({
      success:true,
      message:"otp sent successfully"
    })
  } catch(error){
    return res.status(500).json({
      success:false,
      message:error.message
    });
  }
}


exports.verifyOtp = async(req,res)=>{
  try{
    const {email,otp}=req.body;

    const user = await User.findOne({ email });

    if(!user){
      return res.status(400).json({
        success:false,
        message:"User not found"
      })
    }

    const otpRecord = await Otp.findOne({
      userId:user._id,
      otp
    });

    if(!otpRecord){
      return res.status(400).json({
        message:"Invalid otp"
      })
    }

    if(otpRecord.expireAt < Date.now()){
      return res.status(400).json({
        message:"Otp expired"
      })
    }

    user.isOtpVerified = true;
    await user.save();

    return res.status(200).json({
      message:"otp verified"
    });
  } catch(error){
    res.status(500).json({message:error.message})
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { email,newPassword,confirmPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if(newPassword !== confirmPassword ){
      return res.status(400).json({
        message:"Passwords do not match"
      })
    }

    if(!user.isOtpVerified){
      return res.status(400).jsno({
        message:"OTP not verified"
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.isOtpVerified = false;  
    await user.save();

    await Otp.deleteMany({ userId: user._id });

    return res.status(200).json({

      success: true,
      message: "Password reset successful"
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.changePassword = async(req,res)=>{
  try{
    const  userId =req.user.id;
    const {oldPassword,newPassword,confirmPassword}=req.body;

    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({
        message:"user not found"
      })
    }
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    console.log("MATCH:", isMatch);

    if(!isMatch){
      return res.status(400).json({
        message:"Old password is incorrect"
      });
    }

    if(newPassword !== confirmPassword){
      return res.status(400).json({
        message:"new passwords do not match"
      })
    }

    const hashedPassword = await bcrypt.hash(newPassword,10);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      success:true,
      message:"Password changed successfully"
    })
  } catch(error){
    return res.status(500).json({
      message:error.message
    });
  }
}