const express = require('express');
const { addProduct, getProductDetails, getProducts, mobileApi, mobileBrands, fashionCategories, updateProduct, deleteProduct } = require('../controller/product-controller');
const { multipleUpload, upload } = require('../middleware/uploadMiddleware');
const { verifyAuth, isSeller } = require('../middleware/authentication');

const router   =  express.Router();

router.post('/add-product/:storeId',upload,addProduct);
router.put('/update/:sku',verifyAuth,isSeller,upload,updateProduct)
router.delete('/delete/:sku',verifyAuth,isSeller,deleteProduct);
router.get('/all',getProducts)
router.get('/mobiles',mobileApi)
router.get('/:subCategory',fashionCategories)
router.get('/mobile/brands',mobileBrands)
router.get('/detail/:sku',getProductDetails);




module.exports = router;