const mongoose = require('mongoose');

const biddingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  brand:{
    type:String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
    maxLength: 1200,
  },
  price: {
    type: Number,
    required: true,
  },
  biddingStartTime: {
    type: Date,
  },
  isVisible:{
    type:Boolean,
    default:true,
  },
  biddingEndTime: {
    type: Date,
  },
  bids: [
    {
      bidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      amount: {
        type: Number,
      },
    },
  ],
  quantity: {
    type: Number,
  },
  images: {
    type: [String],
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
  },
  highlights: {
    type: [String],
    required: true,
  },
  color: { type: [String] },
  productDescription: {
    description1: {
      type: String,
      maxLength: 1000,
    },
    description2: {
      type: String,
      maxLength: 1000,
    },
    description1Img: {
      type: String,
    },
    description2Img: {
      type: String,
    },
  },
});

module.exports = mongoose.model('Bidding', biddingSchema);
