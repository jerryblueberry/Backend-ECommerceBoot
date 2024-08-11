const express = require('express');
const { createStore, getStoreDetail, submitDocuments } = require('../controller/store-controller');
const {singleUploadStore, sellerDocuments, multipleUpload} = require('../middleware/uploadMiddleware');
const {verifyAuth, isSeller} = require('../middleware/authentication');

const router = express.Router();


router.post('/create-store',verifyAuth,isSeller,singleUploadStore,createStore);
router.post('/seller/documents',verifyAuth,sellerDocuments,submitDocuments)

router.get('/get-store/:storeId',getStoreDetail);






module.exports = router;

