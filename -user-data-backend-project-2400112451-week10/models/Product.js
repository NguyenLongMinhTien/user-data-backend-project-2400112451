
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    author: {
        type: String,
        required: [true, 'Author name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    stockQuantity: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock quantity cannot be negative'],
        default: 0
    },
        // Tham chiếu N-N: Sách có thể thuộc nhiều Thể loại
    categories: [{
        type: mongoose.Schema. Types.ObjectId,
        ref: 'Category'
    }]
},{timestamps: true});

module.exports = mongoose.model('Product', productSchema);