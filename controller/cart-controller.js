const asyncHandler = require('express-async-handler');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
//  Add to Cart
const addCart = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { product, quantity, price } = req.body;

    let userCart = await Cart.findOne({ userId });

    if (!userCart) {
      userCart = new Cart({
        userId,
        products: [{ product, quantity, price }],
        total_price: 0,
      });
    } else {
      const exisitingProductIndex = userCart.products.findIndex(
        (item) => item.product.toString() === product.toString()
      );
      if (exisitingProductIndex !== -1) {
        userCart.products[exisitingProductIndex].quantity += 1;
      } else {
        userCart.products.push({ product, quantity, price });
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
      const productPriceWithDiscount =
        typeof product.price === 'number'
          ? product.price - (product.price * product.discount) / 100
          : parseFloat(product.price) -
            (parseFloat(product.price) * parseFloat(product.discount)) / 100;
      return total + productPriceWithDiscount * cartProduct.quantity;
    }, 0);
    const savedCart = await userCart.save();
    res.status(200).json({ savedCart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// endpoint to get the users cart
const getCart = asyncHandler(async(req,res) => {
    try {
        const userId = req.user._id;
        const userCart = await Cart.findOne({userId}).populate('products.product');
        if(!userCart){
            return res.status(404).json({message:'Cart not found'});

        }
        res.status(200).json({userCart});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

// endpoint to remove specific product
const removeProduct = asyncHandler(async (req, res) => {
  const { product } = req.body;
  try {
    const userId = req.user._id;
    let userCart = await Cart.findOne({ userId });
    if (userCart) {
      const productIndex = userCart.products.findIndex(
        (item) => item.product.toString() === product.toString()
      );
      if (productIndex !== -1) {
        userCart.products.splice(productIndex, 1);
        await updateCartTotal(userCart);
        userCart = await userCart.save();
        res.status(200).json({userCart});
      }else{
        res.status(404).json({message:"Product not found in Cart"});
      }
    }else{
        return res.status(404).json({message:"Cart not found for the given user"});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const updateCartTotal = async (userCart) => {
  try {
    const products = await Product.find({
      _id: { $in: userCart.products.map((p) => p.product) },
    });
    userCart.total_price = products.reduce((total,product) => {
        const cartProduct = userCart.products.find((p) => p.product.toString() === product._id.toString());
        const productPriceWithDiscount =
        typeof product.price === 'number'
          ? product.price - (product.price * product.discount) / 100
          : parseFloat(product.price) -
            (parseFloat(product.price) * parseFloat(product.discount)) / 100;
      return total + productPriceWithDiscount * cartProduct.quantity;
    },0)
    await userCart.save();
  } catch (error) {
    console.error("Error Updating cart Total",error);
  }
};

module.exports = { addCart,getCart,removeProduct };
