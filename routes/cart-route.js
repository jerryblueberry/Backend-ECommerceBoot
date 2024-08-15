const express = require('express');
const { verifyAuth } = require('../middleware/authentication');
const { addCart, removeProduct, getCart } = require('../controller/cart-controller');
const router = express.Router();

router.post('/add-cart',verifyAuth,addCart);
router.get('/cart-detail',verifyAuth,getCart);
router.delete('/remove',verifyAuth,removeProduct);

module.exports  = router;