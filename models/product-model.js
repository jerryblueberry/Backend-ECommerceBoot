const mongoose = require('mongoose');


const productSchema  = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        maxLength:300 // characterss limit
    },
    price:{
        type:Number,
    },
    qunatity:{
        type:Number,
    },
    images:{
        type:[String]
    },
    storeId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Store",
        required:true
    }

});

module.exports = mongoose.model("Product",productSchema);