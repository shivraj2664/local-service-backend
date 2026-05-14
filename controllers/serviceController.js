const Service = require("../models/service.js");

exports.createService = async(req,res)=>{
    try{
        // const{title,description,category,price,discount_price,duration}=req.body;

        const service = await Service.insertMany(req.body);
        // [{
        //     title,description,category,price,discount_price,duration
        // }]

        return res.status(201).json({   
            success:true,
            message:"service created successfully",
            data:service
        });
    }   catch(error){
            return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}

exports.getAllServices = async(req,res)=>{
    try{
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 5;

        const skip = (page - 1) * limit;

        const totalServices = await Service.countDocuments({
            is_deleted : false
        });

        const services = await Service.find({ is_deleted:false})
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            totalServices,
            currentPage: page,
            totalPages: Math.ceil(totalServices / limit),
            services
        });
    }   catch(error){
        res.status(500).json({
            message:"error fetching services",
            error: error.message
        });
    }
}
exports.getServiceByName = async(req,res)=>{
    const services = await Service.findOne({title:req.params.title});
    res.json(services);
}

exports.getServiceById = async(req,res)=>{
    const services = await Service.findById(req.params.id);
    res.json(services);
}


exports.updateService