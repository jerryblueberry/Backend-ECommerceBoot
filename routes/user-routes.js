
const express = require('express');
const {registerUser, verifyStatus, forgotPassword,createNewPassword, loginUser, logoutUser, userDetail}  = require('../controller/user-controller');
const { verifyAuth } = require('../middleware/authentication');
const { singleUpload } = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/register',singleUpload,registerUser);
router.post('/verify-otp',verifyStatus);
router.post('/password-recovery',forgotPassword);
router.post('/new/password',createNewPassword)
router.post('/login',loginUser);
router.post('/logout',logoutUser);
router.get('/user-detail/:userId',verifyAuth,userDetail);

module.exports = router;