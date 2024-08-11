const asyncHandler = require("express-async-handler");
const User = require('../models/user-model');
const SellerDocuments = require("../models/seller-documents");


//  get all the user
const getAllUser = asyncHandler(async(req,res) => {

    try {
       
        const users = await User.find({role:'user'}).select('-password');
        // const sellers   = await User.find({role:"seller"}).select('-password');
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});


//  get all the requested sellers
const getAllRequest = asyncHandler(async(req,res) => {
    try {
        const requests = await SellerDocuments.find().populate('userId','name profilePicture');
        res.status(200).json({requests});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

//  Update the request seller status to seller 
const updateStatusToSeller = asyncHandler(async(req,res) => {
    try {
        const {userId} = req.params;
        const user = await User.findById(userId);
        const sellerVerify = await SellerDocuments.findById(userId);
        if(!sellerVerify){
            return res.status(404).json({message:"User not found"});
        }
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        sellerVerify.status ="Verified";
        user.role = "seller"
        await user.save();
        await sellerVerify.save();
        res.status(200).json({message:"Status Updated to Seller"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

module.exports = {getAllUser,getAllRequest,updateStatusToSeller}