const mongoose = require('mongoose');

const wishlistSchema = new mongoose. Schema ({
// Tham chiếu 1-1: BẮT BUỘC unique: true
    user: {
        type: mongoose. Schema. Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true    
    },

    // Nhúng & Tham chiếu: Mảng các Product ID
    products: [{
        type: mongoose. Schema. Types.ObjectId,
        ref: 'Product'
    }],

    itemCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);