const mongoose = require('mongoose');

const wishListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    ]
}, {
    timestamps: true 
});

// Ensure no duplicate products for the same user
wishListSchema.index({ userId: 1, products: 1 }, { unique: true });

const WishList = mongoose.model('WishList', wishListSchema);
module.exports = WishList;
