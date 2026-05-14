const express = require('express');
const router = express.Router();

const { uploadImage, uploadVideo } = require("../middleware/upload.js");

router.post("/upload-image",(req,res)=>{
    uploadImage.single("file")(req,res,function(err){
        if(err){
            if(err.code === "LIMIT_FILE_SIZE"){
                return res.status(400).json({
                    success:false,
                    message:"image must be less than or equal to 10MB"
                });
            }
            return res.status(400).json({
                success:false,
                message:err.message
            })
        }
        try{
            const cleanPath = req.file.path.replace(/\\/g,"/");
            const fileUrl = `${req.protocol}://${req.get("host")}/${cleanPath}`;

            const fileData = {
                ...req.file,
                path: cleanPath,
                url: fileUrl, 
            };

            return res.status(200).json({
                success : true,
                message : "Image uloaded successfully ",
                file : fileData
        });
        } catch(err){
            return res.status(500).json({
                success:false,
                message:err.message
            });
        }
    });
});

router.post("/upload-video",(req,res)=>{
    uploadVideo.single("file")(req,res,function(err){
        if(err){
            if(err.code === "LIMIT_FILE_SIZE"){
                return res.status(400).json({
                    success:false,
                    message:"Video must be less than or equal to 10MB"
                });
            }
            return res.status(400).json({
                success:false,
                message:err.message
            })
        }
        try{
            const cleanPath = req.file.path.replace(/\\/g,"/");
            const fileUrl = `${req.protocol}://${req.get("host")}/${cleanPath}`;

            const fileData = {
                ...req.file,
                path: cleanPath,
                url: fileUrl, 
            };

            return res.status(200).json({
                success : true,
                message : "Video uloaded successfully ",
                file : fileData
        });
        } catch(err){
            return res.status(500).json({
                success:false,
                message:err.message
            });
        }
    });
});

module.exports = router;