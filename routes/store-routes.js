const express = require('express');
const { createStore, getStoreDetail, submitDocuments, storeCheck, getProductsForStore } = require('../controller/store-controller');
const {singleUploadStore, sellerDocuments, multipleUpload} = require('../middleware/uploadMiddleware');
const {verifyAuth, isSeller} = require('../middleware/authentication');

const router = express.Router();


router.post('/create-store',verifyAuth,isSeller,singleUploadStore,createStore);
router.post('/seller/documents',verifyAuth,sellerDocuments,submitDocuments)
router.get('/seller/store-verify',verifyAuth,isSeller,storeCheck);
router.get('/seller/products/:storeId',verifyAuth,isSeller,getProductsForStore);
router.get('/get-store/:storeId',getStoreDetail);






module.exports = router;

