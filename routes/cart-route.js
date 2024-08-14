const express = require('express');
const { verifyAuth } = require('../middleware/authentication');
const { addCart } = require('../controller/cart-controller');
const router = express.Router();

router.post('/add-cart',verifyAuth,addCart)

module.exports  = router;