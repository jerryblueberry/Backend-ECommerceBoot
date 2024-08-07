const express = require('express');
const { addProduct, getProductDetails, getProducts, mobileApi, mobileBrands } = require('../controller/product-controller');
const { multipleUpload } = require('../middleware/uploadMiddleware');

const router   =  express.Router();

router.post('/add-product',multipleUpload,addProduct);
router.get('/all',getProducts)
router.get('/mobiles',mobileApi)
router.get('/mobile/brands',mobileBrands)
router.get('/detail/:sku',getProductDetails);




module.exports = router;