const mongoose = require('mongoose');

const sellerDocumentsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    panCard: {
        type: String,
        required: true,
    },
    storeRegistration: {
        type: String,
        required: true,
    },
    identityCard: {
        type: String,
        required: true,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending',
    },
    reviewedAt: {
        type: Date,
    },
    adminComments: {
        type: String,
    },
});

const SellerDocuments = mongoose.model("SellerDocuments", sellerDocumentsSchema);
module.exports = SellerDocuments;
