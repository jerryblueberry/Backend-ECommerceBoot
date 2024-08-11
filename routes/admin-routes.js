const express = require('express');
const { isAdmin, verifyAuth } = require('../middleware/authentication');
const { getAllUser, updateStatusToSeller, getAllRequest } = require('../controller/admin-controller');
const router = express.Router();



router.get('/all',verifyAuth,isAdmin,getAllUser);
router.get('/seller/requests',verifyAuth,isAdmin,getAllRequest);
router.patch('/update/:userId',verifyAuth,isAdmin,updateStatusToSeller)
module.exports = router;