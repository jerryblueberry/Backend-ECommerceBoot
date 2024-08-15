const asyncHandler = require('express-async-handler');
const Store = require('../models/store-model');
const User = require('../models/user-model');



//  endpoint to find the store with the aggregration pipeline

const getStoresWithinRadius = asyncHandler(async(req,res) => {
    try {
        const userId  = req.user._id;
        const latitude = req.user.location.coordinates[1];
        const longitude = req.user.location.coordinates[0];
        if(!latitude || !longitude){
            return res.status(400).json({message:"Coordinates Missing"});

        }
         // Define the maximum distance (2KM) in meters
      const maxDistance = 2000;
  
      // Perform aggregation pipeline to find stores within 2KM radius of the provided location
      const stores = await Store.aggregate([
        {
          $geoNear: {
            near: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)]
            },
            distanceField: 'distance',
            maxDistance: maxDistance,
            spherical: true
          }
        }
      ]);
      res.status(200).json({stores});


    } catch (error) {
        res.status(500).json({error:error.message});
    }
})

module.exports = {getStoresWithinRadius}