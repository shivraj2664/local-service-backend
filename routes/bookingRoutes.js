const express = require("express");
const bookingController = require("../controllers/bookingController.js");
const { auth } = require("../middleware/auth.js")
const router = express.Router();

router.post("/createBooking",auth ,bookingController.createBooking);

module.exports = router
