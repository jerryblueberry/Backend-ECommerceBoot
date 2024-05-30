const asyncHandler = require('express-async-handler');
const Product = require('../models/product-model');



const addProduct = asyncHandler(async(req,res) => {
    try {
        const {name,description,price,quantity,storeId} = req.body;

        if(!name || !description || !price || !quantity || !storeId){
            return res.status(400).json({error:"All fields are required"});
        }

        const newProduct = new Product({
            name,
            description,
            price,
            quantity,
            images:["abc.jpg",'abc.png'],
            storeId

        });

        await newProduct.save();
        res.status(200).json({message:"Product Added Successfully"});

        
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});


// get products detail
const getProductDetails = asyncHandler(async(req,res) => {
    try {
        const {productId} = req.body;

        if(!productId){
            return res.status(404).json({error:"Product Id must be provided"});
        }

        const product = await Product.findById(productId).populate("storeId",'name address');


        if(!product){
            return res.status(404).json({error:"Product Not found"});
        }
        res.status(200).json({product});


        
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});


const updateProduct = asyncHandler(async(req,res) => {
    try {
        const productId = req.params.productId;
        const {name,description,price,quantity,category,rating} = req.body;

        const product = await Product.findByIdAndUpdate(productId,{
            name,
            description,
            price,
            quantity,
            
        })
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})


//  left for the product
module.exports = {addProduct,getProductDetails};