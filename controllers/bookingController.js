const Booking  = require("../models/booking.js");

exports.createBooking = async(req,res)=>{
    try{
        const userId = req.user.id;

        const {
            service,
            bookingDate,
            bookingTime,
            address,
            mobileNumber,
        } = req.body;

        const booking = await Booking.create({
            user:userId,
            service,
            bookingDate,
            bookingTime,
            address,
            mobileNumber
        });

        res.status(201).json({
            success:true,
            message:"service booked successfully",
            booking 
        })
    }   catch(error){
        console.log(error);

        res.status(500).json({
            success:false,
            message:"Booking Failed"
        });
    }
};