
const mongoose = require('mongoose');
// Schema cho Mặt hàng (Embedded Schema)
const orderItemSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
        price:{
        type: Number,
        required: true,
        min: 0
    }
    }, { id: false });
    // Ghi chú: { id: false } Tắt ID riêng cho tài liệu nhúng để tối ưu.
    
    const orderSchema = new mongoose. Schema ({
    // Tham chiếu: User đã tạo đơn hàng
    user: {
        type: mongoose. Schema. Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Nhúng: Danh sách các mặt hàng đã mua (Tối ưu tốc độ đọc)
    items: {
        type: [orderItemSchema],
        required: true
    },

    totalAmount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order',orderSchema);