const express = require('express');
const { addBiddingProduct, getAllBiddingProduct, getSpecificBiddingProduct, bidForProduct } = require('../controller/bidding-controller');
const { upload } = require('../middleware/uploadMiddleware');
const { verifyAuth, isSeller } = require('../middleware/authentication');
const router = express.Router();


router.post('/add-product/:storeId',verifyAuth,isSeller,upload,addBiddingProduct);
router.post('/place-bid/:productId',verifyAuth,bidForProduct);
router.get('/products',verifyAuth,getAllBiddingProduct);
router.get('/product/:productId',verifyAuth,getSpecificBiddingProduct);
module.exports = router;