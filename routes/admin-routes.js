const express = require('express');
const { isAdmin, verifyAuth } = require('../middleware/authentication');
const { getAllUser } = require('../controller/admin-controller');
const router = express.Router();



router.get('/all',verifyAuth,isAdmin,getAllUser);
module.exports = router;