const User = require("../models/user.js")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


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