const express = require("express");
const serviceController = require("../controllers/serviceController.js");
const router = express.Router();

router.post("/create-service",serviceController.createService);
router.post("/getAllServices",serviceController.getAllServices);
router.get("/getServiceByName/:title",serviceController.getServiceByName);
router.get("/getServiceById/:id",serviceController.getServiceById);

module.exports = router;