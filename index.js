const express = require('express');
const connectDb = require('./database/db');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');

const User = require('./routes/user-routes'); // Routes for Users
const Store  = require('./routes/store-routes'); //Routes for Stores
const Product = require('./routes/product-routes'); //Routes for Products
const Admin = require('./routes/admin-routes'); //Routes for Admin
const Bidding = require('./routes/bidding-routes');
const Order = require('./routes/order-routes'); 
const Cart = require('./routes/cart-route');
const NearBy = require('./routes/nearby-routes');


const PORT  = 5000;



const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret:"MXIUuw6u5Ty0Ecih3XCjZ1+0575N2OTu0x9gsOl6pBc=",
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false} //set secure to true is you are using HTTPS
}))


app.use("/files",express.static(path.join(__dirname,"files")));

//       localhost:5000/user/register 
// routes for user
app.use('/user',User);
app.use('/store',Store);
app.use('/product',Product);
app.use('/admin',Admin);
app.use('/bidding',Bidding);
app.use('/order',Order);
app.use('/cart',Cart);
app.use('/nearby',NearBy);



app.listen(PORT,() => {
    console.log(`Listening on port ${PORT}`);
    connectDb();
})