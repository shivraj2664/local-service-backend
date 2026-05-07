const jwt = require("jsonwebtoken");

exports.auth = async(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader){
            return res.status(401).json({
                success:false,
                message:"Token missing",
            });
        }

        const token = authHeader.split(" ")[1];//Bearer token
        console.log("TOKEN:", token);
        const decoded = jwt.verify(token,"secretkey");
        console.log("DECODED:", decoded);
        req.user = decoded;
        next();
    }   

    catch(error){
        console.log("ERROR:", error.message);
        return res.status(401).json({
            success:false,
            message:"Ivalid token"
        });
    }
}