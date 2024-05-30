const asyncHandler = require('express-async-handler');
const Store = require('../models/store-model');



const createStore = asyncHandler(async(req,res) => {
    try {
        const userId =  req.user._id;
        const {name,description,address,category,contactNo,longitude,latitude} = req.body;

        if(!name || !description || !address || !category || !contactNo || !longitude || !latitude){
            return res.status(400).json({error:"All fields are required"});
        }
        const type = "Point";
        let logo = req.file?req.file.path:null

        const newStore = new Store({
            userId:userId,
            name,
            description,
            address,
            logo:logo||null,
            category:category.toLowerCase(),
            contactNo,
            location:{
                type,
                coordinates:[longitude,latitude]
            }

        });
        await newStore.save();
        res.status(200).json({message:"Store Created Succesfully"});

       


    } catch (error) {
        console.log("Error Occurred While creating Store",error);
        res.status(500).json({error:error.message});
    }
});






const getStoreDetail = asyncHandler(async(req,res) => {
    try {
        const storeId = req.params.storeId;
        if(!storeId){
            return res.status(400).json({error:"All fields Required"});
        }

        const store = await Store.findById(storeId).populate("userId","name email password profilePicture");
        res.status(200).json({store});
    } catch (error) {
        console.log("Error OCcurred While getting store detail",error);
        res.status(500).json({error:error.message});
    }
});

//  nearby store


module.exports = {createStore,getStoreDetail};