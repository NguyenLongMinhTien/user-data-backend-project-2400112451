
const mongoose = require('mongoose');
// Ghi chú: Đây là Schema cho TỪNG MẶT HÀNG trong giỏ hàng (Embedded Schema)
const cartItemSchema = new mongoose. Schema ({
// Tham chiếu đến sản phẩm
product: {
    type: mongoose. Schema. Types.ObjectId,
    ref: 'Product', // Ghi chú: Cần có Model 'Product' để tham chiếu
    required: true
},
quantity: {
    type: Number,
    required: true,
    min: 1,
// Số lượng tối thiểu là 1
    default: 1
}
}, { id: false }); // Tắt id cho tài liệu nhúng này
// Ghi chú: Đây là Schema chính cho Giỏ hàng
const cartSchema = new mongoose. Schema ({
// Tham chiếu 1-1: Liên kết ngược lại với User
user: {
    type: mongoose.Schema. Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // BẮT BUỘC: Đảm bảo mỗi User chỉ có 1 tài liệu Cart duy nhất
},
// Nhúng: Mảng các mặt hàng trong giỏ
items: [cartItemSchema],
// Ghi chú: Có thể thêm các trường tính toán tổng (cached) để tăng tốc độ truy vấn
totalItems: {
    type: Number,
    default: 0
},
totalPrice: {
    type: Number,
    default: 0
}

}, { timestamps: true }); // Tự động thêm createdAt và updatedAt
module.exports = mongoose.model('Cart', cartSchema);