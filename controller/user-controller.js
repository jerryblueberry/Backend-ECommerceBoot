const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const  generateOTP  = require('../utils/generateOtp');
const { sendSignupMail, sendForgotPasswordMail } = require('../utils/mailer');
const forgotPasswordOTP = require('../utils/forgotPasswordOtp');
const { tokenGenerate } = require('../utils/tokenGenerate');
const saltRounds = 10;


//  controller for signup
const registerUser  = asyncHandler(async(req,res) => {
    try {
        const {name,email,password,contactNo,longitude,latitude} = req.body;
        if(!name || !email || !password || !contactNo || !longitude || !latitude){
            return res.status(400).json({error:"All Fields are required"});
        }

        const exisitingUser = await User.findOne({email});

        if(exisitingUser){
            return res.status(401).json({error:"Email Already Exists!Instead Try Login"});
        }

        const hashedPassword = await bcrypt.hash(password,saltRounds);
        let profilePicture   = req.file?req.file.path:null;
        const role = "user";
        const type = "Point";
        const otp = generateOTP();
        const newUser = new User({
            name,
            email,
            password:hashedPassword,
            role,
            profilePicture:profilePicture||null,
            contactNo,
            OTP:otp,
            location:{
                type,
                coordinates:[longitude,latitude]
            }

        });

        await newUser.save();
        
        res.status(200).json({message:"Signed Up Successfully,We've sent you OTP to verify your account."})
         sendSignupMail(email,otp).catch(error => {
            console.error("Error sending email",error);
         });
    } catch (error) {
        console.log("Error Occurred",error.message);
        res.status(500).json({ error:error.message});
    }
})



// endpoint to verify users account status 

const verifyStatus = asyncHandler(async(req,res) => {
    try {
        const {email,otp} = req.body;
        if(!email || !otp){
            return res.status(400).json({error:"Email & OTP both are required"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({error:"User not found"});
        }
        if(user.OTP.toString() !== otp.toString()){
            return res.status(402).json({error:"OTP didn't match"});
        }
        user.status = true;
        await user.save();
        res.status(200).json({message:"OTP Verified, Status Updated"});
    } catch (error) {
        console.log("Error Occured While updating status ",error);
        res.status(500).json({error:error.message});
    }
});



//  endpoint for forgot password
const forgotPassword = asyncHandler(async(req,res) => {
    try {
        const {email} = req.body;

        if(!email ){
            return res.status(400).json({error:"Email is Required"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({error:"User not found"})
        }

       const newOTP = forgotPasswordOTP();
       user.OTP = newOTP;
       await user.save();
       res.status(200).json({message:"We've sent you OTP for password reset"});
        sendForgotPasswordMail(email,newOTP).catch(error => {
            console.error("Error sending email",error);
        });
       


    } catch (error) {
        console.log("Error Occurred ",error);
        res.status(500).json({error:error.message});
    }
});


// endpoint to create new Password
const createNewPassword = asyncHandler(async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Alls fields are required"});
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Log the received OTP and the stored OTP for debugging
        console.log("Received OTP:", Number(otp));
        console.log("Stored OTP:", Number(user.OTP));

        if (Number(otp) === Number(user.OTP)) {
            user.password = await bcrypt.hash(newPassword, saltRounds);
            await user.save();
            res.status(200).json({ message: "Password Successfully changed" });
        } else {
            return res.status(401).json({ error: "OTP didn't match" });
        }
    } catch (error) {
        console.log("Error While Creating New Password", error);
        res.status(500).json({ error: error.message });
    }
});


// endpoint for login 
const loginUser = asyncHandler(async(req,res) => {
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(401).json({error:"All fields are required"});
        };

        const user = await User.findOne({email});
        if(!user){
            return res.status(402).json({error:"Email or Password Incorrect"});
        }

        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return res.status(404).json({error:"Password or Email Incorrect"});
        }
       const token =  tokenGenerate(user._id,user.name,user.role,user.location,user.profilePicture,res);
        res.cookie("USerName",user.name);
        res.status(200).json({message:"Logged in Successfully",user:user,token});

    } catch (error) {
        console.log("Error Occurred WHile logging User",error);
        res.status(500).json({error:error.message});
    }
});

// for logout logic
const logoutUser = asyncHandler(async(req,res) => {
    try {
        res.clearCookie('jwt',"",{maxAge:0});
        res.status(200).json({message:"LoggedOut Successfully"});
    } catch (error) {
        console.log("Error Occurred While logging out",error);
        res.status(500).json({error:error.message});

    }
})


//  fetch the details for logged in user 

// check endpoint for token check
const userDetail = asyncHandler(async(req,res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if(!user){
        return res.status(404).json({error:"User not found"});

      }
      res.status(200).json({user});
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}); 




module.exports = {registerUser,verifyStatus,forgotPassword,createNewPassword,loginUser,logoutUser,userDetail};