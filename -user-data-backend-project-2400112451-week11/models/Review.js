
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required:true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        trim: true,
    },
    
}, { timestamps: true });

// Ghi chú: Index để đảm bảo 1 user chi đánh giá 1 sản phẩm 1 lần (unique: true)
reviewSchema.index(
    { user: 1, product: 1},
     {unique: true }
);

module.exports = mongoose.model('Review', reviewSchema);