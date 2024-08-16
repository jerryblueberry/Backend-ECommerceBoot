const express  = require('express');
const { verifyAuth, isSeller } = require('../middleware/authentication');
const { getOrders, orderProduct, getOrderForStores } = require('../controller/order-controller');
const router = express.Router();
router.post('/',verifyAuth,orderProduct);
router.get('/all',verifyAuth,getOrders);
router.get('/:storeId',verifyAuth,isSeller,getOrderForStores);

module.exports = router;