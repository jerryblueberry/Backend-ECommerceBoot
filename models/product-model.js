const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  subCategory: { type: String, required: true, index: true },
  color: { type: [String] },
  size: { type: [String] },
  rating: { type: String },
  review: { type: String },
  description: { type: String, maxLength: 1000 },
  price: { type: Number, index: true },
  quantity: { type: Number },
  images: { type: [String] },
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true,
    index: true,
  },
  sku: { type: String, unique: true, required: true },
  discount: { type: Number, default: 0 },
  tags: { type: [String], index: true },
  brand: { type: String, index: true },
  dateAdded: { type: Date, default: Date.now, index: true },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
  },
  weight: { type: Number },
  status: {
    type: String,
    enum: ['in stock', 'out of stock', 'pre-order'],
    default: 'in stock',
    index: true,
  },
  ram:{
    type:[String]
  },
  storage:{
    type:[String]
  },
  highlights:{
    type:[String],
    required:true,
  },
  offers:{
    type:[String],
    
  },
  productDescription:{
    description1:{
      type:String,
      maxLength:1000,
    },
    description2:{
      type:String,
      maxLength:1000,
    },
    description1Img:{
      type:String,
    },
    description2Img:{
      type:String
    }

  }
});

productSchema.index({ category: 1, price: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
