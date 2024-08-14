const express  = require('express');
const { verifyAuth } = require('../middleware/authentication');
const { getOrders, orderProduct } = require('../controller/order-controller');
const router = express.Router();
router.post('/',verifyAuth,orderProduct);
router.get('/all',verifyAuth,getOrders);
module.exports = router;