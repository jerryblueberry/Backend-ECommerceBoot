const asyncHandler = require('express-async-handler');
const Bidding = require('../models/biddingProduct-model');
const Order = require('../models/order-model');
const moment = require('moment');
const schedule = require('node-schedule');


//  for adding bidding Product;
const addBiddingProduct = asyncHandler(async(req,res) => {
    try {
        const {storeId} = req.params;
       const {name,brand,description1,description2,highlights,category,description,price,biddingStartTime,biddingEndTime,quantity} = req.body;
   
       
       const imageFiles = req.files['images']
       ? req.files['images'].map((file) => file.path)
       : [];
     const colorFiles = req.files['color']
       ? req.files['color'].map((file) => file.path)
       : [];
     const descriptionImage1 = req.files['description1Img']
       ? req.files['description1Img'][0].path
       : null;
     const descriptionImage2 = req.files['description2Img']
       ? req.files['description2Img'][0].path
       : null;
       const parsedHighlights = highlights
       ? highlights.split(',').map((highlight) => highlight.trim())
       : [];

       const newProduct = new Bidding({
        name,
        description,
        price,
        brand,
        category,
        biddingStartTime,
        biddingEndTime,
        highlights:parsedHighlights,
        quantity,
        images:imageFiles,
        color:colorFiles,
        productDescription: {
            description1,
            description2,
            description1Img: descriptionImage1,
            description2Img: descriptionImage2,
          },
        bids:[],
        store:storeId
       });
       const savedProduct = await newProduct.save();
       res.status(200).json({message:"Product Added Successfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});


//  For Bidding in the product
const bidForProduct = asyncHandler(async(req,res) => {
    try {
        const userId = req.user._id;
        const {amount} = req.body;
        const {productId} = req.params;
        
        const product = await Bidding.findById(productId);

        if(!product){
            return res.status(404).json({message:"Product Not Found"});
        }
        //  Find the user's existing Bid for the product
        const existingBidIndex = product.bids.findIndex(bid=> bid.bidder.toString() === userId);
        // for checking if user have already placed a bid , update the existing bid\
        if(existingBidIndex !== -1){
            product.bids[existingBidIndex].amount =amount;
        }else{
            // Check if the bid amount is higher than the current highest bid or the initial price
            const highestBidAmount = product.bids.length > 0 ? Math.max(...product.bids.map(bid => bid.amount)):product.price;
            if(amount <= highestBidAmount){
                return res.status(400).json({message:'Bid amount must be higher than the current highest bid or initial price'});
            }
        
            product.bids.push({bidder:userId,amount});
        }
        await product.save();

        res.status(200).json({message:'Bid Placed Successfully'});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})


// Function to calculate the remaining time in human readable format
const calculateTimeRemaining = (endTime) => {
    const now = moment(); //get current time;
    const end = moment(endTime); //get the bid end Time;

    //  Calculate the difference between now and the end time 
    const duration = moment.duration(end.diff(now));

    // Get the remaining days,hours,minutes,and seconds
    const days  = duration.days();
    const hours =duration.hours();
    const minutes = duration.minutes();
    const seconds = duration.seconds();


    //  format the remaining time
    let remainingTime = "";
    if (days > 0) {
        remainingTime += `${days} days `;
      }
      if (hours > 0) {
        remainingTime += `${hours} hours `;
      }
      if (minutes > 0) {
        remainingTime += `${minutes} minutes `;
      }
      if (seconds > 0) {
        remainingTime += `${seconds} seconds`;
      }
      return remainingTime.trim();
}

//  get all the bidding products
const getAllBiddingProduct = asyncHandler(async(req,res) => {
    try {
        const products = await Bidding.find({isVisible:true}).populate({
            path: 'bids',
            populate: {
              path: 'bidder',
              select: 'name'
            }
          }).populate('store','_id name');
        if(!products){
            return res.status(400).json({message:"Did not Find the Bidding Product"});
        }
        // Iterate through each bidding Product to find the highest bidder and highest bid amount
        const productsWithHighestBid = products.map(product => {
            const highestBid = product.bids.reduce((maxBid,bid) => {
                return bid.amount> maxBid.amount? bid:maxBid;

            },{amount:product.price});

            const remainingTime = calculateTimeRemaining(product.biddingEndTime);

            const highestBidder = highestBid.bidder? highestBid.bidder.name:'Be the First Bidder';
            // Modify the structure to include highestBidderName below highestBid
            return{
                ...product.toObject(),
                highestBid:highestBid.amount,
                highestBidder:highestBidder,
                remainingTime:remainingTime,
            }
        });

        res.status(200).json({productsWithHighestBid})

        // res.status(200).json({products});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
});

// Get Specific Bidding Products
const getSpecificBiddingProduct = asyncHandler(async(req,res) => {
    try {
        const {productId} = req.params;
        const product = await Bidding.findById(productId).populate({
            path: 'bids',
            populate: {
              path: 'bidder',
              select: 'name'
            }
          }).populate('store','_id name');
        if(!product){
            return res.status(400).json({message:"Product Didn't Find"});
        }

        // Find the highest bid for the product
        const highestBid = product.bids.reduce((maxBid,bid) => {
            return bid.amount > maxBid.amount ? bid:maxBid;
        },{amount:product.price});

        // Get reamaining time 
        const remainingTime = calculateTimeRemaining(product.biddingEndTime);
        // Highest bidder name
        const highestBidder = highestBid.bidder? highestBid.bidder.name:'Be the First One to Bid';

        //  Construct the repsonse objects with the highes bid information

        const productsWithHighestBid = {
            ...product.toObject(),
            highestBid: highestBid.amount,
            highestBidder:highestBidder,
            remainingTime:remainingTime
        }

        res.status(200).json(productsWithHighestBid);
        // res.status(200).json({product});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
})


//  Function to update the bidding Status of the products to Not show After time ends 
const updateBiddingStatus = async() => {
    try {
        const productToUpdate = await Bidding.find({isVisible:true,biddingEndTime:{$lt: new Date()}});

        // Update the isVisible to false for the products
        await Promise.all(productToUpdate.map(async(product) => {
            product.isVisible =false;
            await product.save();

            // If there are bids for these products
            if(product.bids.length>0){
                const highestBid = product.bids.reduce((maxBid,bid) => {
                    return bid.amount > maxBid.amount ? bid: maxBid;
                },{amount:product.price});
                

                // Create a new ORder with highest bidder and the product
                const newOrder = new Order({
                    userId:highestBid.bidder,
                    
                    biddingProducts:[{product:product._id,quantity:product.quantity}],
                    total_price:highestBid.amount,

                });

                await newOrder.save();

                

            }
        }));
        console.log('Bidding Status Updated Successfully');
    } catch (error) {
        console.log("Error Updating Bidding Status",error);
    }
};

// Schedule the updateBiddingStatus to run every minute
schedule.scheduleJob('* * * * *',updateBiddingStatus);
module.exports = {
    addBiddingProduct,
    bidForProduct,
    getAllBiddingProduct,
    getSpecificBiddingProduct
}