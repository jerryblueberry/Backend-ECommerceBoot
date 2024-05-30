const mongoose = require('mongoose');


const storeSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    name:{
        type:String,
        required:true,
    },
    logo:{
        type:String,
        
    },
    category:{
        type:String,
        enum:['electronics','fashion','home & furniture','health & beauty','baby & kids','books & stationery','sports & outdoors','grocery & gourment',"automotive",'electrical appliances'],
        required:true,
    },
    location:{
        type:{
            type:String,
            default:'Point',
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    },
    isverified:{
        type:Boolean,
        default:false,
    },
    contactNo:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        maxLength:250 //250 Characters
    },
    // banner
    // social links


});

const Store = mongoose.model("Store",storeSchema);
module.exports = Store;