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
        const {
            page = 1,
            limit = 5,
            category,
            maxPrice,
            rating,
            available
        } = req.body || {};


        const skip = (page - 1) * limit;

        let filter = {
            is_deleted: false,
            is_active: true
        };

        if(category && category !== "All"){
            filter.category = category
        }

        if(maxPrice){
            filter.price={
                $lte: Number(maxPrice),
            };
        }

        if(rating){
            filter.rating = {
                $gte: Number(rating),
            };
        }

        if(available === true){
            filter.is_active = true;
        }

        const totalServices = await Service.countDocuments(filter);

        const services = await Service.find(filter)
        .skip(skip)
        .limit(limit);

        res.status(200).json({
            success: true,
            totalServices,
            currentPage: Number(page),
            totalPages: Math.ceil(totalServices / limit),
            services,
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

exports.updateAll = async(req,res)=>{
    const services = await Service.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new:true}
    );
    res.status(201).json({
        success:true,
        message:"Data updated Successfully",
        data:services
    });
}

exports.updateRatings = async (req, res) => {
  try {

    const services = await Service.find();

    for (const service of services) {

      service.rating = (Math.random() * 2 + 3).toFixed(1);
      service.total_reviews = Math.floor(Math.random() * 500);

      await service.save();
    }

    res.status(200).json({
      success: true,
      message: "Ratings updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      error: error.message
    });

  }
};