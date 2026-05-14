const express = require("express");
const userController = require("../controllers/userController.js")
const { auth } = require("../middleware/auth.js")

const router = express.Router();

router.put("/test", (req, res) => {
  res.send("PUT working");
});

router.post("/registerUser",userController.createUser);
router.post("/getusers",userController.getUsers);
router.put("/updateUser/:id",userController.updateUser);
router.put("/softDeleteUser/:id",userController.softDeleteUser);
router.post("/restoreUser",userController.restoreUser);
router.post("/loginUser",userController.loginUser);
router.post("/logoutUser",auth,userController.logoutUser);
router.post("/forgot-password",userController.forgotPassword);
router.post("/verifyOtp",userController.verifyOtp);
router.post("/reset-password",userController.resetPassword);
router.post("/change-password",auth,userController.changePassword);

module.exports = router