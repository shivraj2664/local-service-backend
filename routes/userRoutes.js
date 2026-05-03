const express = require("express");
const userController = require("../controllers/userController.js")
const router = express.Router();

router.post("/registerUser",userController.createUser);

module.exports = router