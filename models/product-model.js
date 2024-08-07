const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true, // Adding index
  },
  category: {
    type: String,
    required: true,
    index: true, 
  },
  subCategory: {
    type: String,
    required: true,
    index: true, 
  },
  color: {
    type: [String],
  },
  size: {
    type: [String],
  },
  rating: {
    type: String, // Later on will use the ref by making Rating Table
  },
  review: {
    type: String, // Later same for the review table ref
  },
  description: {
    type: String,
    maxLength: 1000, // Characters limit
  },
  price: {
    type: Number,
    index: true,
  },
  quantity: {
    type: Number,
  },
  images: {
    type: [String],
  },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
  sku: {
    type: String,
    unique: true,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  tags: {
    type: [String],
    index: true,
  },
  brand: {
    type: String,
    index: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
    index: true,
  },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  weight: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['in stock', 'out of stock', 'pre-order'],
    default: 'in stock',
    index: true, 
  }
});


productSchema.index({ category: 1, price: 1 }); 

// Text index example
productSchema.index({ name: 'text', description: 'text', tags: 'text' }); 

module.exports = mongoose.model('Product', productSchema);
