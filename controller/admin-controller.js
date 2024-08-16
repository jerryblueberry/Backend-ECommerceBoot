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
        const requests = await SellerDocuments.find({status:'Pending'}).populate('userId','name profilePicture');
        res.status(200).json({requests});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

//  Update the request seller status to seller 
const updateStatusToSeller = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params; // ID of the user whose status is being updated
        const { adminComments } = req.body; // Admin comments to add

        // Find the user and seller documents
        const user = await User.findById(userId);
        const sellerVerify = await SellerDocuments.findOne({ userId });

        // Check if the seller document exists
        if (!sellerVerify) {
            return res.status(404).json({ message: 'Seller documents not found' });
        }

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the status and comments
        sellerVerify.status = 'Verified';
        sellerVerify.adminComments = adminComments || sellerVerify.adminComments; // Add comments if provided
        user.role = 'seller';

        // Save changes
        await user.save();
        await sellerVerify.save();

        res.status(200).json({ message: 'Status updated to Seller' });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = {getAllUser,getAllRequest,updateStatusToSeller}