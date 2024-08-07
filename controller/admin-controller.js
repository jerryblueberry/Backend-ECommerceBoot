const asyncHandler = require("express-async-handler");
const User = require('../models/user-model')


//  get all the user
const getAllUser = asyncHandler(async(req,res) => {

    try {
       
        const users = await User.find({role:'user'}).select('-password');
        const sellers   = await User.find({role:"seller"}).select('-password');
        res.status(200).json({users,sellers});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

module.exports = {getAllUser}