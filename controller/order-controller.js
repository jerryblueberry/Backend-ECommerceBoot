const asyncHandler = require('express-async-handler');
const Order  = require('../models/order-model');
const Cart = require('../models/cart-model');
// Post Order
// left for post
const orderProduct = asyncHandler(async(req,res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            return res.status(400).json({message:"User Id Parameter Not Found"});

        }
        const userCart = await Cart.findOne({userId});

        if(!userCart){
            return res.status(400).json({error:"User's cart not found"});
        }
        if(userCart.total_price <100){
            return res.status(401).json({message:"Cart Total price must be above 100"});
        }

        // create a new Order
        const newOrder = new Order({
            userId,
            products:userCart.products,
            total_price:userCart.total_price,
        });

        const savedOrder = await newOrder.save();

        userCart.products = [],
        userCart.total_price = 0;

        await userCart.save();
        res.status(200).json({savedOrder});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

//  Get the orders of the user
const getOrders = asyncHandler(async(req,res) => {
    try {
        const  userId = req.user._id;
        if(!userId){
            return res.status(400).json({message:"Missing UserId Parameter"});

        }

        const orders = await Order.find({userId}).populate('products.product').populate('biddingProducts.product');
        res.status(200).json({orders});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

//  get orders for the stores
// const getOrderForStores = asyncHandler((req,res) => {
//     try {
//         const {}
//     } catch (error) {
//         res.status(200).json({error:error.message});
//     }
// })

module.exports = {orderProduct,getOrders};