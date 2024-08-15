const express = require('express');
const { verifyAuth } = require('../middleware/authentication');
const { getStoresWithinRadius } = require('../controller/nearby-controller');
const router = express.Router();


router.get('/store',verifyAuth,getStoresWithinRadius)

module.exports = router;