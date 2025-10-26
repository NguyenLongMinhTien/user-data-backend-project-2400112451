const mongoose = require('mongoose');

// Schema cho Mặt hàng (Embedded Schema)
const orderItemSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    quantity: {type: Number, required: true, min: 1},
    price: {type:Number, required: true, min: 0}
},{ _id: false});
// Ghi chú: { _id: fales} - Tắt ID riêng cho tài liệu nhúng để tối ưu

const orderSchema = new mongoose.Schema({
    // Tham chiếu: User đã tọa đơn hàng
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item:{
        type: [orderItemSchema],
        required: true
    },

    totalAmout: { type: Number, required: true, min: 0},
    status: {type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending'}
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);