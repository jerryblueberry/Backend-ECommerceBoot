const User = require('../models/user-model');
const jwt = require('jsonwebtoken');

const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    console.log('Received Token', token);
    if (!token) {
      throw new Error('jwt must be provided');
    }
    const decoded = jwt.verify(
      token,
      'MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc='
    );
    console.log('DEcoded TOken', decoded);

    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized- Invalid Token' });
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    req.user = user;
    console.log('Req user', req.user);

    next();
  } catch (error) {
    console.log('Error Occurred While Verifying token', error);
    res.status(500).json({ error: error.message });
  }
};

//  for admin auth and authorization
const isAdmin = (req, res, next) => {
  // console.log('User:', req.user); // Log the user object
  if (req.user.role === 'admin') {
    next(); // User has the "Admin" role, proceed to the next middleware or route handler
  } else {
    return res
      .status(403)
      .json({ message: 'Forbidden: Only admin can perform this action' });
  }
};

const isSeller = (req,res,next) => {
    if(req.user.role ==="seller"){
        next();
    }else{
        return res.status(403).json({message:"Forbidden : Only Seller can perform this action"});
    }
}



module.exports = { verifyAuth, isAdmin,isSeller };
