const express = require('express');
const { addProduct, getProductDetails } = require('../controller/product-controller');

const router   =  express.Router();

router.post('/add-product',addProduct);
router.get('/detail',getProductDetails);



module.exports = router;