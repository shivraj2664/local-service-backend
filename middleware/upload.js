const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        let folder = 'uploads';

        const type = req.query.type;

        if(type === "service"){
            folder = "uploads/service";
        }else if(type === "user"){
            folder = "uploads/user";
        }

        if(file.mimetype.startsWith('image')){
            folder += "/image";
        }else if(file.mimetype.startsWith('video')){
            folder += "/video";
        }

        console.log("TYPE:",type);
        console.log("FOLDER:",folder);

        cb(null,folder);      
    },
    filename:function(req,file,cb){
        cb(null,"server-"+file.originalname);
    },
});

const uploadImage = multer({
    storage,
    limits:{fileSize:10 * 1024 * 1024},
});

const uploadVideo = multer({
    storage,
    limits:{fileSize:100 * 1024 * 1024}
})

const upload = multer({ storage: storage });
module.exports = { uploadImage, uploadVideo };