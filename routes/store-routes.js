const express = require('express');
const { createStore, getStoreDetail } = require('../controller/store-controller');
const {singleUploadStore} = require('../middleware/uploadMiddleware');
const {verifyAuth} = require('../middleware/authentication');
const router = express.Router();


router.post('/create-store',verifyAuth,singleUploadStore,createStore);
router.get('/get-store/:storeId',getStoreDetail);





module.exports = router;

