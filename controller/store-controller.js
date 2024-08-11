const asyncHandler = require('express-async-handler');
const Store = require('../models/store-model');
const SellerDocuments = require('../models/seller-documents');



const createStore = asyncHandler(async(req,res) => {
    try {
        const userId =  req.user._id;
        const {name,description,address,category,contactNo,longitude,latitude,subCategory} = req.body;

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


//  submit documents and in frontend post to both the at same time 
// create store and submit documents
const submitDocuments = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.files || !req.files['panCard'] || !req.files['storeRegistration'] || !req.files['identityCard']) {
            return res.status(400).json({ message: "Please upload all required documents." });
        }

        const panCard = req.files['panCard'][0].path;
        const storeRegistration = req.files['storeRegistration'][0].path;
        const identityCard = req.files['identityCard'][0].path;

        const existingSeller = await SellerDocuments.findOne({ userId });
        if (existingSeller) {
            return res.status(400).json({ message: "You've already submitted the documents. Please wait for verification." });
        }

        const newDocument = new SellerDocuments({
            userId,
            panCard,
            storeRegistration,
            identityCard,
            submittedAt: new Date()
        });

        await newDocument.save();
        res.status(200).json({ message: "Will contact you soon. Please check your email!" });
    } catch (error) {
        console.error("Error submitting documents:", error);
        res.status(500).json({ error: error.message });
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


module.exports = {createStore,submitDocuments,getStoreDetail};