const jwt = require('jsonwebtoken');


const tokenGenerate = (userId,userName,userRole,userLocation,userProfile,res) => {
    const token = jwt.sign({userId,userName,userRole,userLocation,userProfile},'MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=',{
        expiresIn:"15d"
    });
    res.cookie("jwt",token,{
        maxAge:15*60*60*24*1000, ///MS
        httpOnly:true, //Prevent XSS attacks cross-site scripting attacks
        sameSite:"strict", //CSRF attacks cross-site request forgery attacks
    })
    console.log("Generated ToKen : ",token);
    return token;
  
   
};

module.exports = {tokenGenerate};