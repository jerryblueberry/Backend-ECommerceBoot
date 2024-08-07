const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    contactNo:{
        type:Number,
        
    },
    role:{
        type:String,
        enum:["admin","user","seller"],
        default:"user"
    },
    profilePicture:{
        type:String,
        // required:true
    },
    location:{
        type:{type: String,default:'Point'},
        coordinates:[Number],
    },
    OTP:{
        type:Number,
    },
    status:{
        type:Boolean,
        default:"false" // true === verified
    },




});
//   2d sphere index to the location field
userSchema.index({location:'2dsphere'});

userSchema.index({role:1});


const User = mongoose.model("User",userSchema);
module.exports = User;