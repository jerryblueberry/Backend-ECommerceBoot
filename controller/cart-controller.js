const asyncHandler = require('express-async-handler');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model')
//  Add to Cart
const addCart = asyncHandler(async(req,res) => {
    try {
        const userId = req.user._id;
        const {product,quantity,price} = req.body;


        let userCart = await Cart.findOne({userId});

        if(!userCart){
            userCart = new Cart({
                userId,
                products:[{product,quantity,price}],
                total_price :0
            })
        }else{
            const exisitingProductIndex = userCart.products.findIndex((item) => item.product.toString() === product.toString());
            if(exisitingProductIndex !== -1){
                userCart.products[exisitingProductIndex].quantity +=1;

            }else{
                userCart.products.push({product,quantity,price})
            }
        }
        // calculate total price
        const products = await Product.find({
            _id: { $in: userCart.products.map((p) => p.product) },
          });
    
          userCart.total_price = products.reduce((total, product) => {
            const cartProduct = userCart.products.find(
              (p) => p.product.toString() === product._id.toString()
            );
            const productPrice =
              typeof product.price === 'number'
                ? product.price
                : parseFloat(product.price);
    
            return total + productPrice * cartProduct.quantity;
          }, 0);
          const savedCart = await userCart.save();
          res.status(200).json({userCart});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})


module.exports = {addCart}