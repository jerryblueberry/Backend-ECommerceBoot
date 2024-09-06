const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product"
            },
            quantity:{
                type:Number,
            }
        }
    ],
    biddingProducts:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Bidding",

            },
            quantity:{
                type:Number
            }
        }
    ],
    total_price:{
        type:Number
    },
    storeId:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Store",
        
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});

module.exports = mongoose.model('Order',OrderSchema);